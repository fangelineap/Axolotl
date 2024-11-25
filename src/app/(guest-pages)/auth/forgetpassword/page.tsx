import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ForgetPassword from "@/components/Patient/ForgetPassword";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
export const metadata: Metadata = getGuestMetadata("forgot");

const page = () => {
  return (
    <DefaultLayout>
      <div className="mx-4 my-25 flex h-full w-auto justify-center md:mx-20 md:my-35">
        <ForgetPassword />
      </div>
    </DefaultLayout>
  );
};

export default page;
