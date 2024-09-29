import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ManageUserTable from "./table/ManageUserTable";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAdminAllUsers } from "./actions";
import { getUserAuthSchema } from "@/app/server-action/admin/SupaAdmin";
import { AdminUserTable } from "./table/data";

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
      <DefaultLayout>
        <div className="mx-4 h-auto w-auto md:mx-20">
          <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
          <h1 className="mb-5 text-heading-1 font-bold">User List</h1>
          <ManageUserTable initialData={data} />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageUser;
