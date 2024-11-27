import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import { MEDICINE } from "@/types/AxolotlMainType";
import { Modal } from "@mui/material";
import {
  IconClock,
  IconHash,
  IconMail,
  IconMapPin,
  IconMedicineSyrup,
  IconUserCircle,
  IconX
} from "@tabler/icons-react";
import AxolotlButton from "../Buttons/AxolotlButton";
import { CAREGIVER_SCHEDULE_ORDER } from "@/types/AxolotlMultipleTypes";

interface AxolotlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmAddSymptom?: (symptom: string) => void;
  title: string;
  question: string;
  action?:
    | "delete"
    | "reject"
    | "confirm"
    | "skip"
    | "approve"
    | "cancel"
    | "cancel appointment"
    | "add symptom";
  medicine?: MEDICINE | null;
  user?: AdminUserTable | null;
  order?: CAREGIVER_SCHEDULE_ORDER | null;
}

function AxolotlModal({
  isOpen,
  onClose,
  onConfirm,
  confirmAddSymptom,
  title,
  question,
  action,
  medicine,
  user,
  order
}: AxolotlModalProps) {
  const user_full_name = user?.first_name + " " + user?.last_name;

  const handleAddSymptom = (form: FormData) => {
    if (confirmAddSymptom) {
      onClose();
      confirmAddSymptom(form.get("additionalSymptom")?.toString() || "");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex min-h-screen items-center justify-center font-normal">
        <div className="mx-auto flex w-1/2 max-w-lg flex-col gap-5 rounded-lg bg-white py-5 shadow-lg">
          <div className="flex justify-between border-b border-b-gray-1 px-5 pb-3">
            <h1 className="text-heading-6 font-bold">{title}</h1>
            <button onClick={onClose}>
              <IconX className="text-dark-secondary hover:text-gray-2" />
            </button>
          </div>
          <div className="flex flex-col gap-5 px-5">
            {action === "add symptom" ? (
              <form action={handleAddSymptom}>
                <div className="flex flex-col gap-2">
                  <label className="block text-body-sm font-medium text-dark dark:text-white">
                    Add Symptom <span className="ml-1 text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="additionalSymptom"
                    placeholder="Enter symptom"
                    className={`rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary`}
                  />
                </div>
                <div className="mt-5 flex justify-between gap-4">
                  <AxolotlButton
                    label="Cancel"
                    onClick={onClose}
                    variant="secondaryOutlined"
                    fontThickness="bold"
                    roundType="regular"
                  />
                  <AxolotlButton
                    label="Add Symptom"
                    type="submit"
                    isSubmit
                    variant="primary"
                    fontThickness="bold"
                    roundType="regular"
                  />
                </div>
              </form>
            ) : (
              <>
                <p className="text-lg text-dark-secondary">{question}</p>
                {medicine && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-medium text-black">
                      {medicine.name}
                    </h3>
                    <div className="flex gap-2">
                      <IconHash className="text-dark-secondary" stroke={1} />
                      <p className="text-dark-secondary">{medicine.uuid}</p>
                    </div>
                    <div className="flex gap-2">
                      <IconMedicineSyrup
                        className="text-dark-secondary"
                        stroke={1}
                      />
                      <p className="text-dark-secondary">{medicine.type}</p>
                    </div>
                  </div>
                )}
                {user && (
                  <div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-medium text-black">
                        {user_full_name}
                      </h3>
                      <div className="flex gap-2">
                        <IconHash className="text-dark-secondary" stroke={1} />
                        <p className="text-dark-secondary">{user.user_id}</p>
                      </div>
                      <div className="flex gap-2">
                        <IconMail className="text-dark-secondary" stroke={1} />
                        <p className="text-dark-secondary">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <IconUserCircle
                          className="text-dark-secondary"
                          stroke={1}
                        />
                        <p className="text-dark-secondary">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
                {order && (
                  <div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-medium text-black">
                        {order.appointment.service_type}
                      </h3>
                      <p className="text-dark-secondary">
                        {order.appointment.main_concern}
                      </p>
                      <div className="flex gap-2">
                        <IconUserCircle
                          className="text-dark-secondary"
                          stroke={1}
                        />
                        <p className="text-dark-secondary">
                          {order.patient.users.first_name}{" "}
                          {order.patient.users.last_name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <IconClock className="text-dark-secondary" stroke={1} />
                        <p className="text-dark-secondary">
                          {order.appointment.appointment_time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <IconMapPin
                          className="text-dark-secondary"
                          stroke={1}
                        />
                        <p className="text-dark-secondary">
                          {order.patient.users.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mx-5 flex justify-between gap-4">
            {(action === "delete" || action === "reject") && (
              <>
                <AxolotlButton
                  label="No, cancel"
                  onClick={onClose}
                  variant="secondaryOutlined"
                  fontThickness="bold"
                  roundType="regular"
                />
                <AxolotlButton
                  label="Yes, I'm sure"
                  isSubmit
                  onClick={onConfirm}
                  variant="danger"
                  fontThickness="bold"
                  roundType="regular"
                />
              </>
            )}
            {(action === "confirm" || action === "approve") && (
              <>
                <AxolotlButton
                  label="No, cancel"
                  onClick={onClose}
                  variant="secondaryOutlined"
                  fontThickness="bold"
                  roundType="regular"
                />
                <AxolotlButton
                  label="Yes, I'm sure"
                  isSubmit
                  onClick={onConfirm}
                  variant="primary"
                  fontThickness="bold"
                  roundType="regular"
                />
              </>
            )}
            {action === "skip" && (
              <>
                <AxolotlButton
                  label="Not now"
                  onClick={onConfirm}
                  variant="danger"
                  fontThickness="bold"
                  roundType="regular"
                />
                <AxolotlButton
                  label="Yup, skip it"
                  onClick={onConfirm}
                  variant="primary"
                  fontThickness="bold"
                  roundType="regular"
                />
              </>
            )}
            {action === "cancel" && (
              <>
                <AxolotlButton
                  label="Yes, cancel the registration"
                  isSubmit
                  onClick={onConfirm}
                  variant="danger"
                  fontThickness="bold"
                  roundType="regular"
                />
                <AxolotlButton
                  label="No, continue the registration"
                  onClick={onClose}
                  variant="secondaryOutlined"
                  fontThickness="bold"
                  roundType="regular"
                />
              </>
            )}
            {action === "cancel appointment" && (
              <>
                <AxolotlButton
                  label="No, cancel"
                  onClick={onClose}
                  variant="secondaryOutlined"
                  fontThickness="bold"
                  roundType="regular"
                />
                <AxolotlButton
                  label="Yes, I'm sure"
                  isSubmit
                  onClick={onConfirm}
                  variant="danger"
                  fontThickness="bold"
                  roundType="regular"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AxolotlModal;
