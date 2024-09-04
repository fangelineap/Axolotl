import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ManageUserTable from "./table/ManageUserTable";
import { getAdminMetadata } from "@/utils/Metadata/AdminMetadata";
import { getAllUsers } from "./actions";
import { getUserAuthSchema } from "@/app/server-action/admin/SupaAdmin";
import { AdminUserTable } from "./table/data";

export const metadata = getAdminMetadata("Manage User");

async function getUserData() {
  const data = await getAllUsers();

  if (!data.length) {
    return [];
  }

  const responses: AdminUserTable[] = [];

  for (const user of data) {
    const response = await getUserAuthSchema(user.user_id);

    if (response) {
      responses.push(response as unknown as AdminUserTable);
    }
  }

  if (responses.length < data.length) {
    return [];
  }

  const combinedData = data.map((data) => {
    const user = responses.find(
      (response) => response.id === data.user_id,
    );

    return {
      ...data,
      email: user?.email || "",
    };
  });

  return combinedData;
}

async function AdminManageUser() {
  const data = await getUserData();

  return (
    <div className="bg-gray">
      <DefaultLayout>
        <AdminBreadcrumbs parentPage="Manage" pageName="Medicine" />
        <div className="mx-20 w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">User List</h1>
          <ManageUserTable initialData={data} />
        </div>
      </DefaultLayout>
    </div>
  );
}

export default AdminManageUser;
