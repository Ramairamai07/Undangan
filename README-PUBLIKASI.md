# Undangan Pernikahan Digital – Adat Jawa

Situs statis (HTML, CSS, JavaScript) yang dapat langsung dipublikasikan di GitHub Pages. RSVP, ucapan, dan daftar tamu disimpan di **Google Sheets** melalui Google Apps Script.

## Isi repositori

| Berkas | Fungsi |
| --- | --- |
| `index.html` | Halaman utama undangan, termasuk login admin dan dasbor |
| `assets/` | Enam foto (cover, mempelai wanita, mempelai pria, tiga foto galeri) dan `bg.jpg` sebagai latar halaman |
| `apps-script/Code.gs` | Kode backend yang ditempel ke Google Sheets |
| `README-PUBLIKASI.md` | Panduan ini |

## Langkah 1 – Unggah ke GitHub

1. Buat repositori baru di GitHub, misalnya `undangan-serly-rahmat`.
2. Unggah semua isi folder ini ke cabang `main`. `index.html` harus berada di akar repositori.

## Langkah 2 – Siapkan Google Sheets sebagai database

1. Buat **Google Sheet baru** dengan nama bebas, misalnya "Database Undangan".
2. Buka **Extensions → Apps Script**.
3. Hapus kode bawaan, lalu tempel seluruh isi `apps-script/Code.gs`. Klik **Save**.
4. Klik **Deploy → New deployment**. Pada ikon roda gigi pilih **Web app**, lalu isi:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Klik **Deploy** dan setujui izin akses Google (pilih **Advanced → Go to ... (unsafe)** jika muncul peringatan, karena skrip ini milik Anda sendiri).
6. Salin **Web app URL** yang berakhiran `/exec`.
7. Buka `index.html`, cari baris berikut, lalu tempel URL tadi:

   ```js
   const SB={url:'https://script.google.com/macros/s/XXXXXXXX/exec'};
   ```

Sheet **RSVP**, **Ucapan**, dan **Tamu** dibuat otomatis saat pertama kali dipakai. Setiap RSVP yang masuk langsung terlihat di Google Sheet Anda.

**Kata sandi admin** tertulis di baris pertama `apps-script/Code.gs` (`ADMIN_PASSWORD`). Nilainya tersimpan di Google, bukan di `index.html`, sehingga tidak terbaca dari repositori publik. Setiap kali Anda mengubah isi `Code.gs`, buka **Deploy → Manage deployments → ikon pensil → Version: New version → Deploy** agar perubahan berlaku.

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
2. Masukkan kata sandi admin (nilai `ADMIN_PASSWORD` di `Code.gs`).
3. Tab **Undangan**, **Tamu**, **RSVP**, dan **Ucapan** mengelola data. Laporan RSVP dapat diunduh sebagai CSV yang bisa dibuka di Excel. Anda juga bisa membuka Google Sheet langsung.
4. Tab **Desain** membuka panel pengaturan warna, cover, dan bagian yang ditampilkan, dengan pratinjau langsung.

## Hal yang perlu diketahui

- **Jaga kerahasiaan Google Sheet.** Jangan bagikan link sheet-nya. Data RSVP hanya dapat dibaca melalui dasbor dengan kata sandi atau langsung lewat akun Google Anda.
- **Keamanan sandi.** Kata sandi diperiksa di server Google, tetapi tidak ada batas percobaan. Pakai sandi yang panjang dan unik, dan jangan membagikannya di tempat yang bisa dilihat tamu.
- **Pengaturan desain tersimpan di browser admin saja.** Tamu melihat tampilan bawaan dari kode. Agar perubahan berlaku untuk semua tamu, ubah nilai bawaan pada `const DEF={...}` di `index.html` (warna, foto cover, dan tampilan bagian).
- **Sebelum URL Web App diisi,** RSVP dan ucapan hanya tersimpan di browser masing-masing, dan login admin belum aktif.
- **Kecepatan.** Google Apps Script kadang butuh 1–3 detik untuk merespons, terutama pada pengiriman pertama.
- **Musik latar** dibuat langsung oleh browser (nada pentatonik lembut), jadi tidak ada berkas audio. Pemutaran dimulai setelah tamu menekan tombol "Buka Undangan".
- **Pratinjau di WhatsApp:** agar muncul gambar, tambahkan `<meta property="og:image">` dengan alamat gambar lengkap, misalnya `https://NAMA-PENGGUNA.github.io/NAMA-REPO/assets/cover.jpg`.
