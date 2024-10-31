import { usePathname, useSearchParams } from "next/navigation";
import AdminHeader from "../Admin/AdminHeader";
import AdminSidebar from "../Admin/AdminSidebar";
import AuthHeader from "../Auth/AuthHeader";
import AuthSidebar from "../Auth/AuthSidebar";
import CaregiverHeader from "../Caregiver/CaregiverHeader";
import CaregiverSidebar from "../Caregiver/CaregiverSidebar";
import GuestHeader from "../Guest/GuestHeader";
import GuestSidebar from "../Guest/GuestSidebar";
import PatientHeader from "../Patient/PatientHeader";
import PatientSidebar from "../Patient/PatientSidebar";

const DynamicHeader = ({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = searchParams.get("role");

  const layoutMap: { [key: string]: { Header: any; Sidebar: any } } = {
    "/admin": { Header: AdminHeader, Sidebar: AdminSidebar },
    "/patient": { Header: PatientHeader, Sidebar: PatientSidebar },
    "/caregiver": { Header: CaregiverHeader, Sidebar: CaregiverSidebar },
    "/registration/personal-information": {
      Header: role === "Patient" ? PatientHeader : CaregiverHeader,
      Sidebar: role === "Patient" ? PatientSidebar : CaregiverSidebar
    },
    "/auth": { Header: AuthHeader, Sidebar: AuthSidebar }
  };

  const matchedLayout = Object.keys(layoutMap).find((key) =>
    pathname.startsWith(key)
  );

  // Fallback to Guest layout if no match found or route is undefined
  const { Header, Sidebar } = matchedLayout
    ? layoutMap[matchedLayout]
    : { Header: GuestHeader, Sidebar: GuestSidebar };

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  );
};

export default DynamicHeader;
