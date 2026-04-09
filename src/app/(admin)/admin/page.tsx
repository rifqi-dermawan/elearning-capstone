"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Activity, Loader2, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserLogEntry } from "@/types";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const isLecturer = session?.user?.role === "LECTURER";

  const [stats, setStats] = useState({ users: 0, modules: 0, logs: 0 });
  const [recentLogs, setRecentLogs] = useState<UserLogEntry[]>([]);
  const [chartData, setChartData] = useState<{ name: string, value: number, max: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(res => res.json()),
      fetch("/api/logs?limit=50").then(res => res.json()),
    ])
      .then(([statsData, logs]) => {
        setStats({
          users: statsData.users || 0,
          modules: statsData.modules || 0,
          logs: statsData.logs || 0,
        });
        
        setRecentLogs(logs.slice(0, 10));

        const map = new Map();
        logs.forEach((log: { module?: { title: string } }) => {
          const title = log.module?.title || "Unknown";
          if (!map.has(title)) {
            map.set(title, { name: title, value: 0 });
          }
          map.get(title).value += 1;
        });

        let cData = Array.from(map.values())
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
          
        const maxVal = cData.length > 0 ? Math.max(...cData.map(d => d.value)) : 1;
        cData = cData.map(d => ({ ...d, max: maxVal }));

        setChartData(cData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {isLecturer ? "Dashboard Dosen" : "Overview"}
        </h1>
        <p className="text-slate-500">Ringkasan statistik platform e-learning.</p>
      </div>

      <div className={`grid grid-cols-1 ${isLecturer ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
        {!isLecturer && (
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Total Pengguna</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.users}</h3>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Materi</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.modules}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Interaksi</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.logs}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Modules UI replacing the BarChart */}
        <Card className="border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900">Aktivitas Modul Populer</h3>
            <p className="text-sm text-slate-500">Statistik interaksi modul berdasarkan log terbaru.</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              {chartData.length > 0 ? chartData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700 truncate pr-4">{item.name}</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">{item.value} Interaksi</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 text-sm">Belum ada data interaksi.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clean System Event Log replacing the Terminal */}
        <Card className="border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900">Aktivitas Terbaru Sistem</h3>
            <p className="text-sm text-slate-500">Real-time log event dari pengguna platform.</p>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto custom-scrollbar">
              {recentLogs.length > 0 ? recentLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${log.action === 'COMPLETE' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 leading-snug">
                      <span className="font-semibold">{log.user?.email || "Pengguna"}</span>{" "}
                      <span className="text-slate-500">
                        {log.action === "COMPLETE" ? "menyelesaikan" : "membuka"}
                      </span>{" "}
                      <span className="font-medium text-slate-700">&quot;{log.module?.title}&quot;</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(log.createdAt).toLocaleString('id-ID', { 
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                      {log.rating && (
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {log.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-slate-400 text-sm">Belum ada aktivitas terbaru.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
