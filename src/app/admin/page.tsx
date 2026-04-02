"use client";
import { useEffect, useState } from "react";
import { daftarModul, userLogs } from "@/lib/data";
import Link from "next/link";

export default function AdminDashboard() {
  // State untuk menangani Hydration Error (agar jam client & server tidak bentrok)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Navbar Admin */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900">
              Admin Control <span className="text-blue-600">Center</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-blue-600 uppercase">
              Live Database Connected
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 gap-10">
          {/* Bagian 1: Pengelolaan Metadata */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Pengaturan Tag Materi
              </h2>
              <p className="text-slate-500 text-sm">
                Kelola metadata modul untuk mengoptimalkan akurasi AI.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="p-6">Modul ID</th>
                    <th className="p-6">Judul Materi</th>
                    <th className="p-6">Kategori / Tags</th>
                    <th className="p-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {daftarModul.map((modul) => (
                    <tr
                      key={modul.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-6 font-mono text-xs text-slate-400">
                        {modul.id}
                      </td>
                      <td className="p-6">
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {modul.title}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          {modul.tags.map((t) => (
                            <span
                              key={t}
                              className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                          Optimized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bagian 2: System Log */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Log Aktivitas Sistem
              </h2>
              <p className="text-slate-500 text-sm">
                Rekam jejak interaksi user yang diproses oleh Recommender
                Engine.
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px]"></div>

              <div className="relative z-10 font-mono text-xs leading-relaxed">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                  </div>
                  <span className="ml-4 text-slate-500 uppercase tracking-widest text-[10px]">
                    E-Learning-Engine-Shell
                  </span>
                </div>

                {/* Wrapper isClient untuk mencegah error Hydration */}
                {isClient && (
                  <div className="space-y-2">
                    {userLogs.map((log, i) => (
                      <p key={i} className="text-slate-400">
                        <span className="text-blue-500">
                          [{new Date().toLocaleTimeString()}]
                        </span>{" "}
                        <span className="text-white">EVENT_PUSH:</span> User{" "}
                        <span className="text-blue-400 font-bold">
                          {log.userId}
                        </span>{" "}
                        interacted with{" "}
                        <span className="text-yellow-500">{log.modulId}</span>{" "}
                        (Action: {log.action})
                      </p>
                    ))}
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <p className="text-green-400 animate-pulse font-bold">
                        {"//"} RECOMPILING_RECOMMENDATIONS_FOR_ALL_PROFILES...
                      </p>
                      <p className="text-slate-500 mt-1">
                        {"//"} Cache cleared. Vector scores updated
                        successfully.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
