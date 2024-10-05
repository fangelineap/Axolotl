"use client";

import { Modal } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

interface AxolotlRejectionModalProps {
  isOpen: boolean;
  onReject: (notes: string) => void;
  onClose: () => void;
}

function AxolotlRejectionModal({
  isOpen,
  onReject,
  onClose
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
    if (!notes.trim()) {
      setError("Rejection reason is required.");

      return;
    }
    if (notes.trim().length < 10) {
      setError("Rejection reason must be at least 10 characters.");

      return;
    }
    onReject(notes);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="flex min-h-screen items-center justify-center font-normal">
        <div className="mx-auto flex w-1/2 max-w-lg flex-col gap-5 rounded-lg bg-white py-3 shadow-lg">
          <div className="flex justify-between border-b border-b-gray-1 px-5 pb-3">
            <h1 className="text-heading-6 font-bold">Rejection Notes</h1>
            <button onClick={onClose}>
              <IconX className="text-dark-secondary hover:text-gray-2" />
            </button>
          </div>
          <div className="flex flex-col gap-5 px-5">
            <p className="text-xl text-dark-secondary">
              Please add why you reject this caregiver
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
              />
              {error && <p className="text-sm text-red">{error}</p>}
            </div>
          </div>
          <div className="flex items-center justify-center px-5">
            <button
              className="w-full rounded-md border border-red bg-red px-3 py-2 font-bold text-white hover:bg-red-hover hover:text-red"
              onClick={handleFormSubmit}
            >
              Reject this Caregiver
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AxolotlRejectionModal;
