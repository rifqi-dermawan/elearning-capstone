"use client";
import { useEffect, useState } from "react";
import { daftarModul, userLogs } from "@/lib/data";

export default function Home() {
  const [userId, setUserId] = useState("u1");
  const [recs, setRecs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/recommend?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setRecs(data.recommendations || []));
  }, [userId]);

  return (
    <main className="min-h-screen pb-20">
      {/* Navbar Minimalis */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Learn<span className="text-blue-600">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">
              Keminatan :
            </span>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-slate-100 border-none text-sm font-semibold py-2 px-4 rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="u1">Frontend User</option>
              <option value="u2">Backend User</option>
              <option value="u3">AI Researcher</option>
            </select>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sisi Kiri: Katalog Modul */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">
                Katalog Materi
              </h2>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Lanjutkan Pembelajaranmu
              </h1>
            </div>

            <div className="grid gap-6">
              {daftarModul.map((m) => (
                <div
                  key={m.id}
                  className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {m.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                    <button className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
                      Mulai Belajar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sisi Kanan: Widget Rekomendasi Pintar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Dekorasi Background */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Rekomendasi AI
                  </h2>
                </div>

                <div className="space-y-5">
                  {recs.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all cursor-default"
                    >
                      <h4 className="font-bold text-slate-800 text-sm mb-2">
                        {r.title}
                      </h4>
                      <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-tight">
                        <span className="text-blue-600 font-bold">INFO:</span>
                        <span className="italic">{r.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-blue-900/20">
              <h3 className="font-bold text-sm mb-4">Statistik Belajar</h3>
              <div className="space-y-4">
                {userLogs
                  .filter((log) => log.userId === userId)
                  .map((log, i) => {
                    const modul = daftarModul.find((m) => m.id === log.modulId);
                    return (
                      <div
                        key={i}
                        className="border-l-2 border-blue-500 pl-4 py-1"
                      >
                        <p className="font-bold text-sm text-white">
                          {modul?.title || "Modul tidak ditemukan"}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                            Status: {log.action}
                          </span>
                          <span className="text-yellow-400 text-xs">
                            ⭐ {log.rating}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
