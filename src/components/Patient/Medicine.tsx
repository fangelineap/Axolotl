"use client";

import Image from "next/image";
import React, { useState } from "react";
import DisabledCustomInputGroup from "../Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import { MEDICINE, MEDICINE_ORDER_DETAIL_WITH_MEDICINE } from "@/types/axolotl";

interface MedicineProps {
  selectAll: boolean;
  selection: MEDICINE_ORDER_DETAIL_WITH_MEDICINE[];
  setSelection: React.Dispatch<
    React.SetStateAction<MEDICINE_ORDER_DETAIL_WITH_MEDICINE[]>
  >;
  medicineDetail: {
    id: string;
    quantity: number;
    total_price: number;
    created_at: Date;
    updated_at: Date;
    medicine_id: string;
    medicine: MEDICINE;
  };
}

const Medicine = ({
  selectAll,
  selection,
  setSelection,
  medicineDetail
}: MedicineProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-start gap-5">
        <input
          type="checkbox"
          checked={selection.includes(medicineDetail)}
          onClick={() =>
            setSelection(
              selection.includes(medicineDetail)
                ? selection.filter((item) => item.id !== medicineDetail.id)
                : [...selection, medicineDetail]
            )
          }
        />
        <Image
          src="/images/user/caregiver.png"
          width={50}
          height={50}
          className="h-[100px] w-[100px] rounded-md object-cover"
          alt="medicine"
        />
        <div>
          <h1 className="mb-2 text-lg">
            {medicineDetail.medicine.name}
            <span className="text-base text-stroke">/strip</span>
          </h1>
          <h1>{medicineDetail.medicine.type}</h1>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <h1 className="font-semibold">Rp. {medicineDetail.medicine.price}</h1>
        <div className="mb-3 flex w-[100px]">
          <input
            className="w-full rounded-l-md border border-gray-1 bg-white py-2 text-center font-normal text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            type="number"
            name="quantity"
            id="quantity"
            placeholder={medicineDetail.quantity.toString()}
            required
            disabled
          />
          <span className="border-gray-r rounded-r-md border border-l-0 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
            Qty
          </span>
        </div>
      </div>
    </div>
  );
};

export default Medicine;
