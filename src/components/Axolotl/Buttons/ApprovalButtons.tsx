"use client";

import { AdminApprovalTable } from "@/app/(pages)/admin/manage/approval/table/data";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  adminApproveCaregiver,
  adminRejectCaregiver
} from "@/app/(pages)/admin/manage/approval/actions";
import AxolotlModal from "../Modal/AxolotlModal";
import AxolotlRejectionModal from "../Modal/AxolotlRejectionModal";
import AxolotlButton from "./AxolotlButton";

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
        const { error } = await adminApproveCaregiver(caregiver.caregiver_id);

        if (error !== null && error !== undefined) {
          toast.error("Something went wrong.", {
            position: "bottom-right"
          });

          return;
        }

        toast.success("Caregiver approved successfully", {
          position: "bottom-right"
        });

        setTimeout(() => {
          router.refresh();
        }, 1000);
      } catch (error) {
        console.error(error);
        toast.error("Failed to perform the action. Please try again.", {
          position: "bottom-right"
        });
      } finally {
        handleModalClose();
      }
    }
  };

  const handleRejectionModal = async (notes: string) => {
    try {
      const { error } = await adminRejectCaregiver(
        caregiver.caregiver_id,
        notes
      );

      if (error !== null && error !== undefined) {
        toast.error("Failed to perform the action. Please try again.", {
          position: "bottom-right"
        });

        return;
      }

      toast.success("Caregiver rejected successfully", {
        position: "bottom-right"
      });

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to perform the action. Please try again.", {
        position: "bottom-right"
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
      {status === "Unverified" ? (
        <div className="flex w-full items-center justify-center gap-5">
          <AxolotlButton
            label="Reject"
            variant="dangerOutlined"
            fontThickness="bold"
            onClick={handleReject}
          />
          <AxolotlButton
            label="Approve"
            variant="primary"
            onClick={handleApprove}
            fontThickness="bold"
          />
        </div>
      ) : (
        <button
          className="w-full rounded-md border border-gray-cancel bg-gray-cancel p-2 font-bold text-white transition duration-150 ease-in-out hover:bg-gray-cancel-hover hover:text-gray-cancel"
          onClick={() => router.replace("/admin/manage/approval")}
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
        from="approval"
      />
    </div>
  );
}

export default ApprovalButtons;
