"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { Menu, X } from "lucide-react";

export function SidebarLayout({ children, headerContent }: { children: React.ReactNode, headerContent?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Desktop fixed, Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AppSidebar onClose={() => setIsOpen(false)} />
      </div>

      {/* Main Content wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center gap-4 sticky top-0 z-30">
          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            {headerContent}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
