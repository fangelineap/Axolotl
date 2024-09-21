import ViewApproval from "@/components/Admin/Manage/Approval/ViewApproval";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getSingleAdminApprovalById } from "../actions";
import { AdminApprovalTable } from "../table/data";

interface AdminShowApprovalProps {
  params: { userId: string };
}

async function fetchData({ params }: AdminShowApprovalProps) {
  const response = await getSingleAdminApprovalById(params.userId);
  return response as AdminApprovalTable;
}

export async function generateMetadata({ params }: AdminShowApprovalProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "User Not Found",
    };
  }

  const full_name = response.user.first_name + " " + response.user.last_name;

  return {
    title: `${full_name} Details`,
  };
}

async function AdminShowApproval({ params }: AdminShowApprovalProps) {
  const response = await fetchData({ params });

  if (!response) {
    return (
      <DefaultLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <AdminBreadcrumbs
        parentPage="Manage"
        subPage="Approval"
        pageName="Profile"
      />
      <ViewApproval caregiver={response} />
    </DefaultLayout>
  );
}

export default AdminShowApproval;
