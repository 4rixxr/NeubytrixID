# Revisi UI dan debugging — NeubytrixID 1.2.0

Pemeriksaan fungsi awal: **18 Oktober 2026**. Revisi visual dan pemeriksaan browser ulang: **19 Oktober 2026**.

## UI

Struktur referensi diterapkan: tujuan belajar → masalah belajar → demo fitur → perbandingan cara belajar → ajakan mulai. SNBT, Kuliah, Sekolah, Ujian Mandiri, PPPK, dan SKD masuk ke pengaturan tujuan belajar.

Versi 1.2.0 merombak pendekatan visual menjadi halaman belajar dengan tipografi IBM Plex Sans/Serif, latar kertas, aksen merah bata, garis pembatas, serta sudut sederhana. Hero dua kolom menghadirkan catatan fotosintesis dan pertanyaan yang dapat dicoba langsung. Pemilihan tujuan memakai tab, demonstrasi fitur memakai navigasi bernomor, dan perbandingan tetap terbaca dalam dua kolom pada ponsel. Dashboard mengutamakan judul materi berikutnya dan statistik ringkas. Navigasi, login, onboarding, materi, dan warna ruang belajar diselaraskan; bintang dekoratif serta kartu pastel pemasaran dihapus. Font dibundel beserta lisensi. Klaim fitur yang belum tersedia tetap tidak ditambahkan.

## Bug yang diperbaiki

| Area | Temuan | Perbaikan |
| --- | --- | --- |
| Login lokal | Kode asing diterima; password terbaca | Verifikasi profil terdaftar; PBKDF2 + salt; migrasi setelah verifikasi |
| Profil | Data global bercampur; identitas Google berubah | Data per kode; UID Google stabil |
| Progres | State lama menimpa XP terbaru | Mutasi membaca penyimpanan terbaru |
| Onboarding | Statistik nol menjadi statistik contoh | Akun baru nol; preferensi tidak mereset progres |
| Kuis | Jawaban terakhir/XP dihitung ganda | Hasil tunggal, validasi jumlah soal, reward sekali |
| Flashcard | Review/XP berulang tanpa jadwal | Wajib buka jawaban, guard review, tanggal/interval tersimpan |
| Check-in | Bonus dan pergantian hari tidak konsisten | Klaim sekali, level setelah bonus, streak putus setelah melewatkan hari |
| Waktu | Tab latar ikut dihitung; durasi timer ganda | Waktu aktif saja; timer deadline stabil; tanpa penambahan durasi kedua |
| AI | Rahasia tertanam; kegagalan tampak sukses | Konfigurasi server, health akurat, error terlihat, tanpa jawaban/XP palsu |
| Chat | Respons terlambat mengisi chat yang sudah dibersihkan | Abort dan guard generasi; pertanyaan gagal dipulihkan; Markdown aman |
| Dokumen | PDF/DOCX dibaca sebagai biner; error tersembunyi | Parser format asli, batas ukuran, status lokal/cloud jujur |
| PDF/browser | API typed-array baru gagal pada Chromium 133 | Bundle PDF.js legacy dan worker dengan polyfill |
| Cloud | Aturan publik, kode dianggap otorisasi | Aturan UID pemilik, bucket privat, tidak ada sukses sinkronisasi palsu |
| SQL | Reset otomatis dapat menghapus data | Reset destruktif dinonaktifkan; skema opsional tidak dijalankan |
| Produksi | Source server berada pada area statis | Pisah client/server; source dan source map ditolak |
| Storage | JSON rusak/quota mengganggu aplikasi | Guard, fallback memori, peringatan ekspor cadangan |
| Dependensi | 7 kerentanan pada audit awal | Pembaruan lockfile, parser DOCX diganti, override gRPC diperbaiki |
| TypeScript | Pemeriksaan ikut memindai hasil build | Batasi include/exclude dan nonaktifkan pemeriksaan JS hasil build |

## Hasil verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run lint` | Lulus TypeScript |
| `npm test` | 30/30 lulus pada audit fungsi 18 Oktober; logika inti tidak diubah dalam revisi visual |
| `npm run build` | Berhasil; peringatan ukuran chunk masih ada |
| `npm run test:e2e` | 17/17 lulus kembali pada 19 Oktober, termasuk interaksi contoh sesi baru; Chromium 133 headless |
| `npm audit` | 0 kerentanan dilaporkan pada lockfile saat pemeriksaan |
| Visual | Landing dan dashboard desktop/ponsel, tema gelap; overflow diperiksa pada lebar 320, 375, 768, 1024, dan 1440 px |

Tes browser mencakup landing/demo/FAQ/tema, onboarding Kuliah, check-in/reload, daftar/keluar/masuk lokal, penolakan kode asing, Escape dialog, hasil kuis/XP, flashcard/jadwal, profil, timer/pindah menu/pause/reset, AI gagal tanpa XP, Markdown respons simulasi, pelepasan dokumen chat, ekstraksi TXT/PDF/DOCX/PPTX nyata, format tidak didukung, pencarian kosong, tampilan 375 px, dan penolakan source server.

Tes API memakai provider simulasi: respons valid, error provider tanpa membocorkan rahasia, skema materi salah, validasi input, rate limit, OCR, JSON rusak, dan endpoint tidak dikenal. Tidak ada panggilan AI berbayar atau perubahan database cloud selama pengujian.

## Batas audit

- Lulus berlaku pada skenario/lingkungan yang diuji; bukan jaminan bebas seluruh bug.
- Gemini nyata, kualitas jawaban/soal/OCR, Google OAuth, aturan Firestore terpasang, dan Supabase nyata belum diuji dengan kunci/akun pengguna. Konfigurasi disiapkan, cloud belum diterapkan.
- Safari, Firefox, perangkat fisik, pembaca layar, dan pengujian beban belum diuji.
- Sinkronisasi penuh progres/riwayat antarperangkat, impor cadangan lewat UI, dan antrean retry cloud belum tersedia.
- Endpoint AI belum memiliki autentikasi server dan kuota per akun. Rate limit per IP belum cukup untuk penerapan berbayar ke publik.
- Isi akademik materi contoh warisan tidak diaudit menyeluruh. Hasil AI perlu diperiksa pengguna.
- Audit dependensi berlaku saat pemeriksaan. Bundle awal masih dapat dioptimalkan.

## Penyerahan

Arsip memuat source revisi, lockfile, `.env.example` tanpa rahasia, aturan cloud/skema opsional, build produksi, tes/fixture, README, dan laporan ini. Tidak menyertakan `node_modules`, kredensial asli, cache browser, screenshot QA, atau artefak tes gagal.

**Konfigurasi berikutnya:** cabut/rotasi kunci Gemini pada arsip lama; isi `.env.local` dengan kunci pengganti untuk AI. Siapkan layanan cloud hanya jika Google/sinkronisasi dibutuhkan.
