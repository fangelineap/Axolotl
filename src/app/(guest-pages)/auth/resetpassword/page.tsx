import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import ResetPassword from "@/components/Patient/ResetPassword";

export const metadata: Metadata = getGuestMetadata("reset");

const page = ({ searchParams }: any) => {
  if (!searchParams.code) {
    redirect("/auth/forgetpassword");
  }

  return (
    <DefaultLayout>
      <div className="mx-4 my-25 flex h-full w-auto justify-center md:mx-20 md:my-30">
        <ResetPassword code={searchParams.code} />
      </div>
    </DefaultLayout>
  );
};

export default page;
