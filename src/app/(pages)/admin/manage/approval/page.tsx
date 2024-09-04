import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ManageApprovalTable from "./table/ManageApprovalTable";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminApproval } from "./actions";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Manage Approval");

async function AdminManageApproval() {
  const data = await getAdminApproval();

  return (
    <div className="bg-gray">
      <DefaultLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Approval" />
        <div className="mx-20 w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">Approval</h1>
          <ManageApprovalTable initialData={data} />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageApproval;
