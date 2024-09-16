import { getUserFromSession } from "@/app/lib/server";
import RegisterComponent from "@/components/Auth/Register/Register";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getGuestMetadata } from "@/utils/Metadata/GuestMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = getGuestMetadata("register");

const RegisterInit = async () => {
  /**
   * Get user from session
   */
  const { data: userSession } = await getUserFromSession();

  if (userSession) {
    if (userSession[0].role == "Patient") {
      redirect("/patient");
    } else if (
      userSession[0].role == "Nurse" ||
      userSession[0].role == "Midwife"
    ) {
      redirect("/caregiver");
    } else if (userSession[0].role == "Admin") {
      redirect("/admin");
    }
  }

  return (
    <DefaultLayout>
      <RegisterComponent />
    </DefaultLayout>
  );
};

export default RegisterInit;
