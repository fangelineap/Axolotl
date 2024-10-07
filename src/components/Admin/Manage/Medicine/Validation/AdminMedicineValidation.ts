import { toast } from "react-toastify";

export const AdminMedicineValidation = (
  form: FormData,
  medicinePhoto: File | string | null
) => {
  if (
    !medicinePhoto &&
    !form.get("name") &&
    !form.get("type") &&
    !form.get("price") &&
    !form.get("exp_date")
  ) {
    toast.error("Please insert valid data.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!medicinePhoto) {
    toast.warning("Please upload a photo.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("name")) {
    toast.warning("Please enter the medicine name.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("type")) {
    toast.warning("Please enter the medicine type.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("exp_date")) {
    toast.warning("Please select the expiry date.", {
      position: "bottom-right"
    });

    return false;
  }

  if (new Date(form.get("exp_date")?.toString() || "") <= new Date()) {
    toast.warning("The expiry date cannot be in the past or today.", {
      position: "bottom-right"
    });

    return false;
  }

  if (
    !form.get("price") ||
    isNaN(parseFloat(form.get("price")?.toString() || "0"))
  ) {
    toast.warning("Please enter a valid price.", {
      position: "bottom-right"
    });

    return false;
  }

  if ((form.get("price")?.toString().length ?? 0) <= 2) {
    toast.warning(
      "Bro, this isn't a thrift store 🤡. Add some digits before we go broke 💸",
      {
        position: "bottom-right"
      }
    );

    return false;
  }

  return true;
};
