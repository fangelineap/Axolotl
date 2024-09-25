import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAllAdminApproval } from "./actions";
import ManageApprovalTable from "./table/ManageApprovalTable";

export const metadata = getAdminMetadata("Manage Approval");

async function AdminManageApproval() {
  const data = await getAllAdminApproval();

  return (
    <div className="bg-gray">
      <DefaultLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Approval" />
        <div className="mx-20 h-auto w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">Approval</h1>
          <ManageApprovalTable initialData={data} />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageApproval;
