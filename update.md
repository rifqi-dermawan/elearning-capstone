# Analisis Kesenjangan Komprehensif (Comprehensive Gap Analysis): Purwarupa AI E-Learning vs Standar Enterprise LMS (Moodle-like)

Dokumen ini memaparkan analisis mendalam mengenai arsitektur, fungsionalitas, dan fitur yang saat ini belum tersedia pada purwarupa *E-Learning Recommendation System* jika dikomparasikan dengan standar industri *Learning Management System* (LMS) berskala penuh seperti Moodle atau Canvas.

---

## 1. Sistem Autentikasi & Manajemen Pengguna (User Management)
Sebuah LMS mewajibkan pengelolaan identitas yang ketat, aman, dan terstruktur.

* **Standar LMS:** Memiliki sistem *Login/Register* terenkripsi, reset kata sandi, profil pengguna, dan *Role-Based Access Control* (RBAC) yang kompleks (Administrator, Manajer, Guru/Kreator Kursus, Siswa, dan Tamu).
* **Kondisi Purwarupa Saat Ini:** Tidak ada sistem autentikasi. Simulasi pengguna (*user switching*) dilakukan melalui manipulasi statis pada antarmuka *dropdown* `<select>` di `src/app/page.tsx`. Data profil pengguna tidak ada.
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Implementasi otentikasi berbasis token (JWT) atau *Session* menggunakan **NextAuth.js / Auth.js**.
  * Halaman profil pengguna untuk melacak biodata dan preferensi belajar.
  * *Middleware* pada Next.js untuk memproteksi rute (*route protection*) agar siswa tidak bisa mengakses halaman `/admin`.

## 2. Manajemen Konten & Pembangun Kursus (Course Builder & CMS)
Sistem pengarsipan dan pembuatan materi yang fleksibel bagi instruktur.

* **Standar LMS:** Mendukung pembuatan silabus dinamis (*drag-and-drop*), pengunggahan multi-format (PDF, Video MP4, Audio, Dokumen), integrasi paket SCORM/xAPI, manajemen kategori kursus, dan pembatasan akses (*enrollment key* atau penjadwalan akses).
* **Kondisi Purwarupa Saat Ini:** Data modul terpusat secara statis (*hardcoded*) di dalam variabel *array* `daftarModul` pada `src/lib/data.ts`. Halaman admin (`src/app/admin/page.tsx`) hanya bersifat *Read-Only* tanpa kapabilitas modifikasi data.
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Antarmuka *Rich Text Editor* (seperti Quill atau TinyMCE) bagi instruktur untuk menulis materi.
  * Sistem *File Storage* terintegrasi (misal: AWS S3 atau Cloudinary) untuk menyimpan *assets* materi.
  * API REST/GraphQL lengkap (CRUD) untuk memanipulasi data modul secara *real-time*.

## 3. Pengalaman Belajar & Antarmuka Kelas (Learning Workspace)
LMS membutuhkan ruang kelas virtual tempat materi dikonsumsi secara sekuensial.

* **Standar LMS:** Memiliki *Course Player* khusus yang menavigasi siswa bab-demi-bab. Terdapat indikator kemajuan (*Progress Bar*), tombol penyelesaian (*Mark as Done*), dan pencegahan siswa melompati materi yang belum dikuasai (*Prerequisites*).
* **Kondisi Purwarupa Saat Ini:** Hanya memiliki katalog di halaman beranda. Tombol **"Mulai Belajar"** bersifat pasif dan tidak merender halaman detail materi (*Course Player*).
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Halaman dinamis (*Dynamic Routes*) seperti `/course/[id]/chapter/[chapterId]` untuk menyajikan materi secara spesifik.
  * Pelacakan *State* penyelesaian materi per modul yang dikirim ke *database* secara asinkron.

## 4. Mesin Evaluasi & Penilaian (Assessment & Grading Engine)
Jantung dari sebuah LMS untuk mengukur kompetensi.

