"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<{ name: string, fullTitle: string, value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs?limit=100")
      .then((res) => res.json())
      .then((logs) => {
        // Simple aggregation to count logs per module for charting
        const map = new Map();
        logs.forEach((log: { module?: { title: string } }) => {
          const title = log.module?.title || "Unknown";
          if (!map.has(title)) {
            map.set(title, { name: title.substring(0, 15) + "...", fullTitle: title, value: 0 });
          }
          map.get(title).value += 1;
        });

        // Top 5 active modules
        const chartData = Array.from(map.values())
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setData(chartData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Soft modern colors for chart
  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e"];

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          Analitik AI
        </h1>
        <p className="text-slate-500">Visualisasi performa rekomendasi dan interaksi pengguna.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm md:col-span-2">
           <CardHeader className="border-b border-slate-100 pb-4">
             <CardTitle className="text-base flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-emerald-500" />
               Top 5 Materi Paling Disukai (Interaksi Terbanyak)
             </CardTitle>
           </CardHeader>
           <CardContent className="pt-8 pb-4">
             {data.length > 0 ? (
               <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                     <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                     <Tooltip 
                       cursor={{ fill: '#f8fafc' }} 
                       contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                     <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                       {data.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  Belum ada data cukup untuk divisualisasikan.
                </div>
             )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
