import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Admin Control Center</h2>
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Live Database</span>
            </div>
          </div>
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
