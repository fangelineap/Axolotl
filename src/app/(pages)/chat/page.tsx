import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import CustomLayout from "@/components/Axolotl/Layouts/CustomLayout";
import ChatCard from "@/components/Chat/ChatComponent";
import { getUserFromSession } from "@/lib/server";
import { getGlobalMetadata } from "@/utils/Metadata/GlobalMetadata";
import { redirect } from "next/navigation";

interface ChatProps {
  searchParams: {
    user: string;
    role: string;
  };
}

/**
 * * Generate Metadata for Chat Page
 * @param params
 * @returns
 */
export function generateMetadata({ searchParams }: ChatProps) {
  const { role: userRole } = searchParams;

  return getGlobalMetadata("Chat", userRole);
}

/**
 * * Render Chat Page
 * @param params
 * @returns
 */
async function Chat({ searchParams }: ChatProps) {
  const { user: userId, role: userRole } = searchParams;

  if (["Admin", "Caregiver"].includes(userRole))
    return redirect(`/${userRole.toLowerCase()}`);

  if (!userId || !userRole) {
    const { data } = await getUserFromSession();

    if (!data) redirect("/auth/signin");

    return redirect(`/chat?user=${data.user_id}&role=${data.role}`);
  }

  return (
    <div className="bg-gray">
      <CustomLayout>
        <CustomBreadcrumbs pageName="Chat" />
        <ChatCard senderId={userId} role={userRole} />
      </CustomLayout>
    </div>
  );
}

export default Chat;
