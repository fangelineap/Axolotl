import { getGlobalAllMedicine } from "@/app/_server-action/global";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import ManageMedicineTable from "./table/ManageMedicineTable";

export const metadata = getAdminMetadata("Manage Medicine");

async function AdminManageMedicine() {
  const data = await getGlobalAllMedicine();

  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <h1 className="mb-5 text-heading-1 font-bold">Medicine List</h1>
        <ManageMedicineTable initialData={data} />
      </CustomLayout>
    </div>
  );
}

export default AdminManageMedicine;
