import { toast } from "react-toastify";

export const AppointmentValidation = (form: FormData) => {
  if (
    !form.get("appointmentDate") &&
    !form.get("appointmentTime") &&
    !form.get("appointmentService")
  ) {
    toast.error("Please fill the form.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("appointmentDate")) {
    toast.warning("Please enter your Appointment Date.", {
      position: "bottom-right"
    });

    return false;
  }

  if (!form.get("appointmentTime")) {
    toast.warning("Please enter your Appointment Time.", {
      position: "bottom-right"
    });

    return false;
  }

  const appointmentDateValue = form.get("appointmentDate")?.toString();
  const appointmentTimeValue = form.get("appointmentTime")?.toString();

  if (appointmentDateValue && appointmentTimeValue) {
    const appointmentDate = new Date(appointmentDateValue);

    if (isNaN(appointmentDate.getTime())) {
      toast.warning("Please enter a valid Appointment Date.", {
        position: "bottom-right"
      });

      return false;
    }

    const [hoursStr, minutesStr] = appointmentTimeValue.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      toast.warning("Please enter a valid Appointment Time.", {
        position: "bottom-right"
      });

      return false;
    }

    appointmentDate.setHours(hours, minutes, 0, 0);
    const now = new Date();

    if (appointmentDate < now) {
      toast.warning(
        "Appointments cannot be scheduled in the past. Please select a future date and time.",
        {
          position: "bottom-right"
        }
      );

      return false;
    }

    const oneHourLater = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    if (appointmentDate < oneHourLater) {
      toast.warning(
        "Appointments must be scheduled at least 1 hour in advance.",
        {
          position: "bottom-right"
        }
      );

      return false;
    }
  }

  if (!form.get("appointmentService")) {
    toast.warning("Please enter your Appointment Service.", {
      position: "bottom-right"
    });

    return false;
  }

  return true;
};
