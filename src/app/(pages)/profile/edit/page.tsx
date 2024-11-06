import { getGlobalProfile } from "@/app/_server-action/global/profile";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";

import EditProfileComponent from "@/components/Profile/EditProfileComponent";
import { getUserFromSession } from "@/lib/server";
import { getGlobalMetadata } from "@/utils/Metadata/GlobalMetadata";
import { redirect } from "next/navigation";
import { AdminUserTable } from "../../admin/manage/user/table/data";

export const metadata = getGlobalMetadata("EditProfile");

interface EditProfileProps {
  searchParams: {
    user: string;
    role: string;
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

async function EditProfile({ searchParams }: EditProfileProps) {
  const { user: userId, role: userRole } = searchParams;

  // Edit Profile Page Protection
  if (!userId || !userRole) {
    const { data } = await getUserFromSession();

    if (!data) redirect("/auth/signin");

    return redirect(`/profile?user=${data.user_id}&role=${data.role}`);
  }

  const user = await fetchData(userId);

  if (!user) return redirect("/not-found");

  return (
    <CustomLayout>
      <CustomBreadcrumbs subPage="Profile" pageName="Edit" />
      <EditProfileComponent user={user} />
    </CustomLayout>
  );
}

export default EditProfile;
