import { toast } from "react-toastify";

export const SignInValidation = (form: FormData) => {
  if (!form.get("email") && !form.get("password")) {
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

  if (!form.get("password")) {
    toast.warning("Please enter a password.", {
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

  return true;
};
