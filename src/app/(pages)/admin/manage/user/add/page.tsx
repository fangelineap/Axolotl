import AddAdmin from "@/components/Admin/Manage/User/AddAdmin";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add User");

function AdminAddAdmin() {
  return (
    <DefaultLayout>
      <div className="mx-4 h-auto w-auto md:mx-20">
        <AdminBreadcrumbs
          parentPage="Manage"
          subPage="User"
          pageName="Add User"
        />
        <AddAdmin />
      </div>
    </DefaultLayout>
  );
}

export default AdminAddAdmin;
