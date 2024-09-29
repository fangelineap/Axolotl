import React from "react";
import GuestHeader from "../Guest/GuestHeader";
import GuestSidebar from "../Guest/GuestSidebar";
import { usePathname } from "next/navigation";
import PatientHeader from "../Patient/PatientHeader";
import PatientSidebar from "../Patient/PatientSidebar";
import AdminHeader from "../Admin/AdminHeader";
import AdminSidebar from "../Admin/AdminSidebar";
import CaregiverHeader from "../Caregiver/CaregiverHeader";
import CaregiverSidebar from "../Caregiver/CaregiverSidebar";
import AuthHeader from "../Auth/AuthHeader";
import AuthSidebar from "../Auth/AuthSidebar";

const DynamicHeader = ({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return (
      <>
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </>
    );
  } else if (pathname.startsWith("/patient")) {
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
  } else if (pathname.startsWith("/caregiver")) {
    return (
      <>
        <CaregiverHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <CaregiverSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </>
    );
  } else if (pathname.startsWith("/auth")) {
    return (
      <>
        <AuthHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <AuthSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </>
    );
  } else {
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
  }
};

export default DynamicHeader;