* **Standar LMS:** Memiliki *Quiz Engine* dengan dukungan berbagai tipe soal (Pilihan Ganda, Esai, Mencocokkan), pengacakan soal (*Question Bank*), pembatasan waktu (*Timer*), penilaian otomatis (*Auto-grading*), anti-kecurangan, dan Buku Nilai (*Gradebook/Rapor*).
* **Kondisi Purwarupa Saat Ini:** Logika rekomendasi AI di `api/recommend/route.ts` mensimulasikan skor kecocokan berdasarkan data `rating` fiktif yang diketik manual di `userLogs`. Belum ada metode nyata untuk mendapatkan nilai tersebut dari pengguna.
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Modul pembuatan kuis terstruktur dengan relasi *One-to-Many* (1 Kuis -> Banyak Soal).
  * Sistem evaluasi yang menghasilkan skor objektif, di mana skor ini akan menjadi *feedback loop* atau parameter penentu bagi AI untuk merekomendasikan langkah pembelajaran selanjutnya.

## 5. Komunikasi, Kolaborasi, & Interaksi Sosial (Social Learning)
Pendidikan modern membutuhkan interaksi dua arah antara siswa dan instruktur.

* **Standar LMS:** Menyediakan Forum Diskusi, Sistem Pesan Pribadi (DM), fitur pengumuman kelas (*Announcements*), dan kolom komentar pada setiap materi/modul.
* **Kondisi Purwarupa Saat Ini:** Sistem sepenuhnya asinkronus dan individualistik. Tidak ada jembatan komunikasi antar-pengguna.
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Pembuatan skema *Database* untuk komentar dan forum.
  * (Opsional) Penggunaan WebSockets (*Socket.io* atau *Pusher*) untuk obrolan *real-time* atau notifikasi sistem.

## 6. Gamifikasi & Penghargaan (Gamification & Certification)
Elemen penting untuk menjaga retensi dan motivasi belajar pengguna.

* **Standar LMS:** Pemberian Lencana (*Badges*), Papan Peringkat (*Leaderboards*), serta generator Sertifikat (PDF) ber-barcode otomatis ketika pengguna menyelesaikan sebuah *Course*.
* **Kondisi Purwarupa Saat Ini:** Belum ada sistem penghargaan (*reward system*).
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Algoritma penghitung Poin Pengalaman (XP) berdasarkan penyelesaian tugas.
  * Fitur *generate* sertifikat menggunakan pustaka seperti `pdf-lib` atau `puppeteer`.

## 7. Arsitektur Basis Data & Infrastruktur (Backend & Infrastructure)
Sistem fundamental agar aplikasi dapat menampung ribuan pengguna serentak.

* **Standar LMS:** Berjalan di atas basis data relasional (SQL) atau NoSQL skala besar, menerapkan isolasi data antar organisasi (*Multi-tenancy*), memiliki sistem *Backup* otomatis, dan arsitektur *Microservices*.
* **Kondisi Purwarupa Saat Ini:** Menggunakan memori sementara (*in-memory/local variable*) pada file TypeScript `src/lib/data.ts`.
* **Kebutuhan Pengembangan (LMS-Grade):**
  * Pembuatan basis data permanen menggunakan **PostgreSQL** atau **MySQL**.
  * Penggunaan ORM (Object-Relational Mapping) seperti **Prisma** atau **Drizzle** untuk memastikan validasi tipe data (*Type-Safety*) selaras dengan ekosistem Next.js.
  * *Caching* materi (menggunakan Redis) untuk mempercepat muatan antarmuka pengguna.

---

### Kesimpulan & Batasan Lingkup Capstone (Scope Limitation)
Membangun LMS berskala penuh membutuhkan sumber daya dan waktu pengembangan bertahun-tahun. Oleh karena itu, batasan lingkup (*scope*) dari proyek Capstone ini **secara sengaja** difokuskan eksklusif pada:
**"Perancangan Algoritma AI (Content-Based Filtering) untuk Personalisasi Rekomendasi E-Learning"**. 

Infrastruktur pendukung lainnya (CRUD, Autentikasi, Evaluasi) disimulasikan menggunakan arsitektur purwarupa (*Mock-up architecture*) untuk memvalidasi performa dan metrik keakurasian mesin AI (*AI Recommender Engine*).