// src/app/api/recommend/route.ts
import { NextResponse } from "next/server";
import { daftarModul, userLogs } from "../../../lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID diperlukan" }, { status: 400 });
  }

  // 1. Ambil histori modul yang disukai user (rating >= 4)
  const userHistory = userLogs.filter(
    (log) => log.userId === userId && (log.rating || 0) >= 4,
  );
  const viewedIds = userLogs
    .filter((log) => log.userId === userId)
    .map((log) => log.modulId);

  // 2. Ambil semua tag dari modul yang disukai user (Interest Profile)
  const userInterests = new Set<string>();
  userHistory.forEach((log) => {
    const modul = daftarModul.find((m) => m.id === log.modulId);
    modul?.tags.forEach((tag) => userInterests.add(tag));
  });

  // 3. Hitung skor untuk modul yang BELUM dilihat
  const recommendations = daftarModul
    .filter((modul) => !viewedIds.includes(modul.id)) // Jangan rekomendasikan yang sudah ditonton
    .map((modul) => {
      // Hitung berapa banyak tag yang cocok (Simple Content-Based)
      const matches = modul.tags.filter((tag) => userInterests.has(tag));
      const score = matches.length;

      return {
        id: modul.id,
        title: modul.title,
        score: score,
        // Explainability (Alasan) yang diminta dosen
        reason: `Karena kamu tertarik pada topik ${matches.join(", ")}`,
      };
    })
    .filter((item) => item.score > 0) // Hanya ambil yang punya kemiripan
    .sort((a, b) => b.score - a.score) // Urutkan dari skor tertinggi
    .slice(0, 5); // Ambil Top 5

  return NextResponse.json({
    userId,
    recommendations,
  });
}
