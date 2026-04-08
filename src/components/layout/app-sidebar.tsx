"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  Users,
  BarChart3,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modules", label: "Katalog Materi", icon: BookOpen },
  { href: "/profile", label: "Profil Saya", icon: User },
];

const adminNav = [
  { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/modules", label: "Kelola Materi", icon: BookOpen },
  { href: "/admin/users", label: "Kelola Pengguna", icon: Users },
  { href: "/admin/analytics", label: "Analitik AI", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const nav = isAdmin ? adminNav : studentNav;

  return (
    <aside className="sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-white/10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/40">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-lg leading-none">
            Learn<span className="text-blue-400">AI</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isAdmin ? "Admin Panel" : "E-Learning Platform"}
          </p>
        </div>
      </div>

      {/* AI Badge */}
      {!isAdmin && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300">AI-Powered Recommender</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {isAdmin ? "Administrasi" : "Menu Utama"}
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-blue-500/20 text-blue-300 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-blue-400" : "")} />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-white/10 p-4">
        {session?.user && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{session.user.name}</p>
              <p className="truncate text-[10px] text-slate-400">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
