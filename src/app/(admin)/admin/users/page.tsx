"use client";

import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app we would have a dedicated /api/users endpoint.
  // For this demo, we'll extract unique users from the limit=50 logs endpoint 
  // since we created the logs to seed activity.
  useEffect(() => {
    fetch("/api/logs?limit=100")
      .then((res) => res.json())
      .then((logs) => {
        const uniqueUsersMap = new Map();
        logs.forEach((log: any) => {
          if (log.user) {
            if (!uniqueUsersMap.has(log.userId)) {
              uniqueUsersMap.set(log.userId, {
                id: log.userId,
                name: log.user.name,
                email: log.user.email,
                logCount: 1,
                lastActive: log.createdAt
              });
            } else {
              const u = uniqueUsersMap.get(log.userId);
              u.logCount += 1;
              if (new Date(log.createdAt) > new Date(u.lastActive)) {
                u.lastActive = log.createdAt;
              }
            }
          }
        });
        setUsers(Array.from(uniqueUsersMap.values()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Kelola Pengguna</h1>
        <p className="text-slate-500">Daftar pengguna terdaftar dan ringkasan aktivitas mereka.</p>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4 pl-6">Pengguna</th>
                <th className="p-4 text-center">Interaksi Terakhir</th>
                <th className="p-4 text-center">Total Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data pengguna.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-medium text-slate-600">
                        {new Date(user.lastActive).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short'})}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-bold text-xs h-6 px-3 rounded-full">
                        {user.logCount} Logs
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
