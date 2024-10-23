"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CGAdminFooter from "../Footer/CGAdmin";
import GuestPatientFooter from "../Footer/GuestPatient";
import OrderPatientFooter from "../Footer/OrderPatient";

const DynamicFooter = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/caregiver"))
    return <CGAdminFooter />;

  if (pathname.startsWith("/auth")) return null;

  if (
    (pathname.startsWith("/patient") &&
      !pathname.includes("health-services")) ||
    pathname.startsWith("/")
  )
    return <GuestPatientFooter />;

  if (pathname.startsWith("/patient") && !pathname.includes("health-services"))
    return <OrderPatientFooter />;
};

export default DynamicFooter;
