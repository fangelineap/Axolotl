"use client";

import { updateCaregiverSchedule } from "@/app/_server-action/global/profile";
import { CAREGIVER_SCHEDULE_DATA } from "@/types/AxolotlMultipleTypes";
import { Modal } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";
import CustomTimePicker from "../Axolotl/InputFields/CustomTimePicker";
import SelectDropdown from "../Axolotl/SelectDropdown";
import { ScheduleComponentValidation } from "./Validation/ScheduleComponentValidation";

interface CaregiverScheduleComponentProps {
  searchParams: {
    user: string;
    role: string;
    schedule: boolean;
  };
}

function CaregiverScheduleComponent({
  searchParams
}: CaregiverScheduleComponentProps) {
  /**
   * * States & Initial Variables
   */
  const { schedule } = searchParams;
  const router = useRouter();

  /**
   * * Save the schedule
   * @param form
   * @returns
   */
  const saveSchedule = async (form: FormData) => {
    if (!ScheduleComponentValidation(form)) return;

    const scheduleData: CAREGIVER_SCHEDULE_DATA = {
      start_day: form.get("start_day")?.toString() as
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday",
      end_day: form.get("end_day")?.toString() as
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday",
      start_time: form.get("start_time")?.toString() || "",
      end_time: form.get("end_time")?.toString() || ""
    };

    const { success } = await updateCaregiverSchedule(scheduleData);

    if (!success) {
      toast.error("Failed to save your schedule.", {
        position: "bottom-right"
      });

      return;
    }

    toast.success("Successfully saved your schedule.", {
      position: "bottom-right"
    });

    setTimeout(() => {
      router.refresh();
      router.replace("/caregiver");
      router.refresh();
    }, 250);
  };

  return (
    <Modal open={schedule === false ? true : false}>
      <div className="flex min-h-screen items-center justify-center font-normal">
        <div className="mx-auto flex w-1/2 max-w-lg flex-col gap-5 rounded-lg bg-white py-5 shadow-lg">
          {/* HEADER */}
          <div className="flex justify-between border-b border-b-gray-1 px-5 pb-3">
            <h1 className="text-heading-6 font-bold">Set your schedule</h1>
          </div>

          {/* FORM */}
          <form action={saveSchedule} className="flex flex-col gap-3">
            {/* INFO */}
            <div className="flex flex-col gap-5 px-5">
              <div className="flex flex-col items-center justify-center gap-5 rounded-md border border-blue bg-blue-light p-4 text-blue md:flex-row">
                <div className="flex-shrink-0">
                  <IconInfoCircle size={32} />
                </div>
                <p className="text-lg">
                  Before you start, please set your schedule by selecting your{" "}
                  <span className="font-bold">
                    Start Day, Start Time, End Day, and End Time
                  </span>{" "}
                  to make sure you are available.
                </p>
              </div>

              {/* INPUT FIELDS */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <SelectDropdown
                    label="Select Your Start Day"
                    name="start_day"
                    required
                    placeholder="Start Day"
                    content={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                    ]}
                  />
                  <CustomTimePicker
                    placeholder="00:00"
                    value={String(new Date())}
                    label="Start Time"
                    name="start_time"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <SelectDropdown
                    label="Select Your End Day"
                    name="end_day"
                    required
                    placeholder="End Day"
                    content={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                    ]}
                  />
                  <CustomTimePicker
                    placeholder="00:00"
                    value={String(new Date())}
                    label="End Time"
                    name="end_time"
                    required
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mx-5 flex justify-between gap-4">
              <AxolotlButton
                label="Submit"
                isSubmit
                variant="primary"
                fontThickness="bold"
                roundType="regular"
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default CaregiverScheduleComponent;
