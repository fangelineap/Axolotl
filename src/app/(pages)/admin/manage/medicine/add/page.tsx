import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import AddMedicine from "@/components/Admin/Manage/Medicine/AddMedicine";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add Medicine");

function AdminAddMedicine() {
  return (
    <CustomLayout>
      <CustomBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="Add Medicine"
      />
      <AddMedicine />
    </CustomLayout>
  );
}

export default AdminAddMedicine;
