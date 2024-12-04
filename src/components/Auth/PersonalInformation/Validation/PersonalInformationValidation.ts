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
  const address = (form.get("address")?.toString() || "").trim().toLowerCase();
  const workExperienceYears = Number(form.get("work_experiences"));

  switch (userType) {
    case "Caregiver":
      if (
        !form.get("address") &&
        !form.get("gender") &&
        !form.get("birthdate") &&
        !form.get("caregiver_role") &&
        !form.get("employment_type") &&
        !form.get("workplace") &&
        !form.get("work_experiences") &&
        !profilePhoto &&
        !licenses
      ) {
        toast.error("Please fill the form.", {
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

      if (!form.get("birthdate")) {
        toast.warning("Please enter your birthdate.", {
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

      if (!form.get("address")) {
        toast.warning("Please enter your address.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!address.includes("malang") && !address.includes("gianyar")) {
        toast.warning(
          "Sorry, we only accept Caregiver from Malang (East Java) or Gianyar (Bali).",
          {
            position: "bottom-right"
          }
        );

        return false;
      }

      if (!form.get("caregiver_role")) {
        toast.warning("Please enter your role.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("employment_type")) {
        toast.warning("Please enter your employment type.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("workplace")) {
        toast.warning("Please enter your workplace.", {
          position: "bottom-right"
        });

        return false;
      }

      if (!form.get("work_experiences")) {
        toast.warning("Please enter your work experiences.", {
          position: "bottom-right"
        });

        return false;
      }

      if (workExperienceYears < 1) {
        toast.warning("Minimal 1 year experiences is required.", {
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

      if (med_freq_day && med_freq_times) {
        if (isNaN(Number(med_freq_times)) || Number(med_freq_times) < 1) {
          toast.warning(
            "Please enter a valid number of medication frequency times.",
            {
              position: "bottom-right"
            }
          );

          return false;
        }

        if (isNaN(Number(med_freq_day)) || Number(med_freq_times) < 1) {
          toast.warning(
            "Please enter a valid number of medication frequency days.",
            {
              position: "bottom-right"
            }
          );

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
          toast.warning(
            `Medication frequency days cannot exceed ${MAX_DAYS} days.`,
            {
              position: "bottom-right"
            }
          );

          return false;
        }
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
