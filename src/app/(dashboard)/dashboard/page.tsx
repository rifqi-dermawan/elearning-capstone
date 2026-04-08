"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recommendation, UserLogEntry } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [logs, setLogs] = useState<UserLogEntry[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch AI Recommendations
      fetch(`/api/recommend?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setRecs(data.recommendations || []);
          setLoadingRecs(false);
        })
        .catch(() => setLoadingRecs(false));

      // Fetch Recent Activity
      fetch(`/api/logs?userId=${session.user.id}&limit=5`)
        .then((res) => res.json())
        .then((data) => setLogs(data || []));
    }
  }, [session?.user?.id]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Halo, {session?.user?.name?.split(" ")[0] || "Pelajar"}! 👋
            </h1>
            <p className="text-slate-500 max-w-xl">
              Kami telah menyiapkan rekomendasi materi khusus untuk Anda berdasarkan histori dan minat belajar Anda. 
            </p>
          </div>
          <Button asChild size="lg" className="hidden md:flex rounded-full px-8 shadow-blue-500/20 shadow-lg">
            <Link href="/modules">Mulai Belajar</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rekomendasi AI Untuk Anda</h2>
              <p className="text-xs text-slate-500 font-medium">Berdasarkan Hybrid Filtering (Content + Collaborative)</p>
            </div>
          </div>

          <div className="grid gap-4">
            {loadingRecs ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl border border-slate-100 bg-white p-5 flex items-center">
                  <div className="w-full space-y-3">
                    <div className="h-5 w-1/3 skeleton rounded" />
                    <div className="h-4 w-2/3 skeleton rounded" />
                    <div className="h-8 w-full skeleton rounded mt-4" />
                  </div>
                </div>
              ))
            ) : recs.length > 0 ? (
              recs.map((rec, index) => (
                <Card key={rec.moduleId} className="group hover:border-blue-200 hover:shadow-md transition-all duration-300 border-slate-200 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant={rec.reasonType} className="uppercase px-2.5 py-0.5 text-[10px] tracking-wider font-extrabold max-w-max">
                          {rec.reasonType} Match
                        </Badge>
                        <Badge variant={rec.level.toLowerCase() as any} className="uppercase px-2.5 py-0.5 text-[10px] tracking-wider font-extrabold pb-0.5">
                          {rec.level}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="default" className="uppercase px-2.5 py-0.5 text-[10px] tracking-wider font-extrabold animate-pulse">
                            Top Pick
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {rec.description}
                      </p>
                      
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 italic">
                          <span className="font-semibold text-slate-700 not-italic mr-1">Alasan AI:</span>
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 sm:w-48 p-6 flex flex-col justify-center items-center border-t sm:border-t-0 sm:border-l border-slate-100">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-black text-slate-900 mb-1">
                          {Math.round(rec.finalScore * 100)}%
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Match Score</div>
                      </div>
                      <Button asChild className="w-full rounded-xl shadow-sm" variant={index === 0 ? "gradient" : "default"}>
                        <Link href={`/modules/${rec.moduleId}`}>
                          Mulai <ArrowRight className="ml-1.5 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500">Belum ada rekomendasi yang tersedia.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Space: Stats & History */}
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                Histori Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`mt-1 h-2 w-2 rounded-full ${log.action === 'COMPLETE' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        <div className="h-full w-px bg-slate-100 mt-2" />
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {log.module?.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${log.action === 'COMPLETE' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(log.createdAt).toLocaleDateString('id-ID', { day:'numeric', month:'short' })}
                          </span>
                        </div>
                        {log.rating && (
                          <div className="mt-1 text-xs text-amber-500 font-medium">
                            ⭐ {log.rating}/5
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Belum ada histori belajar.</p>
                )}
              </div>
              <Button asChild variant="outline" className="w-full mt-2" size="sm">
                <Link href="/profile">Lihat Semua</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
