import RegisterComponent from "@/components/Auth/Register/Register";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = getGuestMetadata("register");

const RegisterInit = () => {
  return (
    <DefaultLayout>
      <RegisterComponent />
    </DefaultLayout>
  );
};

export default RegisterInit;
