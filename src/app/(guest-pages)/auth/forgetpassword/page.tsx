import ForgetPasswordComponent from "@/components/Auth/ForgetPassword/ForgetPasswordComponent";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
export const metadata: Metadata = getGuestMetadata("forgot");

const page = () => {
  return (
    <DefaultLayout>
      <div className="mx-4 my-25 flex h-full w-auto justify-center md:mx-20 md:my-35">
        <ForgetPasswordComponent />
      </div>
    </DefaultLayout>
  );
};

export default page;
