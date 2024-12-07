"use client";

import CustomDatePickerCaregiver from "@/components/Caregiver/InputField/CustomDatePickerCaregiver";
import { MEDICINE } from "@/types/AxolotlMainType";
import {
  globalFormatDate,
  globalFormatPrice
} from "@/utils/Formatters/GlobalFormatters";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import AxolotlButton from "../Buttons/AxolotlButton";
import DisabledCustomInputGroup from "../DisabledInputFields/DisabledCustomInputGroup";
import CustomInputGroup from "../InputFields/CustomInputGroup";
import PriceBox from "../InputFields/PriceBox";
import SelectDropdown from "../SelectDropdown";

interface NewMedicine {
  name: string;
  type: string;
  price: number;
  quantity: number;
  expired: string | null;
}

interface AxolotlAddMedicineModalProps {
  mode: "addExisting" | "addNew";
  isOpen: boolean;
  currentMedicine?: MEDICINE | null;
  newMedicine?: {
    name: string;
    type: string;
    price: number;
    quantity: number;
    expired: string | null;
  };
  setNewMedicine?: (medicine: Partial<NewMedicine>) => void;
  medicinePhoto?: string;
  onClose: () => void;
  onSave: () => void;
}

const AxolotlAddMedicineModal: React.FC<AxolotlAddMedicineModalProps> = ({
  mode,
  isOpen,
  currentMedicine,
  newMedicine,
  setNewMedicine,
  medicinePhoto,
  onClose,
  onSave
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageLoad = () => setLoading(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-lg bg-white">
        <div className="rounded-t-lg bg-primary px-6 py-4">
          <h1 className="flex-none text-center text-heading-6 font-bold text-white">
            {mode === "addExisting" ? "Add Medicine" : "Add New Medicine"}
          </h1>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          {mode === "addExisting" && currentMedicine ? (
            <>
              {/* Display Medicine Photo */}
              <div className="mb-6">
                <h3 className="mb-2 font-bold text-primary">Medicine Photo</h3>
                <div className="flex h-48 w-full items-center justify-center rounded-lg border border-primary p-4">
                  {currentMedicine.medicine_photo && medicinePhoto ? (
                    <div className="relative flex h-full w-full items-center justify-center">
                      {!loading && (
                        <Skeleton animation="wave" width="80%" height={200} />
                      )}
                      <Image
                        src={medicinePhoto}
                        alt="Medicine"
                        className="object-contain"
                        layout="fill"
                        priority
                        onLoad={handleImageLoad}
                      />
                    </div>
                  ) : (
                    <p>No Image Available</p>
                  )}
                </div>
              </div>

              {/* Display Existing Medicine Details */}
              <div className="mb-4">
                <h3 className="mb-2 font-bold text-primary">
                  Medicine Description
                </h3>
                <div className="mb-4">
                  <DisabledCustomInputGroup
                    type="text"
                    label="Name"
                    value={currentMedicine.name}
                  />
                </div>
                <div className="mb-4">
                  <DisabledCustomInputGroup
                    type="text"
                    label="Type"
                    value={currentMedicine.type}
                  />
                </div>
                <div className="mb-4 flex gap-5">
                  <DisabledCustomInputGroup
                    type="text"
                    label="Expired Date"
                    value={globalFormatDate(
                      new Date(currentMedicine.exp_date),
                      "shortDate"
                    )}
                  />
                  <PriceBox
                    placeholder={globalFormatPrice(currentMedicine.price)}
                    value={globalFormatPrice(currentMedicine.price)}
                    disabled={true}
                    isViewOnly={true}
                  />
                </div>
              </div>
            </>
          ) : (
            newMedicine &&
            setNewMedicine && (
              <>
                {/* Add New Medicine Form */}
                <div className="mb-4">
                  <CustomInputGroup
                    label="Medicine Name"
                    type="text"
                    name="medicineName"
                    onChange={(e) => setNewMedicine({ name: e.target.value })}
                    placeholder="Enter medicine name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <SelectDropdown
                    name="medicineType"
                    label="Type"
                    content={["Branded", "Generic"]}
                    required
                    placeholder="Select medicine type"
                    value={newMedicine.type}
                    onChange={(e) => setNewMedicine({ type: e.target.value })}
                  />
                </div>
                <div className="mb-4 flex gap-5">
                  <CustomDatePickerCaregiver
                    name="exp_date"
                    label="Exp. Date"
                    placeholder={"Select Exp. Date"}
                    required={true}
                    horizontal={false}
                    onChange={(e) =>
                      setNewMedicine({
                        expired: e.target.value
                      })
                    }
                  />
                  <PriceBox
                    placeholder="Enter medicine price"
                    required
                    name="medicinePrice"
                    value={newMedicine.price.toLocaleString("id-ID")}
                    disabled={false}
                    onChange={(e) => {
                      const price = parseInt(e.target.value.replace(/\./g, ""));
                      setNewMedicine({ price: isNaN(price) ? 0 : price });
                    }}
                  />
                </div>
              </>
            )
          )}

          {/* Modal Action Buttons */}
          <div className="flex justify-end gap-5">
            <AxolotlButton
              type="button"
              label="Cancel"
              fontThickness="bold"
              variant="secondary"
              onClick={onClose}
            />
            <AxolotlButton
              type="button"
              label="Save"
              fontThickness="bold"
              variant="primary"
              onClick={onSave}
              isSubmit
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AxolotlAddMedicineModal;
