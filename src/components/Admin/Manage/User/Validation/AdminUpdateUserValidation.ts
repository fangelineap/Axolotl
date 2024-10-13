import { toast } from "react-toastify";

export const AdminUpdateUserValidation = (
  form: FormData,
  userType: "Admin" | "Caregiver"
) => {
  switch (userType) {
    case "Admin":
      if (
        !form.get("first_name") &&
        !form.get("last_name") &&
        !form.get("email") &&
        !form.get("phone_number") &&
        !form.get("birthdate") &&
        !form.get("gender") &&
        !form.get("address")
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (
        (!form.get("first_name") || !form.get("last_name")) &&
        ((form.get("first_name")?.toString().length ?? 0) < 3 ||
          (form.get("last_name")?.toString().length ?? 0) < 3)
      ) {
        toast.warning(
          "Please enter a valid first and last name. Both names must be at least 3 characters.",
          {
            position: "bottom-right"
          }
        );

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

      if (!form.get("birthdate")) {
        toast.warning("Please enter a birthdate.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("gender")) {
        toast.warning("Please enter a gender.", {
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
        !form.get("cv") &&
        !form.get("degree_certificate") &&
        !form.get("str") &&
        !form.get("sip")
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (
        (!form.get("first_name") || !form.get("last_name")) &&
        ((form.get("first_name")?.toString().length ?? 0) < 3 ||
          (form.get("last_name")?.toString().length ?? 0) < 3)
      ) {
        toast.warning(
          "Please enter a valid first and last name. Both names must be at least 3 characters.",
          {
            position: "bottom-right"
          }
        );

        return false;
      }

      if (!form.get("email")) {
        toast.warning("Please enter an email.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("cv")) {
        toast.warning("Please upload a CV.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("degree_certificate")) {
        toast.warning("Please upload a Degree Certificate.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("str")) {
        toast.warning("Please upload a Surat Tanda Registrasi.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("sip")) {
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
