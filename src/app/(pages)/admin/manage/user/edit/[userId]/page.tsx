import React from "react";
import { AdminUserTable } from "../../table/data";
import { getAdminUserByUserID } from "../../actions";
import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";

interface AdminEditUserProfileProps {
  params: {
    userId: string;
  };
}

async function fetchData({ params }: AdminEditUserProfileProps) {
  const response = await getAdminUserByUserID(params.userId);

  return response as AdminUserTable;
}

export async function generateMetadata({ params }: AdminEditUserProfileProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "User Not Found"
    };
  }

  const user_full_name = response.first_name + " " + response.last_name;

  return {
    title: `Update ${user_full_name} Details`
  };
}

async function AdminEditUserProfile({ params }: AdminEditUserProfileProps) {
  const data = await fetchData({ params });

  if (!data) {
    return (
      <AdminLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="View"
      />
    </AdminLayout>
  );
}

export default AdminEditUserProfile;
