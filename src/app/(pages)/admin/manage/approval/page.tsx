import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAllAdminApproval } from "./actions";
import ManageApprovalTable from "./table/ManageApprovalTable";

export const metadata = getAdminMetadata("Manage Approval");

async function AdminManageApproval() {
  const data = await getAllAdminApproval();

  return (
    <div className="bg-gray">
      <AdminLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Approval" />
        <h1 className="mb-5 text-heading-1 font-bold">Approval</h1>
        <ManageApprovalTable initialData={data} />
      </AdminLayout>
    </div>
  );
}

export default AdminManageApproval;
