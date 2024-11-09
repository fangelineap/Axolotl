import { toast } from "react-toastify";

export const ScheduleComponentValidation = (form: FormData) => {
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

  if (!form.get("start_time")) {
    toast.warning("Please enter the start time.", {
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

  if (!form.get("end_time")) {
    toast.warning("Please enter the end time.", {
      position: "bottom-right"
    });

    return false;
  }

  return true;
};
