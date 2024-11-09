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
      if (
        !(
          form.get("start_day") &&
          form.get("end_day") &&
          form.get("start_time") &&
          form.get("end_time")
        )
      ) {
        toast.error("Please fill the form.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("start_day")) {
        toast.warning("Please enter the start day.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("end_day")) {
        toast.warning("Please enter the end day.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("start_time")) {
        toast.warning("Please enter the start time.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("end_time")) {
        toast.warning("Please enter the end time.", {
          position: "bottom-right"
        });

        return false;
      }

      return true;
    case "Patient":
      if (
        !(
          form.get("height") &&
          form.get("weight") &&
          form.get("is_smoking") &&
          form.get("illness_history")
        )
      ) {
        toast.error("Please fill the form.", {
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

      const height = Number(form.get("height"));

      if (isNaN(height) || height < 10) {
        toast.warning("What are you? A dwarf? Enter a valid height.", {
          position: "bottom-right"
        });

        return false;
      }

      if (isNaN(height) || height > 300) {
        toast.warning("Please enter a valid height.", {
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

      const weight = Number(form.get("weight"));

      if (isNaN(weight) || weight < 0 || weight > 200) {
        toast.warning("Please enter a valid weight.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("is_smoking")) {
        toast.warning("Please enter your smoking status.", {
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
