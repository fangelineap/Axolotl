"use client";

import { Modal } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import AxolotlButton from "../Buttons/AxolotlButton";

interface AxolotlRejectionModalProps {
  isOpen: boolean;
  onReject: (notes: string) => void;
  onClose: () => void;
  from: "approval" | "appointment";
}

function AxolotlRejectionModal({
  isOpen,
  onReject,
  onClose,
  from
}: AxolotlRejectionModalProps) {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);

    if (e.target.value.trim()) {
      setError("");
    }
  };

  const handleFormSubmit = () => {
    switch (from) {
      case "approval":
        if (!notes.trim()) {
          setError("Rejection reason is required.");

          return;
        }
        if (notes.trim().length < 10) {
          setError("Rejection reason must be at least 10 characters.");

          return;
        }
        onReject(notes);
      case "appointment":
        if (!notes.trim()) {
          setError("Please add why you cancel this appointment.");

          return;
        }
        if (notes.trim().length < 10) {
          setError("Cancellation reason must be at least 10 characters.");

          return;
        }
        onReject(notes);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <form
        action={handleFormSubmit}
        className="flex min-h-screen items-center justify-center font-normal"
      >
        <div className="mx-auto flex w-1/2 max-w-lg flex-col gap-5 rounded-lg bg-white py-3 shadow-lg">
          <div className="flex justify-between border-b border-b-gray-1 px-5 pb-3">
            <h1 className="text-heading-6 font-bold">
              {from === "approval" ? "Rejection Notes" : "Cancellation Reason"}
            </h1>
            <button onClick={onClose}>
              <IconX className="text-dark-secondary hover:text-gray-2" />
            </button>
          </div>
          <div className="flex flex-col gap-5 px-5">
            <p className="text-xl text-dark-secondary">
              {from === "approval"
                ? "Please add why you reject this caregiver"
                : "Please add why you cancel this appointment"}
            </p>
            <div className="flex w-full flex-col gap-2">
              <textarea
                className={`h-32 rounded-md border p-2 focus:outline-none ${
                  error
                    ? "border-red focus:border-red"
                    : "border-gray-1 focus:border-primary active:border-primary"
                }`}
                value={notes}
                onChange={handleNotesChange}
                placeholder="Enter rejection reason here..."
                required
              />
              {error && <p className="text-sm text-red">{error}</p>}
            </div>
          </div>
          <div className="flex items-center justify-center px-5">
            <AxolotlButton
              isSubmit
              label={
                from === "approval"
                  ? "Reject this Caregiver"
                  : "Cancel this Appointment"
              }
              variant="danger"
              fontThickness="bold"
              roundType="regular"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default AxolotlRejectionModal;
