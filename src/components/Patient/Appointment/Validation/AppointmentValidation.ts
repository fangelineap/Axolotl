import { toast } from "react-toastify";

export const AppointmentValidation = (form: FormData) => {
  const address = (form.get("address")?.toString() || "").trim().toLowerCase();

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

  if (!form.get("birthdate")) {
    toast.warning("Please enter your birthdate.", {
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
    toast.warning("Please enter your gender.", {
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

  if ((form.get("address")?.toString() ?? "").length < 10) {
    toast.warning(
      "Please enter your full address, including its city and province.",
      {
        position: "bottom-right"
      }
    );

    return false;
  }

  if (!address.includes("malang") && !address.includes("gianyar")) {
    toast.warning(
      "Sorry, we only accept Patients from Malang (East Java) or Gianyar (Bali).",
      {
        position: "bottom-right"
      }
    );

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

  if (isNaN(weight) || weight < 10) {
    toast.warning("What are you? A skeleton? Enter a valid weight.", {
      position: "bottom-right"
    });

    return false;
  }

  if (isNaN(weight) || weight > 200) {
    toast.warning("What are you? A Hulk? Enter a valid weight.", {
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

  const med_freq_times = form.get("med_freq_times");
  const med_freq_day = form.get("med_freq_day");

  if (isNaN(Number(med_freq_times))) {
    toast.warning(
      "Please enter a valid number of medication frequency times.",
      {
        position: "bottom-right"
      }
    );

    return false;
  }

  if (isNaN(Number(med_freq_day))) {
    toast.warning("Please enter a valid number of medication frequency days.", {
      position: "bottom-right"
    });

    return false;
  }

  const MAX_TIMES_PER_DAY = 24;
  const MAX_DAYS = 30;

  if (Number(med_freq_times) > MAX_TIMES_PER_DAY) {
    toast.warning(
      `Medication frequency times per day cannot exceed ${MAX_TIMES_PER_DAY}.`,
      {
        position: "bottom-right"
      }
    );

    return false;
  }

  if (Number(med_freq_day) > MAX_DAYS) {
    toast.warning(`Medication frequency days cannot exceed ${MAX_DAYS} days.`, {
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
};
