import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import { MEDICINE, ORDER_APPOINTMENT } from "@/types/AxolotlMainType";
import { Modal } from "@mui/material";
import {
  IconHash,
  IconMail,
  IconMedicineSyrup,
  IconUserCircle,
  IconX
} from "@tabler/icons-react";
import AxolotlButton from "../Buttons/AxolotlButton";

interface AxolotlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  question: string;
  action?:
    | "delete"
    | "reject"
    | "confirm"
    | "skip"
    | "approve"
    | "cancel"
    | "cancel appointment";
  medicine?: MEDICINE | null;
  user?: AdminUserTable | null;
  order?: ORDER_APPOINTMENT | null;
}

function AxolotlModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  question,
  action,
  medicine,
  user,
  order
}: AxolotlModalProps) {
  const user_full_name = user?.first_name + " " + user?.last_name;

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
                </div>
              </div>
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
