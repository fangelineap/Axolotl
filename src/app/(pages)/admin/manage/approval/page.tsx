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
        <div className="mx-4 h-auto w-auto md:mx-20">
          <AdminBreadcrumbs parentPage="Manage" pageName="Approval" />
          <h1 className="mb-5 text-heading-1 font-bold">Approval</h1>
          <ManageApprovalTable initialData={data} />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageApproval;
