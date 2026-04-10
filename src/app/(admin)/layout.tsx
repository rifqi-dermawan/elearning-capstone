import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { FloatingChatbot } from "@/components/FloatingChatbot";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarLayout 
        headerContent={
          <div className="flex items-center gap-3 w-full">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest hidden sm:block">Admin Control Center</h2>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest sm:hidden">Admin</h2>
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1 rounded-full ml-auto">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Live Database</span>
            </div>
          </div>
        }
      >
        {children}
      </SidebarLayout>
      <FloatingChatbot />
    </>
  );
}