import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAdminAllUsers } from "./actions";
import ManageUserTable from "./table/ManageUserTable";
export const metadata = getAdminMetadata("Manage User");

async function getUserData() {
  const data = await getAdminAllUsers();

  if (!data.length) {
    return [];
  }

  return data;
}

async function AdminManageUser() {
  const data = await getUserData();

  return (
    <div className="bg-gray">
      <AdminLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <h1 className="mb-5 text-heading-1 font-bold">User List</h1>
        <ManageUserTable initialData={data} />
      </AdminLayout>
    </div>
  );
}

export default AdminManageUser;
