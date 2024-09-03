"use client";

import { AdminApprovalTable } from "@/app/(pages)/admin/manage/approval/table/data";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import AxolotlModal from "./AxolotlModal";

interface ApprovalButtonsProps {
  status: string;
  caregiver?: AdminApprovalTable;
}

function ApprovalButtons({ status, caregiver }: ApprovalButtonsProps) {
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState<"delete" | "reject" | "confirm" | "skip" | "approve">("delete");
  const router = useRouter();

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalConfirm = async () => {
    try {
      if (action === "reject") {
        // Placeholder for the reject functionality
        // await rejectCaregiver(caregiver?.uuid);

        toast.success("Caregiver rejected successfully", {
          position: "bottom-right",
        });
      } else {
        // Placeholder for the approve functionality
        // await approveCaregiver(caregiver?.uuid);

        toast.success("Caregiver approved successfully", {
          position: "bottom-right",
        });
      }

      router.refresh();
    } catch (error) {
      toast.error("Failed to perform the action. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      handleModalClose();
    }
  };

  const handleReject = () => {
    setAction("reject");
    setOpenModal(true);
  };

  const handleApprove = () => {
    setAction("approve");
    setOpenModal(true);
  };

  return (
    <div className="flex w-full items-center justify-end">
      {status === "Unverified" ? (
        <div className="flex w-full items-center justify-center gap-5">
          <button
            className="w-full rounded-md border border-red p-2 font-bold text-red hover:bg-red-hover"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="w-full rounded-md border border-primary bg-primary p-2 font-bold text-white hover:bg-kalbe-ultraLight hover:text-primary"
            onClick={handleApprove}
          >
            Approve
          </button>
        </div>
      ) : (
        <button
          className="w-1/2 rounded-md border border-gray-cancel bg-gray-cancel p-2 font-bold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel"
          onClick={() => router.back()}
        >
          Go back
        </button>
      )}

      <AxolotlModal
        isOpen={openModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Confirmation"
        question={`Are you sure you want to ${action} this caregiver?`}
        action={action}
        approval={caregiver}
      />
    </div>
  );
}

export default ApprovalButtons;
