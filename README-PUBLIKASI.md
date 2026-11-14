# Undangan Pernikahan Digital – Adat Jawa

Situs statis (HTML, CSS, JavaScript) yang dapat langsung dipublikasikan di GitHub Pages. RSVP, ucapan, dan daftar tamu disimpan di Supabase.

## Isi repositori

| Berkas | Fungsi |
| --- | --- |
| `index.html` | Halaman utama undangan, termasuk login admin dan dasbor |
| `assets/` | Enam foto (cover, mempelai wanita, mempelai pria, tiga foto galeri) dan `bg.jpg` sebagai latar halaman |
| `supabase-setup.sql` | Tabel dan aturan keamanan database RSVP, ucapan, dan tamu |
| `README-PUBLIKASI.md` | Panduan ini |

## Langkah 1 – Unggah ke GitHub

1. Buat repositori baru di GitHub, misalnya `undangan-serly-rahmat`.
2. Unggah semua isi folder ini ke cabang `main`. `index.html` harus berada di akar repositori.

## Langkah 2 – Siapkan Supabase

1. Buat proyek gratis di <https://supabase.com>.
2. Buka **SQL Editor**, tempel isi `supabase-setup.sql`, lalu klik **Run**.
3. Buka **Authentication → Providers → Email** dan matikan **Allow new users to sign up**. Ini mencegah orang lain mendaftar sebagai admin.
4. Buka **Authentication → Users → Add user**, lalu buat akun admin (email dan kata sandi yang kuat). Centang auto-confirm.
5. Buka **Project Settings → API**, lalu salin **Project URL** dan **anon public key**.
6. Buka `index.html`, cari baris berikut di awal bagian `<script>`, lalu isi:

   ```js
   const SB={url:'https://xxxx.supabase.co',key:'ANON_KEY_ANDA',demoPass:''};
   ```

Kunci `anon` memang boleh tampil di situs publik. Keamanan data dijaga oleh aturan Row Level Security di `supabase-setup.sql`: tamu hanya bisa mengirim RSVP dan ucapan, sedangkan membaca RSVP dan mengelola tamu hanya bisa dilakukan setelah login admin. Jangan pernah memasukkan `service_role key` ke berkas ini.

## Langkah 3 – Aktifkan GitHub Pages

1. Buka repositori, lalu **Settings → Pages**.
2. Pada **Build and deployment**, pilih **Deploy from a branch**, cabang `main`, folder `/ (root)`, lalu **Save**.
3. Tunggu sekitar satu menit. Alamat undangan: `https://NAMA-PENGGUNA.github.io/NAMA-REPO/`.

## Langkah 4 – Ganti foto

Timpa berkas di `assets/` dengan foto Anda, **dengan nama yang sama**. Semua berkas saat ini masih gambar pengganti bertuliskan "Ganti dengan foto".

| Berkas | Dipakai untuk | Saran |
| --- | --- | --- |
| `cover.jpg` | Latar halaman pembuka | Potret, sisi panjang sekitar 1600 px |
| `mempelai-wanita.jpg`, `mempelai-pria.jpg` | Kartu profil | Rasio 3:4, sekitar 900 × 1200 px |
| `galeri-1.jpg` sampai `galeri-3.jpg` | Galeri | Sekitar 1000 px, kompres di squoosh.app |
| `bg.jpg` | Latar seluruh halaman | Sudah dioptimalkan |

Kompres setiap foto hingga di bawah 300 KB agar undangan cepat dibuka di HP. Foto galeri lebih dari tiga dapat ditambahkan pada daftar `let gal=ld('gal',[...])` di `index.html`.

## Langkah 5 – Sesuaikan isi undangan

Cari teks berikut di `index.html` lalu ganti dengan data yang benar:

- **Nama, orang tua, dan Instagram:** bagian `id="profil"`.
- **Tanggal:** teks "24 April 2027" di cover, kartu acara, dan bagian siaran langsung. Ubah juga `new Date('2027-04-24T08:00:00+07:00')` untuk hitung mundur, serta `20270424T010000Z/20270424T070000Z` untuk Google Calendar (waktu UTC).
- **Lokasi dan jam acara:** bagian `id="acara"`, termasuk tautan Google Maps dan `src` peta.
- **Rekening, QRIS, dan alamat kado:** bagian `id="gift"`.
- **Link siaran langsung dan video prewedding:** tombol di `id="live"` dan `id="galeri"` (ganti `https://www.youtube.com/`).

## Langkah 6 – Bagikan ke tamu

Tambahkan `?to=Nama Tamu` di ujung alamat. Contoh: `https://NAMA-PENGGUNA.github.io/NAMA-REPO/?to=Budi%20Santoso`. Nama itu muncul otomatis di cover. Admin dapat membuat dan menyalin link tiap tamu, atau mengirimnya lewat WhatsApp, dari tab **Tamu** di dasbor.

## Dasbor admin

1. Klik tombol **⚿** di bawah tombol musik.
2. Masuk dengan email dan kata sandi admin Supabase.
3. Tab **Undangan**, **Tamu**, **RSVP**, dan **Ucapan** mengelola data. Laporan RSVP dapat diunduh sebagai CSV yang bisa dibuka di Excel.
4. Tab **Desain** membuka panel pengaturan warna, cover, dan bagian yang ditampilkan, dengan pratinjau langsung.

## Hal yang perlu diketahui

- **Pengaturan desain tersimpan di browser admin saja.** Tamu melihat tampilan bawaan dari kode. Agar perubahan berlaku untuk semua tamu, ubah nilai bawaan pada `const DEF={...}` di `index.html` (warna, foto cover, dan tampilan bagian).
- **Mode demo tanpa Supabase.** Jika `url` dan `key` dikosongkan, RSVP dan ucapan hanya tersimpan di browser masing-masing. Login admin demo aktif hanya jika `demoPass` diisi. Jangan memakai kata sandi pribadi di sini karena nilainya terlihat di kode publik.
- **Musik latar** dibuat langsung oleh browser (nada pentatonik lembut), jadi tidak ada berkas audio. Pemutaran dimulai setelah tamu menekan tombol "Buka Undangan".
- **Repositori publik:** semua isi `index.html` dapat dibaca siapa saja. Jangan menaruh data pribadi selain yang memang ingin ditampilkan di undangan.
- **Pratinjau di WhatsApp:** agar muncul gambar, tambahkan `<meta property="og:image">` dengan alamat gambar lengkap, misalnya `https://NAMA-PENGGUNA.github.io/NAMA-REPO/assets/cover.jpg`.
