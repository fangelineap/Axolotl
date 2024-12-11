import { toast } from "react-toastify";

export const OrderFormValidation = (
  serviceType: string,
  form: FormData,
  concern: string,
  selectedAll: string[],
  day_of_visit: number
) => {
  if (
    serviceType &&
    !form.get("causes") &&
    concern &&
    !form.get("currentMedication") &&
    !form.get("medicalDescription") &&
    selectedAll.length < 1 &&
    day_of_visit
  ) {
    toast.error("Please fill the form.", {
      position: "bottom-right"
    });

    return false;
  }

  if (serviceType === "") {
    toast.warn("Please select a service type.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("causes")) {
    toast.warn("Please enter your causes.", {
      position: "bottom-right"
    });

    return false;
  }

  if (concern === "") {
    toast.warn("Please select your concern.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("currentMedication")) {
    toast.warn("Please enter your current medication.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("medicalDescription")) {
    toast.warn("Please enter your medical description.", {
      position: "bottom-right"
    });

    return false;
  }

  const medicalDescription = form.get("medicalDescription")!.toString();

  if (medicalDescription.length < 20) {
    toast.warn("Your medical description should be at least 20 characters.", {
      position: "bottom-right"
    });

    return false;
  }

  if (selectedAll.length < 1) {
    toast.warn("Please select your symptoms.", {
      position: "bottom-right"
    });

    return false;
  }

  if (selectedAll.length < 2) {
    toast.warn("Your symptoms should be at least 2 symptoms.", {
      position: "bottom-right"
    });

    return false;
  }

  if (day_of_visit === 0) {
    toast.warn("Please add a day of visit.", {
      position: "bottom-right"
    });

    return false;
  }

  return true;
};
