import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

interface AdminShowUserProps {
  params: { userId: string };
}

function AdminShowUser({ params }: AdminShowUserProps) {
  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="View"
      />
      Tes
    </DefaultLayout>
  );
}

export default AdminShowUser;
