import { NextResponse } from "next/server";

export async function GET() {
  const envStatus = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `Terdeteksi (Panjang: ${process.env.GOOGLE_CLIENT_ID.length})` : "KOSONG/MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? `Terdeteksi (Panjang: ${process.env.GOOGLE_CLIENT_SECRET.length})` : "KOSONG/MISSING",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "KOSONG/MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Terdeteksi" : "KOSONG/MISSING",
    VERCEL_URL: process.env.VERCEL_URL || "KOSONG/MISSING",
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(
    { 
      status: "Berhasil memuat Environment Variables", 
      data: envStatus,
      pesan: "Jika GOOGLE_CLIENT_ID atau SECRET KOSONG, artinya Vercel belum membaca konfigurasi barunya. Pastikan Anda melakukan Redeploy."
    },
    { status: 200 }
  );
}
