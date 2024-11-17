"use client";

import { usePathname } from "next/navigation";
import CGAdminFooter from "../Footer/CGAdmin";
import GuestFooter from "../Footer/Guest";
import PatientFooter from "../Footer/Patient";

const DynamicFooter = () => {
  const pathname = usePathname();

  const footerMap: Record<string, JSX.Element | null> = {
    "/patient/health-services/appointment": null,
    "/chat": null,
    "/auth": null,
    "/admin": <CGAdminFooter />,
    "/caregiver": <CGAdminFooter />,
    "/patient": <PatientFooter />,
    "/guest": <GuestFooter />,
    "/": <GuestFooter />
  };

  for (const [path, component] of Object.entries(footerMap)) {
    if (pathname.startsWith(`${path}`)) return component;
  }

  return <GuestFooter />;
};

export default DynamicFooter;
