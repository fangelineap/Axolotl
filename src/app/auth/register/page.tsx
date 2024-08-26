import RegisterComponent from "@/components/Auth/Register/Register";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = getMetadata("register");

const RegisterInit = () => {
  return (
    <DefaultLayout>
      <RegisterComponent />
    </DefaultLayout>
  );
};

export default RegisterInit;
