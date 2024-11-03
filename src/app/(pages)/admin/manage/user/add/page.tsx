import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import AddAdmin from "@/components/Admin/Manage/User/AddAdmin";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add User");

function AdminAddAdmin() {
  return (
    <CustomLayout>
      <CustomBreadcrumbs
        parentPage="Manage"
        subPage="User"
        pageName="Add User"
      />
      <AddAdmin />
    </CustomLayout>
  );
}

export default AdminAddAdmin;
