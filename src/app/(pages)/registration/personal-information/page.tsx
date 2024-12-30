import PersonalInformationComponent from "@/components/Auth/PersonalInformation/PersonalInformationComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getUserFromSession } from "@/lib/server";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = getGuestMetadata("personal information");

interface PersonalInformationProps {
  searchParams: {
    role: string;
    user: string;
    "signed-in": string;
  };
}

const PersonalInformation = async ({
  searchParams
}: PersonalInformationProps) => {
  const { role: paramsRole, user, "signed-in": signedIn } = searchParams;

  if (!paramsRole || !user || !signedIn) {
    const { data } = await getUserFromSession();

    if (!data) redirect("/auth/signin");

    redirect(
      `/registration/personal-information?role=${data.role}&user=${data.user_id}&signed-in=true&personal-information=false`
    );
  }

  return (
    <DefaultLayout>
      <PersonalInformationComponent paramsRole={paramsRole} />
    </DefaultLayout>
  );
};

export default PersonalInformation;
