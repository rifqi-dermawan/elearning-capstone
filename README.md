# 🎓 LearnAI - Aplikasi E-Learning Berbasis AI Recommendation System

LearnAI adalah platform e-learning cerdas yang merekomendasikan materi pembelajaran secara personal. Sistem tidak hanya mengandalkan popularitas materi, tetapi mempertimbangkan histori belajar (*learning behavior*), rating, serta keterkaitan konsep (*concept similarity*) antar materi menggunakan algoritma **Hybrid Recommendation System** (Content-Based & Collaborative Filtering).

Proyek ini dibangun sebagai penyelesaian tugas Capstone Program Studi Informatika.

---

## 🎯 Capstone Requirements & Fulfillment

Aplikasi ini telah memenuhi seluruh spesifikasi tugas akhir yang disyaratkan:

- ✅ **AI Minimum (Recommender):** Menggunakan algoritma **Hybrid** (Jaccard Similarity untuk *Content-Based* dan Cosine Similarity untuk *Collaborative Filtering*).
- ✅ **Input & Output:** Mengambil dataset histori pengguna (Click, Complete, Rating) dan menghasilkan Top 5 Rekomendasi dilengkapi teks **Alasan (Explainable AI)**.
- ✅ **Novelty AI:** Mempertimbangkan keterkaitan konsep/silabus (`ConceptRelation`) untuk memprioritaskan materi lanjutan.
- ✅ **Uji 5 User Dummy:** Sistem memiliki 5 profil *dummy* (*seed data*) yang menghasilkan *output* rekomendasi kontras sesuai *behavior* masing-masing.
- ✅ **Simulasi CTR:** Terdapat pencatatan metrik interaksi (Click-Through Rate) secara *real-time* saat widget rekomendasi diklik oleh *user*.

---

## 🚀 Fitur Utama

1. **Smart Dashboard:** Menampilkan "Top 5 Rekomendasi" khusus untuk pengguna yang sedang *login*.
2. **Explainable AI:** Pengguna dapat melihat alasan transparan mengapa suatu materi direkomendasikan (misal: *"Karena kamu tertarik pada Web & Frontend"* atau *"Materi lanjutan langsung berdasar alur belajar..."*).
3. **Activity Logging:** Merekam setiap aksi `CLICK` dan `COMPLETE` serta penilaian (`RATING`) secara otomatis di *background*.
4. **Admin / Lecturer Panel:** Manajemen *module* (materi), penentuan relasi antar konsep materi, dan pemantauan analitik pengguna.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** Next.js (App Router)
- **Bahasa:** TypeScript
- **Database ORM:** Prisma ORM
- **Database Engine:** MySQL / MariaDB
- **Styling:** Tailwind CSS & Shadcn UI

---

## ⚙️ Cara Instalasi & Menjalankan di Lokal

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### Prasyarat
- **Node.js** 
- **MySQL** 

### 1. Clone Repository
git clone https://github.com/username/elearning-capstone.git
cd elearning-capstone

### 2. Install Dependencies
npm install

### 3. Konfigurasi Environment Variable
Buat file `.env` di root project. Anda bisa mencontek format di bawah ini:

**File: `.env`**
# Database Configuration
# Ganti user, password, dan nama database sesuai settingan MySQL lokal Anda
DATABASE_URL="mysql://root:password@localhost:3306/elearning_db"

# Better Auth Configuration
# Generate secret acak (bisa pakai 'openssl rand -base64 32')
BETTER_AUTH_SECRET="random_secret_string_min_32_chars"
BETTER_AUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SMTP Configuration (Untuk fitur email)
# Contoh menggunakan Gmail App Password
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="emailmudisini@gmail.com"
SMTP_PASSWORD="app_password_gmail"

### 4. Setup Database
Jalankan perintah prisma untuk melakukan push skema ke database MySQL Anda.
npx prisma db push

*(Opsional)* Jika ingin melihat/mengedit data secara visual:
npx prisma studio

### 5. Jalankan Server Development
npm run dev
Buka http://localhost:3000 di browser Anda.

---

## 🧪 Skenario Pengujian AI (Untuk Dosen / Penguji)

Untuk memvalidasi algoritma personalisasi, pastikan untuk melakukan injeksi data *dummy* (modul, relasi konsep, dan 5 akun mahasiswa untuk pengujian) dengan menjalankan skrip berikut di terminal:
npx tsx src/lib/seed.ts

Setelah berhasil, gunakan kredensial berikut (Password untuk semua akun: `password123`):

1. **User Frontend** (`andi@test.com`)
   - *Histori:* Menyelesaikan modul HTML, CSS, JavaScript.
   - *Ekspektasi Output:* AI merekomendasikan React dan TypeScript (Content-Based).
2. **User Backend** (`budi@test.com`)
   - *Histori:* Menyelesaikan modul Database dan API.
   - *Ekspektasi Output:* AI merekomendasikan Docker dan backend tingkat lanjut.
3. **User Concept-Relation Target** (`citra@test.com`)
   - *Histori:* Menyelesaikan modul AI Fundamentals.
   - *Ekspektasi Output:* AI mendeteksi relasi konsep dan merekomendasikan "Neural Networks" dengan alasan eksplisit sebagai **Materi Lanjutan** (*Pembuktian Novelty*).
4. **User Cold Start** (`dani@test.com`)
   - *Histori:* Akun baru, belum ada interaksi yang signifikan.
   - *Ekspektasi Output:* Fallback ke sistem rekomendasi materi Terpopuler.
5. **User Full-Stack** (`eva@test.com`)
   - *Histori:* Minat campuran (Frontend & API).
   - *Ekspektasi Output:* Rekomendasi Hybrid berdasarkan kemiripan dengan *user* lain (Collaborative Filtering).

*(Untuk login ke dasbor pengajar/admin, gunakan email `admin@test.com` dengan password `password123`)*.

---

## 👨‍💻 Pengembang

**Moh Rifqi Alfi Dermawan**
Program Studi Informatika
