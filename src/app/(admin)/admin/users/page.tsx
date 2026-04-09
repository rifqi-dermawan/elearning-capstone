"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search, Loader2, Shield, User as UserIcon, BookOpen,
  ChevronDown, KeyRound, Eye, EyeOff, X, Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Role = "ADMIN" | "LECTURER" | "STUDENT";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  _count: { logs: number };
}

const ROLE_CONFIG: Record<Role, { label: string; color: string; icon: React.ElementType }> = {
  ADMIN:    { label: "Admin",     color: "bg-purple-100 text-purple-700",  icon: Shield },
  LECTURER: { label: "Dosen",    color: "bg-emerald-100 text-emerald-700", icon: BookOpen },
  STUDENT:  { label: "Mahasiswa", color: "bg-blue-100 text-blue-700",      icon: UserIcon },
};

function ChangePasswordModal({
  user,
  onClose,
  onSuccess,
}: {
  user: UserData;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }
    if (password !== confirm)  { setError("Konfirmasi password tidak cocok."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal mengubah password"); return; }
      onSuccess();
      onClose();
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-blue-600" />
            Reset Sandi — {user.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <p className="text-sm text-slate-500">
            Masukkan sandi baru untuk akun <span className="font-semibold text-slate-700">{user.email}</span>
          </p>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-pass">Sandi Baru</Label>
            <div className="relative">
              <Input
                id="new-pass"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-pass">Konfirmasi Sandi</Label>
            <div className="relative">
              <Input
                id="confirm-pass"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi sandi baru"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      password.length >= i * 3
                        ? password.length >= 10 ? "bg-emerald-500"
                          : password.length >= 7 ? "bg-yellow-400"
                          : "bg-red-400"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                {password.length < 7 ? "Terlalu pendek" : password.length < 10 ? "Cukup kuat" : "Sangat kuat"}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Batal
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Simpan Sandi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | Role>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<UserData | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) { const err = await res.json(); alert(err.error || "Gagal mengubah role"); return; }
      fetchUsers();
    } catch { alert("Terjadi kesalahan"); } finally { setUpdatingId(null); }
  };

  const handlePasswordSuccess = () => {
    setSuccessMsg("Sandi berhasil diubah!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterRole === "ALL" || u.role === filterRole);
  });

  const counts = {
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
    LECTURER: users.filter((u) => u.role === "LECTURER").length,
    STUDENT: users.filter((u) => u.role === "STUDENT").length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in-up">
          <Check className="h-4 w-4" />{successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Kelola Pengguna</h1>
          <p className="text-slate-500 text-sm">Manajemen role, akses, dan sandi pengguna platform.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
            <Shield className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-xs font-bold text-purple-700">{counts.ADMIN} Admin</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">{counts.LECTURER} Dosen</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <UserIcon className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-bold text-blue-700">{counts.STUDENT} Mahasiswa</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input placeholder="Cari nama atau email pengguna..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-slate-200" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "ADMIN", "LECTURER", "STUDENT"] as const).map((role) => (
            <button key={role} onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                filterRole === role ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}>
              {role === "ALL" ? "Semua" : ROLE_CONFIG[role].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4 pl-6">Pengguna</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 text-center">Aktivitas</th>
                <th className="p-4 text-center">Role Saat Ini</th>
                <th className="p-4 text-center">Ubah Role</th>
                <th className="p-4 pr-6 text-center">Reset Sandi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-slate-500 text-sm">
                  {search || filterRole !== "ALL" ? "Tidak ada pengguna yang cocok." : "Belum ada pengguna terdaftar."}
                </td></tr>
              ) : (
                filtered.map((user) => {
                  const isCurrentUser = user.id === session?.user?.id;
                  const isUpdating = updatingId === user.id;
                  const roleConfig = ROLE_CONFIG[user.role];
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${roleConfig.color}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {user.name}
                              {isCurrentUser && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Anda</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-bold text-xs h-6 px-3 rounded-full">
                          {user._count.logs} log
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold border-transparent ${roleConfig.color}`}>
                          {roleConfig.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        {isCurrentUser ? (
                          <span className="text-[10px] text-slate-400 italic">Akun Anda</span>
                        ) : isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mx-auto" />
                        ) : (
                          <div className="relative inline-flex items-center">
                            <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} disabled={isUpdating}
                              className="appearance-none text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-slate-700 cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                              <option value="STUDENT">Mahasiswa</option>
                              <option value="LECTURER">Dosen</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <Button variant="ghost" size="sm"
                          className="h-8 gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 hover:bg-orange-50"
                          onClick={() => setResetTarget(user)}>
                          <KeyRound className="h-3.5 w-3.5" />
                          Reset
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/50 text-xs text-slate-400 font-medium">
            Menampilkan {filtered.length} dari {users.length} pengguna
          </div>
        )}
      </Card>

      {/* Change Password Modal */}
      {resetTarget && (
        <ChangePasswordModal
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onSuccess={handlePasswordSuccess}
        />
      )}
    </div>
  );
}
