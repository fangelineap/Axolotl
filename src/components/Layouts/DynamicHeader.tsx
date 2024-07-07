import React from "react";
import Header from "@/components/Header";
import GuestHeader from "../Guest/GuestHeader";
import Sidebar from "@/components/Sidebar";
import GuestSidebar from "../Guest/Sidebar Guest";
import { usePathname } from "next/navigation";

const DynamicHeader = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const pathname = usePathname();

  if (pathname.startsWith("/pages/admin")) {
    return (
      <>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </>
    );
  } else if (pathname.startsWith("/pages/guest")) {
    return (
      <>
        <GuestHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <GuestSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </>
    );
  } else if (pathname.startsWith("/")) {
    return (
      <>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </>
    );
  }

  return null;
};

export default DynamicHeader;
