/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import DynamicHeader from "./DynamicHeader";

export default function SidebarToggleWrapper({
  triggerSidebar
}: {
  triggerSidebar: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <DynamicHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  );
}
