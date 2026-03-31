"use client";

import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative bg-black">
        {/* Subtle Background Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="bg-[radial-gradient(circle_at_center,rgba(202,253,0,0.05)_0%,transparent_70%)] absolute -top-1/4 -right-1/4 w-[800px] h-[800px]"></div>
          <div className="bg-[radial-gradient(circle_at_center,rgba(202,253,0,0.05)_0%,transparent_70%)] absolute top-1/2 -left-1/4 w-[600px] h-[600px]"></div>
        </div>
        <div className="relative z-10 w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </>
  );
}
