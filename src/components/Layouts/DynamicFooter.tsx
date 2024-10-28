"use client";

import { usePathname } from "next/navigation";
import CGAdminFooter from "../Footer/CGAdmin";
import GuestFooter from "../Footer/Guest";
import PatientFooter from "../Footer/Patient";

const DynamicFooter = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/caregiver"))
    return <CGAdminFooter />;

  if (pathname.startsWith("/auth")) return null;

  if (pathname.startsWith("/") || pathname.startsWith("/guest"))
    return <GuestFooter />;

  if (pathname.startsWith("/patient") && !pathname.includes("health-services"))
    return <PatientFooter />;
};

export default DynamicFooter;
