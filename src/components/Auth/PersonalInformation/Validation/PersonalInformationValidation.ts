import { toast } from "react-toastify";

export const PersonalInformationValidation = (
  form: FormData,
  userType: "Caregiver" | "Patient",
  profilePhoto?: File | string | null,
  licenses?: {
    cv: File | string | null;
    degree_certificate: File | string | null;
    str: File | string | null;
    sip: File | string | null;
  }
) => {
  switch (userType) {
    case "Caregiver":
      if (
        !form.get("address") &&
        !form.get("gender") &&
        !form.get("birthdate") &&
        !form.get("caregiver_role") &&
        !profilePhoto &&
        !licenses
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("address")) {
        toast.warning("Please enter your address.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("gender")) {
        toast.warning("Please enter your gender.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("birthdate")) {
        toast.warning("Please enter your birthdate.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("caregiver_role")) {
        toast.warning("Please enter your role.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!profilePhoto) {
        toast.warning("Please upload a profile photo.", {
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
    case "Patient":
      if (
        !form.get("address") &&
        !form.get("gender") &&
        !form.get("birthdate") &&
        !form.get("blood_type") &&
        !form.get("height") &&
        !form.get("weight") &&
        !form.get("is_smoking") &&
        !form.get("illness_history")
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("address")) {
        toast.warning("Please enter your address.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("gender")) {
        toast.warning("Please enter your gender.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("birthdate")) {
        toast.warning("Please enter your birthdate.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("blood_type")) {
        toast.warning("Please select your blood type.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("height")) {
        toast.warning("Please enter your height.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("weight")) {
        toast.warning("Please enter your weight.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("is_smoking")) {
        toast.warning("Please select your smoking status.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("illness_history")) {
        toast.warning("Please enter your illness history.", {
          position: "bottom-right"
        });

        return false;
      }

      return true;
    default:
      break;
  }
};
