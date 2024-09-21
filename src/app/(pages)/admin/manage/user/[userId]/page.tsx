import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { AdminUserTable } from "../table/data";
import { getAdminUserByUserID } from "../actions";
import ViewUser from "@/components/Admin/Manage/User/ViewUser";

interface AdminShowUserProps {
  params: { userId: string };
}

async function fetchData({ params }: AdminShowUserProps) {
  const response = await getAdminUserByUserID(params.userId);
  return response as AdminUserTable;
}

export async function generateMetadata({ params }: AdminShowUserProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "User Not Found",
    };
  }

  const user_full_name = response.first_name + " " + response.last_name;

  return {
    title: `${user_full_name} Details`,
  };
}

async function AdminShowUser({ params }: AdminShowUserProps) {
  const data = await fetchData({ params });

  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="View"
      />
      <ViewUser user={data} />
    </DefaultLayout>
  );
}

export default AdminShowUser;
