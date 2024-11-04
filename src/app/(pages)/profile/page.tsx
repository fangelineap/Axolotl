import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import { getUserFromSession } from "@/lib/server";
import { getGlobalMetadata } from "@/utils/Metadata/GlobalMetadata";
import { redirect } from "next/navigation";

export const metadata = getGlobalMetadata("Profile");

interface ProfileProps {
  searchParams: {
    user: string;
    role: string;
  };
}

async function Profile({ searchParams }: ProfileProps) {
  const { user: userId, role: userRole } = searchParams;

  if (!userId || !userRole) {
    const { data } = await getUserFromSession();

    if (!data) redirect("/auth/signin");

    return redirect(`/profile?user=${data.user_id}&role=${data.role}`);
  }

  return (
    <CustomLayout>
      <div>hell yea</div>
      {/* <ViewProfile /> */}
    </CustomLayout>
  );
}

export default Profile;
