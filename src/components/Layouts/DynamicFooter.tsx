"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CGAdminFooter from "../Footer/CGAdmin";
import GuestPatientFooter from "../Footer/GuestPatient";

const DynamicFooter = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/caregiver")) {
    return (
      <>
        <CGAdminFooter />
      </>
    );
  } else {
    return (
      <>
        <GuestPatientFooter />
      </>
    );
  }

  return null;
};

export default DynamicFooter;
