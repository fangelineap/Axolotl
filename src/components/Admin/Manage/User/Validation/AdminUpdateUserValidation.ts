import { toast } from "react-toastify";

export const AdminUpdateUserValidation = (
  form: FormData,
  userType: "Admin" | "Caregiver",
  licenses?: {
    cv: File | string | null;
    degree_certificate: File | string | null;
    str: File | string | null;
    sip: File | string | null;
  }
) => {
  switch (userType) {
    case "Admin":
      if (
        !form.get("email") &&
        !form.get("phone_number") &&
        !form.get("address")
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("email")) {
        toast.warning("Please enter an email.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("phone_number")) {
        toast.warning("Please enter a phone number.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("address")) {
        toast.warning("Please enter an address.", {
          position: "bottom-right"
        });

        return false;
      }

      return true;
    case "Caregiver":
      if (
        !form.get("employment_type") &&
        !form.get("work_experiences") &&
        !form.get("workplace") &&
        !licenses
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("employment_type")) {
        toast.warning("Please enter an Employment Type.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("workplace")) {
        toast.warning("Please enter a workplace.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("work_experiences")) {
        toast.warning("Please enter work experiences.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!licenses?.cv) {
        toast.warning("Please upload a CV.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!licenses?.degree_certificate) {
        toast.warning("Please upload a Degree Certificate.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!licenses?.str) {
        toast.warning("Please upload a Surat Tanda Registrasi.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!licenses?.sip) {
        toast.warning("Please upload a Surat Izin Praktik.", {
          position: "bottom-right"
        });

        return false;
      }

      return true;
    default:
      break;
  }
};
