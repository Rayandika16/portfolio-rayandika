// SEMUA ISI WEBSITE ADA DI FILE INI.
// Ubah teks di sini, simpan, lalu push ke GitHub — Vercel akan otomatis memperbarui website.
// Gambar proyek & foto sertifikat: folder public/images/  (mis. '/images/inventaris.png')
// Logo perusahaan: folder public/logos/  (mis. '/logos/npl-indo.png')

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Karya Pilihan', href: '/#work' },
  { label: 'Sertifikasi', href: '/#certifications' },
  { label: 'Kontak', href: '/#contact' },
]

export const content = {
  profile: {
    name: 'RP',
    title: 'Rayandika',
    email: 'rayandika10@gmail.com', // TODO: ganti dengan alamat Gmail Anda
    linkedin: 'https://www.linkedin.com/in/rayandika', // mis. 'https://www.linkedin.com/in/username' (kosongkan untuk menyembunyikan)
    resume: '', // mis. '/resume.pdf' (taruh file di folder public/) — kosongkan untuk menyembunyikan
  },

  hero: {
    badge: 'Open to Work & Projects',
    headline: 'Frontend Web Developer.',
    subheadline:
      'Halo, saya Rayandika Putra. Saya berfokus pada pengembangan Frontend Website serta memiliki pemahaman teknis di bidang jaringan komputer. Silakan hubungi saya jika Anda tertarik dengan karya-karya saya.',
    primaryCta: 'View More',
  },

  credibility: [
    { label: 'Pendidikan', value: 'S1 Teknik Informatika, UNPAM' },
    { label: 'Fokus Utama', value: 'Aplikasi Web & Sistem Bisnis' },
    { label: 'Rekam Jejak', value: 'Pengembangan Perangkat Lunak & Operasional Teknis Langsung' },
  ],

  sections: {
    work: {
      title: 'Proyek',
      description: 'Perusahaan dan organisasi yang pernah saya bantu, beserta apa yang saya kerjakan. Dari mulai proyek nyata dan latihan.',
      cta: 'Lihat Semua Proyek',
    },
    projectsPage: {
      title: 'Semua proyek',
      description: 'Daftar lengkap proyek yang pernah saya kerjakan. Klik salah satu untuk melihat rinciannya.',
    },
    certifications: {
      title: 'Sertifikasi dan pelatihan',
      description: 'Kredensial dan pelatihan yang mendukung pekerjaan saya. Klik untuk melihat foto dan penjelasannya.',
    },
    contact: {
      title: 'Tersedia untuk Peluang Engineering & Proyek Teknis',
      description:
        'Untuk diskusi rekrutmen, pembahasan lingkup proyek, atau pertanyaan teknis, kirim pesan atau gunakan email di bawah.',
    },
  },

  // Beranda menampilkan 4 proyek teratas (sesuai urutan); halaman /projects menampilkan semuanya.
  //
  //  short       keterangan satu kalimat di daftar
  //  logo        logo perusahaan di daftar (kosong = tampil inisial)
  //  description penjelasan sederhana di modal: apa yang Anda buat
  //  image       foto/screenshot di modal. Bawaan = sampul ilustrasi; GANTI dengan screenshot asli
  //              (taruh di public/images/, mis. '/images/inventaris.png')
  //  github,demo tautan tombol di modal. Selama kosong, tombolnya tampil nonaktif ("belum tersedia")
  //  visible     false = sembunyikan proyek tanpa menghapusnya
  projects: [
    {
      id: 'inventory',
      title: 'Sistem Manajemen Inventaris',
      client: 'CV Hamparan Artha Citra',
      domain: 'Operasional Bisnis Internal & Rantai Pasok',
      short: 'Aplikasi web untuk mencatat stok barang masuk dan keluar secara digital.',
      logo: '', // mis. '/logos/hamparan-artha-citra.png'
      description:
        'Aplikasi web untuk mencatat dan memantau stok barang secara digital. Setiap barang masuk dan keluar tercatat, sehingga stok selalu bisa diperiksa dan dilaporkan. Dibuat untuk menggantikan pencatatan manual yang rawan salah hitung.',
      stack: ['Aplikasi Web', 'Database Relasional', 'Logika Inventaris', 'Akses Berbasis Peran'],
      image: '/images/inventaris.svg', // TODO: ganti dengan screenshot asli
      imageAlt: 'Sampul proyek Sistem Manajemen Inventaris',
      github: '', // mis. 'https://github.com/username/repo'
      demo: '', // mis. 'https://demo-anda.vercel.app'
      visible: true,
    },
    {
      id: 'logistics',
      title: 'Platform Korporat & Logistik B2B',
      client: 'NPL Indo',
      domain: 'Logistik B2B & Kehadiran Digital',
      short: 'Website perusahaan logistik B2B yang responsif dan mudah dipahami klien.',
      logo: '', // mis. '/logos/npl-indo.png'
      description:
        'Website perusahaan logistik B2B yang saya bangun ulang agar layanan lebih mudah dipahami klien korporat. Tampil rapi di desktop maupun seluler dan dimuat dengan cepat.',
      stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Swiper.js'],
      image: '/images/logistik-b2b.svg', // TODO: ganti dengan screenshot asli
      imageAlt: 'Sampul proyek Platform Korporat dan Logistik B2B',
      github: '',
      demo: '',
      visible: true,
    },
    {
      id: 'fgd',
      title: 'Operasi Teknis & Infrastruktur AV untuk FGD Langsung',
      client: 'DOS',
      domain: 'Operasi Riset Kritis & Integrasi Sistem',
      short: 'Penyiapan audio, perekaman cadangan, dan jaringan ganda untuk sesi FGD langsung.',
      logo: '', // mis. '/logos/dos.png'
      description:
        'Penyiapan perangkat audio, perekaman cadangan, dan jaringan ganda untuk sesi Focus Group Discussion langsung, agar rekaman dan pemantauan klien tidak terputus.',
      stack: ['Integrasi Sistem', 'Audio Gain Staging', 'Perekaman Redundan', 'Network Bonding'],
      image: '/images/operasi-fgd.svg', // TODO: ganti dengan foto asli
      imageAlt: 'Sampul proyek Operasi Teknis dan Infrastruktur AV untuk FGD',
      github: '',
      demo: '',
      visible: true,
    },
  ],

  // type: 'Sertifikasi' atau 'Pelatihan'. Klik pada baris akan membuka foto + penjelasan.
  // image = foto sertifikat (taruh di public/images/), description = penjelasan singkat,
  // url   = tautan verifikasi kredensial (opsional). Kosongkan array untuk menyembunyikan section.
  // TODO: lengkapi penerbit, tahun, foto, dan penjelasan; tambahkan sertifikasi/pelatihan lain.
  credentials: [
    {
      id: 'frontend-web-developer',
      type: 'Sertifikasi',
      title: 'Frontend Web Developer',
      issuer: '',
      year: '',
      description: '',
      image: '',
      imageAlt: '',
      url: '',
    },
  ],

  contact: {
    // Isi dengan URL form Formspree (mis. 'https://formspree.io/f/xxxxxxx') agar pesan dari pengunjung
    // langsung terkirim ke Gmail Anda tanpa pengunjung membuka apa pun. Langkahnya ada di README.
    // Jika dikosongkan: tombol "Kirim pesan" membuka tab Gmail dengan pesan yang sudah terisi.
    formEndpoint: '-',
  },

  footer: { text: '© 2026 Rayandika Putra.' },
}

export const DEFAULT_CONTENT = content
