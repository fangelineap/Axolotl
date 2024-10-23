import { getGlobalAllMedicine } from "@/app/_server-action/global";
import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import ManageMedicineTable from "./table/ManageMedicineTable";

export const metadata = getAdminMetadata("Manage Medicine");

async function AdminManageMedicine() {
  const data = await getGlobalAllMedicine();

  return (
    <div className="bg-gray">
      <AdminLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <h1 className="mb-5 text-heading-1 font-bold">Medicine List</h1>
        <ManageMedicineTable initialData={data} />
      </AdminLayout>
    </div>
  );
}

export default AdminManageMedicine;
