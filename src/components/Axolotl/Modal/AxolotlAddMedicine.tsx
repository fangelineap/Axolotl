import React from "react";
import Image from "next/image";
import InputGroupWithChange from "@/components/FormElements/InputGroup/InputWithChange";
import SelectGroupWithChange from "@/components/FormElements/SelectGroup/SelectGroupWithChange";
import ExpiredDatePicker from "@/components/FormElements/DatePicker/ExpiredDatePicker";
import InputGroupWithCurrency from "@/components/FormElements/InputGroup/InputGroupWithCurrency";
import { MEDICINE } from "@/types/AxolotlMainType";

interface NewMedicine {
  name: string;
  type: string;
  price: number;
  quantity: number;
  expired: string | null;
}

interface MedicineModalProps {
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
  medicinePhoto?: string | null;
  onClose: () => void;
  onSave: () => void;
}

const MedicineModal: React.FC<MedicineModalProps> = ({
  mode,
  isOpen,
  currentMedicine,
  newMedicine,
  setNewMedicine,
  medicinePhoto,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto w-full max-w-lg overflow-y-auto rounded-lg bg-white">
        <div className="rounded-t-lg bg-primary px-6 py-4">
          <h2 className="text-center text-lg font-bold text-white">
            {mode === "addExisting" ? "Add Medicine" : "Add New Medicine"}
          </h2>
        </div>
        <div className="p-6">
          {mode === "addExisting" && currentMedicine ? (
            <>
              {/* Display Medicine Photo */}
              <div className="mb-6">
                <h3 className="mb-2 font-bold text-primary">Medicine Photo</h3>
                <div className="flex h-48 w-full items-center justify-center rounded-lg border border-primary p-4">
                  {medicinePhoto ? (
                    <div className="relative flex h-full w-full items-center justify-center">
                      <Image
                        src={medicinePhoto}
                        alt="Medicine"
                        className="object-contain"
                        layout="fill"
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
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border p-2"
                    value={currentMedicine.name}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Type</label>
                  <input
                    className="mt-1 block w-full rounded border p-2"
                    value={currentMedicine.type}
                    disabled
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium">
                      Expired Date
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded border p-2"
                      value={new Date(currentMedicine.exp_date).toDateString()}
                      disabled
                    />
                  </div>
                  <div className="w-1/2 pl-4">
                    <label className="block text-sm font-medium">Price</label>
                    <input
                      type="text"
                      className="block w-full rounded border p-2 pl-10"
                      value={`Rp. ${currentMedicine.price}`}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            newMedicine &&
            setNewMedicine && (
              <>
                {/* Add New Medicine Form */}
                <div className="mb-4">
                  <InputGroupWithChange
                    label="Name"
                    type="text"
                    placeholder="Enter medicine name"
                    required
                    name="medicineName"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ name: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <SelectGroupWithChange
                    name="Brand"
                    label="Type"
                    content={["Branded", "Generic"]}
                    required
                    onChange={(value) => setNewMedicine({ type: value })}
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <ExpiredDatePicker
                    label="Expired Date"
                    required
                    name="expiredDate"
                    expired={newMedicine.expired || ""}
                    onChange={(date) => setNewMedicine({ expired: date })}
                  />
                  <div className="w-1/2 pl-4">
                    <InputGroupWithCurrency
                      label="Price"
                      type="text"
                      placeholder="Enter medicine price"
                      required
                      name="medicinePrice"
                      value={newMedicine.price.toLocaleString("id-ID")}
                      onChange={(e) => {
                        const price = parseInt(
                          e.target.value.replace(/\./g, "")
                        );
                        setNewMedicine({ price: isNaN(price) ? 0 : price });
                      }}
                    />
                  </div>
                </div>
              </>
            )
          )}

          {/* Modal Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              className="rounded bg-gray-500 px-4 py-2 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded bg-primary px-4 py-2 text-white"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineModal;
