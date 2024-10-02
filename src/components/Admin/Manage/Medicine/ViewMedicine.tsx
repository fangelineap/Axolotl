"use client";

import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import DisabledLabel from "@/components/Axolotl/DisabledLabel";
import PriceBox from "@/components/Axolotl/PriceBox";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(data.medicine.exp_date));

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medicine/${encodeURIComponent(data.medicine.medicine_photo)}`}
                    alt="Medicine Photo"
                    className={`max-h-[25%] max-w-[80%] rounded-xl border border-primary object-contain ${imageLoaded ? "" : "hidden"}`}
                    width={200}
                    height={200}
                    layout="responsive"
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
            <DisabledLabel
              label="Product ID"
              horizontal
              value={data.medicine.uuid}
              type="text"
            />
            <DisabledLabel
              label="Name"
              horizontal
              value={data.medicine.name}
              type="text"
            />
            <DisabledLabel
              label="Type"
              horizontal
              value={data.medicine.type}
              type="text"
            />
            <DisabledLabel
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

              <button
                onClick={() => {
                  router.push(
                    `/admin/manage/medicine/edit/${data.medicine.uuid}`
                  );
                }}
                className="w-full rounded-[4px] border border-yellow-dark py-2 text-lg font-semibold text-yellow-dark hover:bg-yellow-light"
              >
                Update Medicine
              </button>
              <button
                onClick={() => router.replace("/admin/manage/medicine")}
                className="w-full rounded-[4px] border border-gray-cancel bg-gray-cancel py-2 text-lg font-semibold text-white hover:bg-gray-cancel-hover hover:text-gray-cancel"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewMedicine;
