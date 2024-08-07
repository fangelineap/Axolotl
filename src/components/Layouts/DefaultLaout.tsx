"use client";
import React, { useState } from "react";
import Footer from "../Footer";
import DynamicHeader from "./DynamicHeader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <DynamicHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
