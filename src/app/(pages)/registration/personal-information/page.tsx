import PersonalInformationComponent from "@/components/Auth/PersonalInformation/PersonalInformationComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";

export const metadata: Metadata = getGuestMetadata("personal information");

interface PersonalInformationProps {
  searchParams: {
    role: string;
    user: string;
    "signed-in": string;
  };
}

const PersonalInformation = ({ searchParams }: PersonalInformationProps) => {
  const { role: paramsRole, user, "signed-in": signedIn } = searchParams;

  if (!paramsRole || !user || !signedIn) {
    window.location.reload();
  }

  return (
    <DefaultLayout>
      <PersonalInformationComponent paramsRole={paramsRole} />
    </DefaultLayout>
  );
};

export default PersonalInformation;
