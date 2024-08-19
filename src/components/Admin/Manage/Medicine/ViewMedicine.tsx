"use client";

import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import EditLabel from "@/components/Axolotl/EditLabel";
import PriceBox from "@/components/Axolotl/PriceBox";
import { IconBan } from "@tabler/icons-react";
import React, { useState } from "react";

interface ViewMedicineProps {
  add?: boolean;
  view?: boolean;
  medicine: AdminMedicineTable;
}

function ViewMedicine({ add, view, medicine }: ViewMedicineProps) {
  const [editMode, setEditMode] = useState(false);

  // TODO: Add form validation
  const [formData, setFormData] = useState({
    name: medicine.name,
    type: medicine.type,
    price: medicine.price,
    exp_date: medicine.exp_date,
  });

  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(formData.exp_date));

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedMedicine = {
        uuid: medicine.uuid,
        name: formData.name,
        type: formData.type,
        price: formData.price,
        exp_date: formData.exp_date,
      };

      // TODO: Update the medicine in the database
      const response = await fetch(`/api/medicines/${medicine.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMedicine),
      });
      
      // TODO: Set Toast
      if (response.ok) {
        alert("Medicine details updated successfully.");
        setEditMode(false);
      } else {
        alert("Failed to update medicine details.");
      }
    } catch (error) {
      console.error("Error updating medicine details:", error);
      alert("An error occurred while updating the medicine details.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: medicine.name,
      type: medicine.type,
      price: medicine.price,
      exp_date: medicine.exp_date,
    });
    setEditMode(false);
  };

  return (
    <div className="mx-20 h-auto w-auto">
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
      {/* Container */}
      <div className="flex flex-col justify-between lg:flex-row">
        {/* Left Side */}
        <div className="w-[100%] lg:mr-11 lg:w-[65%]">
          <div className="mb-4 flex flex-col gap-2">
            <h1 className="text-lg font-semibold">Product Photo</h1>
            {medicine.medicine_photo ? (
              <div className="h-auto w-[100%] rounded-md border border-red bg-red-light"></div>
            ) : (
              <div className="flex h-65 w-[100%] items-center justify-center rounded-md border border-red bg-red-light">
                <div className="flex flex-col items-center justify-center">
                  <IconBan size={50} className="mb-2 text-red" />
                  <h1 className="font-medium">There is no picture yet</h1>
                  <p className="text-dark-secondary">
                    This medicine was inserted by Caregiver
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <EditLabel
              label="Product ID"
              value={medicine.uuid}
              type="text"
              disabled={true}
            />
            <EditLabel
              label="Name"
              value={formData.name}
              type="text"
              disabled={!editMode}
              onChange={handleInputChange}
            />
            <EditLabel
              label="Type"
              value={formData.type}
              type="text"
              disabled={!editMode}
              onChange={handleInputChange}
            />
            <EditLabel
              label="Exp. Date"
              value={formatDate}
              type="text"
              disabled={!editMode}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-[100%] lg:w-[35%]">
          <div className="flex flex-col rounded-lg border border-gray-1 bg-white p-5">
            <div className="mb-5 flex items-center justify-center text-primary">
              <h1 className="text-center text-heading-4 font-bold">Pricing</h1>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold">
                  Price{" "}
                  <span className="text-sm font-normal text-dark-secondary">
                    /pcs
                  </span>
                </h1>
                <PriceBox
                  value={formData.price}
                  disabled={!editMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="w-full rounded-[4px] border border-red py-2 text-lg font-semibold text-red hover:bg-red-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="w-full rounded-[4px] bg-primary text-white py-2 text-lg font-semibold hover:text-primary hover:bg-kalbe-veryLight"
                  >
                    Update Medicine
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleEditMode}
                    className="w-full rounded-[4px] border border-yellow-dark py-2 text-lg font-semibold text-yellow-dark hover:bg-yellow-light"
                  >
                    Update Medicine
                  </button>
                  <button className="w-full rounded-[4px] bg-gray-cancel py-2 text-lg font-semibold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel">
                    Go back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMedicine;
