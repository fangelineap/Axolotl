import ResetPasswordComponent from "@/components/Auth/ResetPassword/ResetPasswordComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = getGuestMetadata("reset");

const page = ({ searchParams }: any) => {
  if (!searchParams.code) {
    redirect("/auth/forgetpassword");
  }

  return (
    <DefaultLayout>
      <div className="mx-4 my-25 flex h-full w-auto justify-center md:mx-20 md:my-30">
        <ResetPasswordComponent code={searchParams.code} />
      </div>
    </DefaultLayout>
  );
};

export default page;
