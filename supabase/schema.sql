-- =====================================================================
-- Skema CMS portofolio untuk Supabase.
-- Jalankan SELURUH file ini di: Dashboard Supabase -> SQL Editor -> New query -> Run.
-- Aman dijalankan ulang.
-- =====================================================================

-- 1) Daftar admin. Tanpa policy = tidak bisa dibaca/diubah lewat API publik.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

-- Fungsi pengecekan admin (dipakai oleh policy dan oleh halaman /admin).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2) Konten website (satu baris berisi seluruh isi dalam format JSON).
create table if not exists public.site_content (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null check (octet_length(data::text) < 500000),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "Publik boleh membaca konten" on public.site_content;
create policy "Publik boleh membaca konten"
  on public.site_content for select to anon, authenticated using (true);

drop policy if exists "Admin boleh menambah konten" on public.site_content;
create policy "Admin boleh menambah konten"
  on public.site_content for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin boleh mengubah konten" on public.site_content;
create policy "Admin boleh mengubah konten"
  on public.site_content for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3) Penyimpanan gambar & PDF (bucket publik untuk dibaca, hanya admin yang bisa mengunggah).
--    SVG sengaja tidak diizinkan (risiko skrip berbahaya). Maks. 5 MB per file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin boleh mengunggah media" on storage.objects;
create policy "Admin boleh mengunggah media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin boleh mengubah media" on storage.objects;
create policy "Admin boleh mengubah media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin boleh menghapus media" on storage.objects;
create policy "Admin boleh menghapus media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
