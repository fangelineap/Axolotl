import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAllAdminApproval } from "./actions";
import ManageApprovalTable from "./table/ManageApprovalTable";

export const metadata = getAdminMetadata("Manage Approval");

async function AdminManageApproval() {
  const data = await getAllAdminApproval();

  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs parentPage="Manage" pageName="Approval" />
        <h1 className="mb-5 text-heading-1 font-bold">Approval</h1>
        <ManageApprovalTable initialData={data} />
      </CustomLayout>
    </div>
  );
}

export default AdminManageApproval;
