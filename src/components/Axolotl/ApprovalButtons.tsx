/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AdminApprovalTable } from "@/app/(pages)/admin/manage/approval/table/data";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AxolotlModal from "./AxolotlModal";
import AxolotlRejectionModal from "./AxolotlRejectionModal";
import { adminApproveCaregiver, adminRejectCaregiver } from "@/app/(pages)/admin/manage/approval/actions";

interface ApprovalButtonsProps {
  status: string;
  caregiver: AdminApprovalTable;
}

function ApprovalButtons({ status, caregiver }: ApprovalButtonsProps) {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openRejectionNotesModal, setOpenRejectionNotesModal] = useState(false);
  const [action, setAction] = useState<
    "delete" | "reject" | "confirm" | "skip" | "approve"
  >("reject");
  const router = useRouter();

  const handleModalClose = () => {
    setOpenConfirmationModal(false);
    setOpenRejectionNotesModal(false);
  };

  const handleConfirmationModal = async () => {
    if (action === "reject") {
      setOpenConfirmationModal(false);
      setOpenRejectionNotesModal(true);
    } else {
      try {
        const { data, error } = await adminApproveCaregiver(caregiver.caregiver_id);

        if (error !== null && error !== undefined) {
          toast.error("Something went wrong.", {
            position: "bottom-right",
          });
          return;
        }

        toast.success("Caregiver approved successfully", {
          position: "bottom-right",
        });

        setTimeout(() => {
          router.refresh();
        }, 1000);
      } catch (error) {
        console.error(error);
        toast.error("Failed to perform the action. Please try again.", {
          position: "bottom-right",
        });
      } finally {
        handleModalClose();
      }
    }
  };

  const handleRejectionModal = async (notes: string) => {
    try {
      const { data, error } = await adminRejectCaregiver(
        caregiver.caregiver_id,
        notes,
      );

      if (error !== null && error !== undefined) {
        toast.error("Failed to perform the action. Please try again.", {
          position: "bottom-right",
        });
        return;
      }

      toast.success("Caregiver rejected successfully", {
        position: "bottom-right",
      });

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to perform the action. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      handleModalClose();
    }
  };

  const handleReject = () => {
    setAction("reject");
    setOpenConfirmationModal(true);
  };

  const handleApprove = () => {
    setAction("approve");
    setOpenConfirmationModal(true);
  };

  return (
    <div className="flex w-full items-center justify-end">
      <ToastContainer />
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
        isOpen={openConfirmationModal}
        onClose={handleModalClose}
        onConfirm={handleConfirmationModal}
        title="Confirmation"
        question={`Are you sure you want to ${action} this caregiver?`}
        action={action}
      />

      <AxolotlRejectionModal
        isOpen={openRejectionNotesModal}
        onClose={handleModalClose}
        onReject={handleRejectionModal}
      />
    </div>
  );
}

export default ApprovalButtons;
