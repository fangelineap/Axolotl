import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
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
      <CustomLayout>
        <CustomBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <h1 className="mb-5 text-heading-1 font-bold">User List</h1>
        <ManageUserTable initialData={data} />
      </CustomLayout>
    </div>
  );
}

export default AdminManageUser;
