import { getGlobalProfile } from "@/app/_server-action/global/profile";
import ViewUser from "@/components/Admin/Manage/User/ViewUser";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import { getAdminCaregiverTotalOrders } from "../actions";
import { AdminUserTable } from "../table/data";
import { getIncompleteUserPersonalInformation } from "@/app/_server-action/auth";

interface AdminShowUserProps {
  params: { userId: string };
}

/**
 * * Fetch Data for Admin Detailed User Page
 * @param params
 * @returns
 */
async function fetchData({ params }: AdminShowUserProps) {
  const response = await getGlobalProfile(params.userId);

  return response as AdminUserTable;
}

/**
 * * Get Caregiver Total Order
 * @param user
 * @returns
 */
async function getCaregiverTotalOrders(user: AdminUserTable) {
  if (["Nurse", "Midwife"].includes(user.role)) {
    const totalOrder = await getAdminCaregiverTotalOrders(user.user_id);

    return totalOrder.data ?? 0;
  }

  return 0;
}

/**
 * * Generate Metadata for Admin Detailed User Page
 * @param params
 * @returns
 */
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

/**
 * * Render Admin Detailed User Page
 * @param params
 * @returns
 */
async function AdminShowUser({ params }: AdminShowUserProps) {
  const data = await fetchData({ params });
  const totalOrder = await getCaregiverTotalOrders(data);

  const { is_complete } = await getIncompleteUserPersonalInformation(
    data.id,
    data.role
  );

  if (!data) {
    return (
      <CustomLayout>
        <div className="mx-20 flex h-[75vh] w-auto items-center justify-center">
          <h1 className="mb-5 text-heading-1 font-bold">
            Something went wrong
          </h1>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout>
      <CustomBreadcrumbs
        parentPage="Manage"
        subPage="Medicine"
        pageName="View"
      />
      <ViewUser user={data} totalOrder={totalOrder} is_complete={is_complete} />
    </CustomLayout>
  );
}

export default AdminShowUser;
