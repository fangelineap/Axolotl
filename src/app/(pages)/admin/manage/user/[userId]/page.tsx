import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import ViewUser from "@/components/Admin/Manage/User/ViewUser";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getAdminUserByUserID } from "../actions";
import { AdminUserTable } from "../table/data";

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
      title: "User Not Found"
    };
  }

  const user_full_name = response.first_name + " " + response.last_name;

  return {
    title: `${user_full_name} Details`
  };
}

async function AdminShowUser({ params }: AdminShowUserProps) {
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
      <ViewUser user={data} />
    </AdminLayout>
  );
}

export default AdminShowUser;
