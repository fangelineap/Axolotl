import { getGlobalProfile } from "@/app/_server-action/global/profile";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import CaregiverScheduleComponent from "@/components/Profile/CaregiverScheduleComponent";
import ViewProfileComponent from "@/components/Profile/ViewProfileComponent";
import { getUserFromSession } from "@/lib/server";
import { getGlobalMetadata } from "@/utils/Metadata/GlobalMetadata";
import { redirect } from "next/navigation";
import { getAdminCaregiverTotalOrders } from "../admin/manage/user/actions";
import { AdminUserTable } from "../admin/manage/user/table/data";

export const metadata = getGlobalMetadata("Profile");

interface ProfileProps {
  searchParams: {
    user: string;
    role: string;
    hasSchedule?: string;
  };
}

/**
 * * Fetch Data for Admin Detailed User Page
 * @param params
 * @returns
 */
async function fetchData(userId: string) {
  const response = await getGlobalProfile(userId);

  return response as AdminUserTable;
}

/**
 * * Get Caregiver Total Order
 * @param user
 * @returns
 */
async function getCaregiverTotalOrders(userId: string, role: string) {
  if (["Nurse", "Midwife"].includes(role)) {
    const totalOrder = await getAdminCaregiverTotalOrders(userId);

    return totalOrder.data ?? 0;
  }

  return 0;
}

async function Profile({ searchParams }: ProfileProps) {
  const { user: userId, role: userRole, hasSchedule } = searchParams;

  // Profile Page Protection
  if (!userId && !userRole) {
    const { data } = await getUserFromSession();

    if (!data) redirect("/auth/signin");

    return redirect(`/profile?user=${data.user_id}&role=${data.role}`);
  }

  const user = await fetchData(userId);
  const totalOrder = await getCaregiverTotalOrders(userId, userRole);

  if (!user) return redirect("/not-found");

  if (!["Nurse", "Midwife"].includes(user.role)) {
    return (
      <CustomLayout>
        <CustomBreadcrumbs pageName="Profile" />
        <ViewProfileComponent user={user} totalOrder={totalOrder} />
      </CustomLayout>
    );
  }

  const caregiverScheduleEmpty = !(
    user.caregiver.schedule_end_day &&
    user.caregiver.schedule_start_day &&
    user.caregiver.schedule_start_time &&
    user.caregiver.schedule_end_time
  );

  if (
    caregiverScheduleEmpty &&
    (hasSchedule === null || !hasSchedule || hasSchedule === "true")
  ) {
    return redirect(
      `/profile?user=${userId}&role=${userRole}&hasSchedule=false`
    );
  }

  return (
    <CustomLayout>
      <CustomBreadcrumbs pageName="Profile" />
      <ViewProfileComponent user={user} totalOrder={totalOrder} />

      {caregiverScheduleEmpty && (
        <CaregiverScheduleComponent
          searchParams={{ ...searchParams, schedule: false }}
        />
      )}
    </CustomLayout>
  );
}

export default Profile;
