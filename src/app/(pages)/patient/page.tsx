import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import PatientHome from "@/components/Patient/PatientHome";
import { getUserFromSession } from "@/lib/server";
import { redirect } from "next/navigation";
import { getPatientMetadata } from "@/utils/Metadata/PatientMetadata";

export const metadata = getPatientMetadata("default");

async function Home() {
  const { data: currentUser, error } = await getUserFromSession();

  if (error || !currentUser) {
    redirect("/auth/signin");
  }

  return (
    <DefaultLayout>
      <PatientHome currentUser={currentUser} />
    </DefaultLayout>
  );
}

export default Home;
