import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { FloatingChatbot } from "@/components/FloatingChatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarLayout 
        headerContent={<h2 className="text-sm font-semibold text-slate-800">Ruang Belajar</h2>}
      >
        {children}
      </SidebarLayout>
      <FloatingChatbot />
    </>
  );
}