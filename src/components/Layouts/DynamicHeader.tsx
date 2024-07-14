import React from "react";
import Header from "@/components/Header";
import GuestHeader from "../Guest/GuestHeader";
import Sidebar from "@/components/Sidebar";
import GuestSidebar from "../Guest/Sidebar Guest";
import { usePathname } from "next/navigation";
import PatientHeader from "../Patient/PatientHeader";
import PatientSidebar from "../Patient/Sidebar Patient";

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
  } else if (pathname.startsWith("/pages/patient")) {
    return (
      <>
        <PatientHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <PatientSidebar
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
