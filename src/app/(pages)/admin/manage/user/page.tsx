import { getUserAuthSchema } from "@/app/_server-action/admin/SupaAdmin";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAdminAllUsers } from "./actions";
import { AdminUserTable } from "./table/data";
import ManageUserTable from "./table/ManageUserTable";
import React from "react";
import AdminLayout from "@/components/Admin/Manage/AdminLayout";
export const metadata = getAdminMetadata("Manage User");

async function getUserData() {
  const data = await getAdminAllUsers();

  if (!data.length) {
    return [];
  }

  const responses = await Promise.all(
    data.map(async (user) => {
      const response = await getUserAuthSchema(user.user_id);

      return response ? (response as unknown as AdminUserTable) : null;
    })
  );

  const validResponses = responses.filter((response) => response !== null);

  if (validResponses.length < data.length) {
    return [];
  }

  const combinedData = data.map((userData) => {
    const userAuth = validResponses.find(
      (response) => response?.id === userData.user_id
    );

    const combined: AdminUserTable = {
      ...userData,
      email: userAuth?.email || ""
    };

    return combined;
  });

  return combinedData;
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
