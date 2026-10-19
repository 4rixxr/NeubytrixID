# NeubytrixID 1.2.0

Ruang belajar dengan materi, kuis, flashcards, timer fokus, progres, dan tutor AI opsional. UI mengikuti struktur file **Pintarly - AI Tutor untuk SNBT, Kuliah & Sekolah.md**, dengan identitas NeubytrixID.

## Revisi tampilan 1.2.0

Halaman depan dan ruang belajar menggunakan tipografi IBM Plex, latar kertas, aksen merah bata, serta susunan yang lebih fokus pada materi. Pilihan tujuan belajar berbentuk tab; contoh fotosintesis bisa dibaca dan dijawab langsung. Kartu promosi pastel dan ornamen bintang dihapus. Dashboard menampilkan materi berikutnya, statistik dalam satu baris, serta akses cepat tanpa tumpukan kartu. Font dibundel lokal agar tampil konsisten tanpa mengambil font dari layanan eksternal; lisensinya tersedia pada folder `licenses`.

## Menjalankan aplikasi

Gunakan **Node.js 22.14 atau lebih baru** dan npm. Dari folder proyek:

```sh
npm ci
npm run dev
```

Buka `http://localhost:3000`. Materi contoh, kuis, flashcards, dan profil lokal dapat dicoba tanpa API key. Pilih tujuan belajar untuk memulai sebagai tamu, atau buka **Masuk → Buat profil**.

Untuk mode produksi lokal:

```sh
npm run build
npm start
```

Arsip menyertakan build. `npm ci` tetap diperlukan karena dependensi server tidak disertakan. Build menghasilkan `dist/client` dan `dist/server.cjs`; hanya `dist/client` yang dipublikasikan sebagai berkas statis.

## Konfigurasi AI

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `GEMINI_API_KEY` dengan kunci Anda. Jangan menaruh rahasia pada variabel berawalan `VITE_`.
3. Jalankan ulang server. Model default: `gemini-3.1-flash-lite`; dapat diubah melalui `GEMINI_MODEL` sesuai dukungan akun Anda.

Tanpa kunci, aplikasi menampilkan pesan AI belum tersedia. Tidak ada jawaban palsu atau XP untuk permintaan gagal. Teks dokumen tetap bisa disimpan. Pembuatan ringkasan, kuis, flashcards, serta OCR foto/PDF hasil scan memerlukan AI. Untuk materi berstatus belum dianalisis, unggah kembali setelah AI dikonfigurasi.

**Kunci Gemini tertanam ditemukan pada arsip lama dan sudah dihapus dari kode revisi. Cabut/rotasi kunci lama pada penyedia API sebelum menggunakan kunci pengganti.**

## Profil dan penyimpanan

- Profil tamu dan perangkat disimpan per kode di browser. Password profil perangkat menggunakan PBKDF2 dengan salt acak, bukan teks biasa.
- Profil perangkat adalah pemisah profil lokal, bukan autentikasi server. Kode tidak membuat data tersedia otomatis di perangkat lain. Akses langsung ke penyimpanan browser masih dapat mengubah data lokal.
- Progres tersimpan pada origin/browser yang sama. Menghapus data situs dapat menghapusnya. **Pengaturan → Ekspor cadangan** mengunduh JSON; UI impor belum tersedia.
- Waktu belajar dihitung saat tab terlihat dan ada interaksi dalam lima menit terakhir. Timer tetap berjalan saat pindah menu, tetapi tidak dipulihkan setelah reload.
- Check-in hanya sekali per tanggal lokal. Kartu yang dipahami dijadwalkan mulai esok hari; yang belum dipahami jatuh tempo kembali setelah sepuluh menit.

## Google dan cloud opsional

Untuk Google/Firebase, gunakan proyek sendiri, aktifkan provider Google, izinkan domain aplikasi, buat Firestore, lalu isi `VITE_FIREBASE_*` sesuai `.env.example`. Tinjau dan terapkan `firestore.rules` pada proyek tersebut; aturan membatasi data ke UID pemilik. Restart development server, atau build ulang produksi karena `VITE_*` dibaca saat build.

Sinkronisasi UI terbatas pada dokumen. XP, jadwal flashcard, seluruh progres, dan riwayat chat belum menjadi data lintas perangkat. Kegagalan cloud tetap ditandai lokal dan belum mempunyai antrean retry otomatis. Migrasi data dari struktur database lama perlu direncanakan tersendiri.

Adapter `src/services/supabaseService.ts` bersifat opsional dan tidak digunakan ruang belajar utama. Adapter memerlukan sesi Supabase Auth tersendiri, `supabase/schema.sql`, dan bucket privat. Login Firebase tidak otomatis memberikan sesi Supabase. Skrip reset destruktif lama dinonaktifkan. Tidak ada perubahan yang telah dijalankan pada database cloud Anda.

## Dokumen

Didukung: PDF berteks, DOCX, PPTX, TXT, Markdown, CSV, JSON, PNG, JPG/JPEG, WebP. Batas: 10 MB, 100.000 karakter, PDF 100 halaman, PPTX 200 slide. Foto/PDF tanpa teks memerlukan AI. `.doc`, `.ppt`, dokumen terenkripsi, dan layout kompleks tidak dijamin dapat diproses. Parser mengekstrak teks, bukan mempertahankan tampilan aslinya.

## Pengujian

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

`lint` memeriksa TypeScript. Tes browser menjalankan build produksi pada port 3000 tanpa kunci Gemini. Hentikan server lain pada port tersebut sebelum pengujian. Chromium yang sudah terpasang dapat dipilih melalui `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Hasil dan batas pemeriksaan: [AUDIT_DAN_PERUBAHAN.md](AUDIT_DAN_PERUBAHAN.md).

## Batas penerapan publik

Endpoint AI memiliki validasi, timeout, dan rate limit per IP, tetapi belum memiliki autentikasi server atau kuota biaya per akun. Tambahkan keduanya sebelum membuka endpoint berkunci berbayar ke publik. Isi `TRUST_PROXY_HOPS` sesuai topologi proxy yang benar. Profil lokal bukan pengganti autentikasi tersebut.

Build masih memberi peringatan ukuran chunk SDK Firebase/parser PDF. Parser dan ruang belajar dimuat terpisah, tetapi unduhan awal masih dapat dioptimalkan.

Referensi: [model Gemini](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite) dan [aturan Firestore](https://firebase.google.com/docs/firestore/security/rules-conditions).
