import AddUser from "@/components/Admin/Manage/User/AddUser";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";

export const metadata = getAdminMetadata("Add User");

function AdminAddUser() {
  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="User"
        pageName="Add User"
      />
      <div className="mx-20 h-auto w-auto">
        <AddUser />
      </div>
    </DefaultLayout>
  );
}

export default AdminAddUser;
