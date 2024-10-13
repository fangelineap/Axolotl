import ViewApproval from "@/components/Admin/Manage/Approval/ViewApproval";
import AdminLayout from "@/components/Admin/Manage/AdminLayout";
import AdminBreadcrumbs from "@/components/Breadcrumbs/AdminBreadcrumbs";
import { getSingleAdminApprovalById } from "../actions";
import { AdminApprovalTable } from "../table/data";

interface AdminShowApprovalProps {
  params: { userId: string };
}

/**
 * * Fetch Data for Admin Detailed Approval Page
 * @param params
 * @returns
 */
async function fetchData({ params }: AdminShowApprovalProps) {
  const response = await getSingleAdminApprovalById(params.userId);

  return response as AdminApprovalTable;
}

/**
 * * Generate Metadata for Admin Detailed Approval Page
 * @param params
 * @returns
 */
export async function generateMetadata({ params }: AdminShowApprovalProps) {
  const response = await fetchData({ params });

  if (!response) {
    return {
      title: "User Not Found"
    };
  }

  const full_name = response.users.first_name + " " + response.users.last_name;

  return {
    title: `${full_name} Details`
  };
}

/**
 * * Render Admin Detailed Approval Page
 * @param params
 * @returns
 */
async function AdminShowApproval({ params }: AdminShowApprovalProps) {
  const response = await fetchData({ params });

  if (!response) {
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
        subPage="Approval"
        pageName="Profile"
      />
      <ViewApproval caregiver={response} />
    </AdminLayout>
  );
}

export default AdminShowApproval;
