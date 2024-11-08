import { toast } from "react-toastify";

export const UpdateProfileValidation = (
  form: FormData,
  userType: "Basic" | "Caregiver" | "Patient"
) => {
  switch (userType) {
    case "Basic":
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
    case "Patient":
    default:
      break;
  }
};
