"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Calendar, Activity, Loader2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserLogEntry } from "@/types";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<UserLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/logs?userId=${session.user.id}&limit=50`)
        .then((res) => res.json())
        .then((data) => {
          setLogs(data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session?.user?.id]);

  const completedCount = logs.filter(l => l.action === "COMPLETE").length;

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Profil Saya</h1>
        <p className="text-slate-500">Kelola informasi akun dan tinjau histori belajar Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-8 text-center pt-10">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-500/20 mb-6">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{session?.user?.name}</h2>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
                <Mail className="h-4 w-4" />
                {session?.user?.email}
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">{completedCount}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Materi Selesai</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">{logs.length}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Interaksi</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Histori Aktivitas Lengkap
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                        log.action === "COMPLETE" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {log.action === "COMPLETE" ? <BookOpen className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate mb-1">
                          {log.module?.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            log.action === "COMPLETE" ? "text-emerald-600" : "text-blue-600"
                          }`}>
                            {log.action}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                      {log.rating && (
                        <div className="text-sm font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                          ⭐ {log.rating}/5
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    Belum ada aktivitas belajar yang terekam.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
