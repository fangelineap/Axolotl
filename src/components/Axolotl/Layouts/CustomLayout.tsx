import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export default function CustomLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <div className="mx-4 h-auto w-auto md:mx-20">{children}</div>
    </DefaultLayout>
  );
}
