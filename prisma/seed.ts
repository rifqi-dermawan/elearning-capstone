import { PrismaClient, Level, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Sedang membuat data awal untuk database (Seeding)...');

  // Buat User (Admin, Dosen, Mahasiswa)
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elearning.com' },
    update: {},
    create: {
      name: 'Admin Sistem',
      email: 'admin@elearning.com',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const lecturer = await prisma.user.upsert({
    where: { email: 'dosen@elearning.com' },
    update: {},
    create: {
      name: 'Bapak Dosen',
      email: 'dosen@elearning.com',
      password: passwordHash,
      role: Role.LECTURER,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'mahasiswa@elearning.com' },
    update: {},
    create: {
      name: 'Mahasiswa Berprestasi',
      email: 'mahasiswa@elearning.com',
      password: passwordHash,
      role: Role.STUDENT,
    },
  });
  console.log('✓ Pengguna (admin, dosen, mahasiswa) berhasil dibuat');

  // Bersihkan modul lama agar tidak duplikat jika dieksekusi berulang
  await prisma.conceptRelation.deleteMany();
  await prisma.module.deleteMany();

  // Buat Katalog Modul Pembelajaran
  const htmlCss = await prisma.module.create({
    data: {
      title: 'Dasar-Dasar HTML & CSS untuk Web Design',
      description: 'Pelajari dasar pembuatan website yang responsif dan menarik menggunakan blok penyusun utama web: HTML dan CSS. Anda akan belajar tentang elemen dasar, semantik tag, atribut, tata letak Flexbox dan Grid, serta seni menyusun tampilan visual yang modern.',
      tags: JSON.stringify(['Web Dev', 'Frontend', 'HTML', 'CSS', 'Beginner']),
      level: Level.BEGINNER,
      thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const javascript = await prisma.module.create({
    data: {
      title: 'Pemrograman JavaScript Interaktif',
      description: 'Pahami lebih dalam konsep inti bahasa pemrograman spesifik web: JavaScript. Mulai dari variabel, fungsi, array method, pengkondisian, perulangan, DOM manipulation ringan, hingga dasar asynchronous (Promise/Async-Await).',
      tags: JSON.stringify(['Web Dev', 'Frontend', 'JavaScript', 'Logic']),
      level: Level.BEGINNER,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const reactBasic = await prisma.module.create({
    data: {
      title: 'Pengenalan Terapan React.js',
      description: 'Jelajahi keunggulan React.js untuk pengembangan antarmuka web yang terukur. Kursus ini membahas arsitektur component, manajemen state lokal menggunakan hooks (useState, useEffect), serta cara melempar data dengan props di aplikasi SPA.',
      tags: JSON.stringify(['Web Dev', 'Frontend', 'React', 'SPA']),
      level: Level.INTERMEDIATE,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const nextjs = await prisma.module.create({
    data: {
      title: 'Mastering Framework Next.js (App Router)',
      description: 'Membangun aplikasi web level korporat yang super cepat dengan Framework Next.js dari Vercel. Pelajari pola canggih seperti Server Side Rendering (SSR), Static Site Generation (SSG), Server Components, dan integrasi API Routes.',
      tags: JSON.stringify(['Web Dev', 'Fullstack', 'Next.js', 'React']),
      level: Level.ADVANCED,
      thumbnail: 'https://images.unsplash.com/photo-1618477247222-ac60ceb0a416?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const nodejs = await prisma.module.create({
    data: {
      title: 'Backend Fundamental Node.js & Express',
      description: 'Saatnya beralih ke sisi belakang layar! Kelola server mandiri, hubungkan aplikasi ke database, dan buat sistem RESTful API yang aman dengan Node.js bersama kerangka kerja Express.',
      tags: JSON.stringify(['Web Dev', 'Backend', 'Node.js', 'API']),
      level: Level.INTERMEDIATE,
      thumbnail: 'https://images.unsplash.com/photo-1627398225058-f4a406950697?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const uiux = await prisma.module.create({
    data: {
      title: 'Prinsip UI/UX untuk Developer',
      description: 'Sebagai developer, mengetahui dasar figma dan pengalaman pengguna akan mempercepat pekerjaan Front-end. Pahami teori warna, layouting typography, dan Wireframing yang efektif.',
      tags: JSON.stringify(['Design', 'UI/UX', 'Figma', 'Visual']),
      level: Level.BEGINNER,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const python = await prisma.module.create({
    data: {
      title: 'Python Dasar untuk Data Science',
      description: 'Pengenalan bahasa Python dan library esensial seperti Pandas, NumPy, dan Matplotlib untuk pengolahan serta visualisasi data.',
      tags: JSON.stringify(['Data Science', 'Python', 'Beginner']),
      level: Level.BEGINNER,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const machineLearning = await prisma.module.create({
    data: {
      title: 'Machine Learning Fundamental',
      description: 'Pelajari konsep dasar algoritma pembelajaran mesin seperti Regresi, Klasifikasi, dan Clustering menggunakan Scikit-Learn.',
      tags: JSON.stringify(['AI', 'Machine Learning', 'Python']),
      level: Level.INTERMEDIATE,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });

  const deepLearning = await prisma.module.create({
    data: {
      title: 'Deep Learning & Neural Networks',
      description: 'Membangun arsitektur jaringan saraf tiruan (Neural Networks) dan pemrosesan bahasa alami (NLP) untuk kecerdasan buatan lanjutan.',
      tags: JSON.stringify(['AI', 'Deep Learning', 'Neural Network']),
      level: Level.ADVANCED,
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
      published: true,
    }
  });
  console.log('✓ Katalog Modul berhasil dibuat');

  // Buat Concept Relations (Untuk Data Rekomendasi/AI Engine)
  await prisma.conceptRelation.createMany({
    data: [
      { sourceId: uiux.id, targetId: htmlCss.id, weight: 0.6 },
      { sourceId: htmlCss.id, targetId: javascript.id, weight: 0.9 },
      { sourceId: javascript.id, targetId: reactBasic.id, weight: 0.95 },
      { sourceId: javascript.id, targetId: nodejs.id, weight: 0.8 },
      { sourceId: reactBasic.id, targetId: nextjs.id, weight: 0.95 },
      { sourceId: nodejs.id, targetId: nextjs.id, weight: 0.6 },
      // AI & Data Science Concept Relations
      { sourceId: python.id, targetId: machineLearning.id, weight: 0.9 },
      { sourceId: machineLearning.id, targetId: deepLearning.id, weight: 0.95 },
    ]
  });
  console.log('✓ Relasi Pembelajaran (Concept Relations untuk AI) dibuat');

  console.log('🎉 Seeding Selesai! Database siap digunakan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
