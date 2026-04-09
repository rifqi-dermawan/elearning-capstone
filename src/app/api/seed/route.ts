import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // ─── Modules ──────────────────────────────────────────
    const modules = [
      { id: "m1", title: "Dasar HTML & CSS", description: "Belajar struktur dan gaya dasar halaman web dari nol. Materi meliputi tag HTML, selector CSS, box model, dan flexbox.", tags: JSON.stringify(["Web", "Frontend", "HTML", "CSS"]), level: "BEGINNER" as const },
      { id: "m2", title: "JavaScript Modern", description: "Kuasai JavaScript ES6+ untuk logika frontend: arrow function, async/await, destructuring, dan module system.", tags: JSON.stringify(["Web", "Frontend", "JavaScript"]), level: "INTERMEDIATE" as const },
      { id: "m3", title: "Pengenalan Database", description: "Simpan dan kelola data dengan MySQL: DDL, DML, relasi tabel, dan query dasar.", tags: JSON.stringify(["Database", "Backend", "MySQL"]), level: "BEGINNER" as const },
      { id: "m4", title: "API dengan Next.js", description: "Membuat REST API menggunakan Next.js Route Handlers. Meliputi GET, POST, PUT, DELETE, middleware, dan autentikasi.", tags: JSON.stringify(["Web", "Backend", "NextJS", "API"]), level: "INTERMEDIATE" as const },
      { id: "m5", title: "AI Fundamentals", description: "Konsep dasar kecerdasan buatan: supervised learning, unsupervised learning, dan reinforcement learning.", tags: JSON.stringify(["AI", "Machine Learning", "Data Science"]), level: "BEGINNER" as const },
      { id: "m6", title: "React Hooks Deep Dive", description: "Kuasai useState, useEffect, useContext, useReducer, dan cara membuat custom hooks untuk state management.", tags: JSON.stringify(["Web", "Frontend", "React", "JavaScript"]), level: "INTERMEDIATE" as const },
      { id: "m7", title: "Neural Networks 101", description: "Belajar arsitektur otak buatan dari dasar: perceptron, backpropagation, activation functions, dan gradient descent.", tags: JSON.stringify(["AI", "Deep Learning", "Neural Network"]), level: "INTERMEDIATE" as const },
      { id: "m8", title: "Data Science dengan Python", description: "Mengolah dan memvisualisasikan data menggunakan Pandas, NumPy, dan Matplotlib untuk menghasilkan insight.", tags: JSON.stringify(["AI", "Data Science", "Python"]), level: "BEGINNER" as const },
      { id: "m9", title: "TypeScript untuk Next.js", description: "Tingkatkan kualitas kode Next.js dengan TypeScript: generic types, interface, type guards, dan utility types.", tags: JSON.stringify(["Web", "Frontend", "TypeScript", "NextJS"]), level: "INTERMEDIATE" as const },
      { id: "m10", title: "Docker & Deployment", description: "Containerize dan deploy aplikasi web menggunakan Docker, Docker Compose, dan CI/CD pipeline dasar.", tags: JSON.stringify(["Backend", "DevOps", "Docker"]), level: "ADVANCED" as const },
    ];

    for (const mod of modules) {
      await prisma.module.upsert({
        where: { id: mod.id },
        update: mod,
        create: mod,
      });
    }

    // ─── Concept Relations ────────────────────────────────
    const relations = [
      { sourceId: "m1", targetId: "m2", weight: 0.9 },
      { sourceId: "m2", targetId: "m6", weight: 0.95 },
      { sourceId: "m6", targetId: "m9", weight: 0.85 },
      { sourceId: "m3", targetId: "m4", weight: 0.9 },
      { sourceId: "m5", targetId: "m7", weight: 0.95 },
      { sourceId: "m5", targetId: "m8", weight: 0.9 },
      { sourceId: "m4", targetId: "m10", weight: 0.8 },
      { sourceId: "m9", targetId: "m10", weight: 0.75 },
    ];

    for (const rel of relations) {
      await prisma.conceptRelation.upsert({
        where: { sourceId_targetId: { sourceId: rel.sourceId, targetId: rel.targetId } },
        update: { weight: rel.weight },
        create: rel,
      });
    }

    // ─── Users ────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      { id: "u1", name: "Andi Pratama",   email: "andi@test.com",  role: "STUDENT" as const, bio: "Frontend enthusiast" },
      { id: "u2", name: "Budi Santoso",   email: "budi@test.com",  role: "STUDENT" as const, bio: "Backend developer" },
      { id: "u3", name: "Citra Lestari",  email: "citra@test.com", role: "STUDENT" as const, bio: "AI researcher" },
      { id: "u4", name: "Dani Hidayat",   email: "dani@test.com",  role: "STUDENT" as const, bio: "New learner" },
      { id: "u5", name: "Eva Nurhaliza",  email: "eva@test.com",   role: "STUDENT" as const, bio: "Full-stack developer" },
      { id: "u0", name: "Admin",          email: "admin@test.com", role: "ADMIN" as const,   bio: "Platform administrator" },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: { ...user, password: hashedPassword },
        create: { ...user, password: hashedPassword },
      });
    }

    // ─── User Logs (Activity History) ─────────────────────
    await prisma.userLog.deleteMany({});

    const logs = [
      { userId: "u1", moduleId: "m1", action: "COMPLETE" as const, rating: 5 },
      { userId: "u1", moduleId: "m2", action: "COMPLETE" as const, rating: 4 },
      { userId: "u2", moduleId: "m3", action: "COMPLETE" as const, rating: 5 },
      { userId: "u2", moduleId: "m4", action: "COMPLETE" as const, rating: 5 },
      { userId: "u3", moduleId: "m5", action: "COMPLETE" as const, rating: 5 },
      { userId: "u3", moduleId: "m8", action: "COMPLETE" as const, rating: 4 },
      { userId: "u4", moduleId: "m1", action: "CLICK" as const, rating: 2 },
      { userId: "u5", moduleId: "m2", action: "COMPLETE" as const, rating: 4 },
      { userId: "u5", moduleId: "m6", action: "COMPLETE" as const, rating: 5 },
      { userId: "u5", moduleId: "m4", action: "COMPLETE" as const, rating: 4 },
    ];

    for (const log of logs) {
      await prisma.userLog.create({
        data: {
          userId: log.userId,
          moduleId: log.moduleId,
          action: log.action,
          rating: log.rating,
        }
      });
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
