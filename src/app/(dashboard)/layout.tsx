import { AppSidebar } from "@/components/layout/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Minimal Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-sm font-semibold text-slate-800">Ruang Belajar</h2>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
