"use client";

import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import { getClientPublicStorageURL } from "@/app/_server-action/global/storage/client";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import PriceBox from "@/components/Axolotl/InputFields/PriceBox";
import { Skeleton } from "@mui/material";
import { IconBan } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";

interface ViewMedicineProps {
  medicine: AdminMedicineTable;
}

function ViewMedicine(data: ViewMedicineProps) {
  /**
   * * States & Initial Variables
   */
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const medicinePhoto = getClientPublicStorageURL(
    "medicine",
    data.medicine.medicine_photo as string
  );

  /**
   * * Date Formatter
   */
  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(data.medicine.exp_date));

  /**
   * * Handle Image Load
   */
  const handleImageLoad = () => setImageLoaded(true);

  return (
    <>
      {/* Title */}
      <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
      {/* Container */}
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:gap-0">
        {/* Left Side */}
        <div className="w-full lg:mr-11 lg:w-[65%]">
          <div className="mb-4 flex flex-col gap-2">
            <h1 className="text-lg font-semibold">Product Photo</h1>
            {data.medicine.medicine_photo ? (
              <>
                <div
                  className={`flex h-auto min-h-65 w-full appearance-none items-center justify-center rounded-lg border border-primary ${imageLoaded ? "px-4 py-8" : ""} ${data.medicine.medicine_photo ? "bg-white" : "bg-kalbe-ultraLight"}`}
                >
                  {!imageLoaded && (
                    <Skeleton animation="wave" width="80%" height={200} />
                  )}
                  <Image
                    src={medicinePhoto}
                    alt="Medicine Photo"
                    className={`max-h-[25%] max-w-[80%] rounded-xl border border-primary object-contain ${imageLoaded ? "" : "hidden"}`}
                    width={200}
                    height={200}
                    priority
                    onLoad={handleImageLoad}
                  />
                </div>
              </>
            ) : (
              <div className="flex h-65 w-full items-center justify-center rounded-md border border-red bg-red-light">
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
            <DisabledCustomInputGroup
              label="Product ID"
              horizontal
              value={data.medicine.uuid}
              type="text"
            />
            <DisabledCustomInputGroup
              label="Name"
              horizontal
              value={data.medicine.name}
              type="text"
            />
            <DisabledCustomInputGroup
              label="Type"
              horizontal
              value={data.medicine.type}
              type="text"
            />
            <DisabledCustomInputGroup
              label="Exp. Date"
              horizontal
              value={formatDate}
              type="text"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[35%]">
          <div className="flex flex-col rounded-lg border border-gray-1 bg-white p-5">
            <div className="mb-5 flex items-center justify-center text-primary">
              <h1 className="text-center text-heading-4 font-bold">Pricing</h1>
            </div>
            <div className="flex flex-col gap-5">
              <PriceBox
                placeholder={data.medicine.price.toString()}
                value={data.medicine.price}
                disabled={true}
              />

              <AxolotlButton
                label="Update Medicine"
                variant="warningOutlined"
                fontThickness="bold"
                customClasses="text-lg"
                roundType="regular"
                onClick={() => {
                  router.push(
                    `/admin/manage/medicine/edit/${data.medicine.uuid}`
                  );
                }}
              />
              <AxolotlButton
                label="Go back"
                variant="secondary"
                fontThickness="bold"
                customClasses="text-lg"
                roundType="regular"
                onClick={() => router.replace("/admin/manage/medicine")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewMedicine;
