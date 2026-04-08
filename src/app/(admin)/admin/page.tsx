"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Activity, PlayCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RecommendationType, UserLogEntry } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, modules: 0, logs: 0 });
  const [recentLogs, setRecentLogs] = useState<UserLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd have a specific admin stats endpoint
    // Here we're fetching from our existing endpoints concurrently
    Promise.all([
      fetch("/api/modules").then(res => res.json()),
      fetch("/api/logs?limit=10").then(res => res.json()),
    ])
      .then(([modules, logs]) => {
        setStats({
          users: 6, // Stubbed for dummy data count
          modules: modules.length || 0,
          logs: logs.length || 0, // Using returned limit as rough sample
        });
        setRecentLogs(logs);
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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Overview</h1>
        <p className="text-slate-500">Ringkasan statistik platform e-learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-white">
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
        
        <Card className="border-slate-200 bg-white">
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

        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Interaksi</p>
              <h3 className="text-2xl font-black text-slate-900">100+</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-slate-200">
          <div className="border-b border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900">Aktivitas Terbaru Sistem</h3>
            <p className="text-sm text-slate-500">Real-time log event dari pengguna platform.</p>
          </div>
          <CardContent className="p-0">
            <div className="bg-slate-900 rounded-b-xl p-6 font-mono text-xs leading-relaxed overflow-hidden relative min-h-[300px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500"></div>
                  </div>
                  <span className="ml-4 text-slate-500 uppercase tracking-widest text-[10px]">
                    System_Event_Log
                  </span>
                </div>

                <div className="space-y-3">
                  {recentLogs.map((log, i) => (
                    <div key={log.id} className="text-slate-400 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <span className="text-blue-500">[{new Date(log.createdAt).toLocaleTimeString('en-US', { hour12: false })}]</span>
                      <span className="text-white">EVENT:</span> 
                      <span>User</span>
                      <span className="text-amber-400 font-bold">{log.user?.email}</span> 
                      <span>performed</span>
                      <span className={log.action === "COMPLETE" ? "text-emerald-400" : "text-blue-400"}>{log.action}</span>
                      <span>on module</span>
                      <span className="text-purple-400">"{log.module?.title}"</span>
                      {log.rating && <span className="text-amber-500">(Rating: {log.rating}⭐)</span>}
                    </div>
                  ))}
                  
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <p className="text-emerald-400 animate-pulse font-bold">
                      {">"} SYSTEM_READY... Awaiting new events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
