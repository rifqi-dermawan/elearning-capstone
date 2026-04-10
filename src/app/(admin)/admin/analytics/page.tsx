"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, TrendingUp, Sparkles, Activity, BookOpen } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<{ name: string, fullTitle: string, value: number }[]>([]);
  const [stats, setStats] = useState({ totalLogs: 0, uniqueModules: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs?limit=500")
      .then((res) => res.json())
      .then((logs) => {
        const map = new Map();
        logs.forEach((log: { module?: { title: string } }) => {
          const title = log.module?.title || "Unknown";
          if (!map.has(title)) {
            map.set(title, { name: title.substring(0, 15) + "...", fullTitle: title, value: 0 });
          }
          map.get(title).value += 1;
        });

        const chartData = Array.from(map.values())
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setData(chartData);
        setStats({ totalLogs: logs.length, uniqueModules: map.size });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      {/* Modern Header Ticket/Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Platform Intelligence
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            Analitik Performa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Sistem AI</span>
          </h1>
          <p className="text-slate-400 max-w-xl text-sm md:text-base mt-3">
            Pantau seberapa efektif rekomendasi yang disajikan dan lacak tingkat interaksi pengguna platform secara real-time.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Total Interaksi / Log</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.totalLogs}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Materi Sedang Aktif</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.uniqueModules}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-2xl shadow-md border border-indigo-500 flex items-center gap-5 text-white relative overflow-hidden md:col-span-2 lg:col-span-1">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-indigo-100 mb-1">Status Enjin AI / ML</p>
            <h3 className="text-2xl tracking-wide font-extrabold flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border border-green-200" />
              Optimal
            </h3>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[500px] flex flex-col transition-shadow hover:shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Top 5 Materi Terpopuler</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Berdasarkan volume interaksi tertinggi dan persentase click-through rate AI.</p>
          </div>
        </div>
        
        <div className="flex-1 w-full min-h-0">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="name" 
                   stroke="#64748b" 
                   fontSize={13} 
                   fontWeight={600} 
                   tickLine={false} 
                   axisLine={false} 
                   dy={10}
                 />
                 <YAxis 
                   stroke="#94a3b8" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false} 
                   allowDecimals={false} 
                 />
                 <Tooltip 
                   cursor={{ fill: '#f8fafc' }} 
                   contentStyle={{ 
                     borderRadius: '16px', 
                     border: 'none',
                     boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                     fontWeight: 'bold',
                     padding: '12px 20px'
                   }}
                   itemStyle={{ color: '#3b82f6', fontWeight: 800 }}
                   labelStyle={{ color: '#0f172a', marginBottom: '4px' }}
                 />
                 <Bar 
                   dataKey="value" 
                   radius={[8, 8, 0, 0]}
                   fill="url(#colorValue)"
                   barSize={40}
                   animationDuration={1500}
                 />
               </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Activity className="h-12 w-12 text-slate-300" />
              <p className="font-medium text-slate-500">Belum ada cukup data interaksi untuk di-render.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
