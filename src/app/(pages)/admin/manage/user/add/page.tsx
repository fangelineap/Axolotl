import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AddAdmin from "@/components/Admin/Manage/User/AddAdmin";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add User");

function AdminAddAdmin() {
  return (
    <AdminLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="User"
        pageName="Add User"
      />
      <AddAdmin />
    </AdminLayout>
  );
}

export default AdminAddAdmin;
