-- Jalankan SETELAH Anda membuat user di Authentication -> Users -> Add user.
-- Ganti email di bawah dengan email user tersebut, lalu Run.
insert into public.admins (user_id)
select id from auth.users where email = 'rayandika10@gmail.com'
on conflict do nothing;

-- Cek hasilnya (harus ada 1 baris):
-- select * from public.admins;
