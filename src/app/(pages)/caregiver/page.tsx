import Dashboard from "@/components/Caregiver/CaregiverHome";
import { getCaregiverMetadata } from "@/utils/Metadata/CaregiverMetadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = getCaregiverMetadata("schedule");
const page = () => {
  return <Dashboard />;
};

export default page;
