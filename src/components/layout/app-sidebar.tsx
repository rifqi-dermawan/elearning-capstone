"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  User,
  LogOut,
  Users,
  BarChart3,
  GraduationCap,
  X,
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

const lecturerNav = [
  { href: "/admin", label: "Dosen Dashboard", icon: LayoutDashboard },
  { href: "/admin/modules", label: "Kelola Materi", icon: BookOpen },
];

export function AppSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLecturer = session?.user?.role === "LECTURER";
  const nav = isAdmin ? adminNav : isLecturer ? lecturerNav : studentNav;

  return (
    <aside className="sidebar flex h-screen w-64 flex-col border-r border-white/10 bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10 relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/40">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="font-bold text-white text-lg leading-none">
            Learn<span className="text-blue-400">AI</span>
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isAdmin ? "Admin Panel" : isLecturer ? "Dosen Panel" : "E-Learning Platform"}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden absolute right-4 top-6 text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {isAdmin || isLecturer ? "Administrasi" : "Menu Utama"}
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          // Exact match for root routes, prefix match for sub-routes
          const isRoot = href === "/admin" || href === "/dashboard";
          const active = isRoot ? pathname === href : pathname === href || pathname.startsWith(href + "/");
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
