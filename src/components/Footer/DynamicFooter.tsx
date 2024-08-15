"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CGAdminFooter from "./CGAdmin";
import GuestPatientFooter from "./GuestPatient";

const DynamicFooter = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/caregiver")) {
    return (
      <>
        <CGAdminFooter />
      </>
    );
  } else if (
    pathname.startsWith("/guest") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/patient")
  ) {
    return (
      <>
        <GuestPatientFooter />
      </>
    );
  }

  return null;
};

export default DynamicFooter;
