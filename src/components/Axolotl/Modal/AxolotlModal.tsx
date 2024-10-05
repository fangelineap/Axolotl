import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import { AdminUserTable } from "@/app/(pages)/admin/manage/user/table/data";
import { Modal } from "@mui/material";
import {
  IconHash,
  IconMedicineSyrup,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import React from "react";

interface AxolotlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  question: string;
  action?: "delete" | "reject" | "confirm" | "skip" | "approve" | "cancel";
  medicine?: AdminMedicineTable | null;
  user?: AdminUserTable | null;
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
}: AxolotlModalProps) {
  const user_full_name = user?.first_name + " " + user?.last_name;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex min-h-screen items-center justify-center font-normal">
        <div className="mx-auto flex w-1/2 max-w-lg flex-col gap-5 rounded-lg bg-white py-3 shadow-lg">
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
                    <IconUserCircle
                      className="text-dark-secondary"
                      stroke={1}
                    />
                    <p className="text-dark-secondary">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4">
            {(action === "delete" || action === "reject") && (
              <>
                <button
                  className="w-1/4 rounded-md border border-gray-cancel bg-gray-cancel px-3 py-2 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel"
                  onClick={onClose}
                >
                  No, cancel
                </button>
                <button
                  className="w-1/4 rounded-md border border-red bg-red px-3 py-2 font-bold text-white hover:bg-red-hover hover:text-red"
                  onClick={onConfirm}
                >
                  Yes, I&apos;m sure
                </button>
              </>
            )}
            {(action === "confirm" || action === "approve") && (
              <>
                <button
                  className="w-1/4 rounded-md border border-gray-cancel bg-gray-cancel px-3 py-2 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel"
                  onClick={onClose}
                >
                  No, cancel
                </button>
                <button
                  className="w-1/4 rounded-md border border-primary bg-primary px-3 py-2 font-bold text-white hover:bg-kalbe-ultraLight hover:text-primary"
                  onClick={onConfirm}
                >
                  Yes, I&apos;m sure
                </button>
              </>
            )}
            {action === "skip" && (
              <>
                <button
                  className="w-1/4 rounded-md border border-red px-3 py-2 font-bold text-red hover:bg-red-hover"
                  onClick={onClose}
                >
                  Not sure
                </button>
                <button
                  className="w-1/4 rounded-md border border-primary bg-primary px-3 py-2 font-bold text-white hover:bg-kalbe-ultraLight hover:text-primary"
                  onClick={onConfirm}
                >
                  Yup, skip it
                </button>
              </>
            )}
            {action === "cancel" && (
              <>
                <button
                  className="w-1/4 rounded-md border border-red bg-white px-3 py-2 font-bold text-red hover:bg-red-hover hover:text-red"
                  onClick={onConfirm}
                >
                  Yes, cancel
                </button>
                <button
                  className="w-1/2 rounded-md border border-gray-cancel bg-gray-cancel px-3 py-2 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel"
                  onClick={onClose}
                >
                  No, continue the registration
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AxolotlModal;
