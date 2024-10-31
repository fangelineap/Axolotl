import { toast } from "react-toastify";

export const CreateAccountValidation = (form: FormData, role: string) => {
  if (
    !role &&
    !form.get("first_name") &&
    !form.get("last_name") &&
    !form.get("email") &&
    !form.get("phone_number") &&
    !form.get("password") &&
    !form.get("confirm_password")
  ) {
    toast.error("Please fill the form.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!role) {
    toast.error(
      "Whoops! I think you forgot to select your role. Please go back and try again",
      {
        position: "bottom-right"
      }
    );
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

  if (!form.get("password")) {
    toast.warning("Please enter a password.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("confirm_password")) {
    toast.warning("Please enter your password again.", {
      position: "bottom-right"
    });

    return false;
  }

  if ((form.get("password")?.toString().length ?? 0) < 6) {
    toast.warning("Your password should be at least 6 characters.", {
      position: "bottom-right"
    });

    return false;
  }

  if (form.get("password") !== form.get("confirm_password")) {
    toast.error("Your passwords did not match.", {
      position: "bottom-right"
    });

    return false;
  }

  return true;
};
