import { toast } from "react-toastify";

export const AdminNewAdminValidation = (form: FormData) => {
  if (
    !form.get("first_name") &&
    !form.get("last_name") &&
    !form.get("email") &&
    !form.get("phone_number") &&
    !form.get("birthdate") &&
    !form.get("gender") &&
    !form.get("address") &&
    !form.get("password") &&
    !form.get("confirm_password")
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

  const birthdate = form.get("birthdate");

  if (birthdate && new Date(birthdate.toString()) > new Date()) {
    toast.warning(
      "Did you come from the future? Please enter a valid birthdate.",
      {
        position: "bottom-right"
      }
    );

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

  if (!form.get("password")) {
    toast.warning("Please enter a password.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("confirm_password")) {
    toast.warning("Please confirm your password.", {
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
