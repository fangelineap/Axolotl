"use client";

import React, { useEffect, useState } from "react";
import Medicine from "./Medicine";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";
import { fetchMedicineOrderById } from "@/app/_server-action/patient";
import {
  MEDICINE,
  MEDICINE_ORDER_DETAIL_WITH_MEDICINE
} from "@/types/AxolotlMainType";
import AxolotlModal from "../Axolotl/Modal/AxolotlModal";

interface MedicineProps {
  id: string;
  total_qty: number;
  sub_total_medicine: number;
  delivery_fee: number;
  total_price: number;
  is_paid: boolean;
  paid_at: Date;
  updated_at: Date;
  created_at: Date;
  medicine_order_detail_id: string;
  medicineOrderDetail: {
    id: string;
    quantity: number;
    total_price: number;
    created_at: Date;
    updated_at: Date;
    medicine_id: string;
    medicine: MEDICINE;
  }[];
}

const AdditionalMedicine = ({ medicineOrder }: { medicineOrder: string }) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [medicine, setMedicine] = useState<MedicineProps>({} as MedicineProps);
  const [selection, setSelection] = useState<
    MEDICINE_ORDER_DETAIL_WITH_MEDICINE[]
  >([] as MEDICINE_ORDER_DETAIL_WITH_MEDICINE[]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectAll) {
      setSelection(medicine.medicineOrderDetail);
    } else {
      setSelection([]);
    }
  }, [selectAll]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchMedicineOrderById(medicineOrder);
      console.log("data order", data);
      setMedicine(data);

      console.log("medicine data", data.medicineOrderDetail);
    };

    getData();
  }, []);

  const handleConfirmModal = () => {
    console.log("hi");
  };

  return (
    <div className="">
      <h1 className="mb-5 text-2xl font-semibold">Additional Medicine</h1>
      <h2 className="mb-2 text-lg font-semibold">
        Your Caregiver Recommendations
      </h2>

      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="w-[100%] lg:mr-7 lg:w-[65%]">
          {!medicine.is_paid && (
            <div className="mb-5.5 flex items-center justify-between rounded-md border border-stroke px-5 py-3">
              <div className="flex">
                <input
                  className="mr-2"
                  type="checkbox"
                  checked={
                    selection.length > 0
                      ? selection.length === medicine.medicineOrderDetail.length
                        ? true
                        : false
                      : false
                  }
                  onClick={() => {
                    setSelectAll(!selectAll);
                  }}
                />
                <h1 className="font-semibold">
                  Select All ({selection.length})
                </h1>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex flex-col gap-5 rounded-md border border-stroke px-5 py-7">
            {medicine.medicineOrderDetail &&
              medicine.medicineOrderDetail.length > 0 &&
              medicine.medicineOrderDetail.map((meds, index) => (
                <>
                  <Medicine
                    selectAll={selectAll}
                    selection={selection}
                    setSelection={setSelection}
                    medicineDetail={meds}
                    is_paid={medicine.is_paid}
                  />
                  {index !== medicine.medicineOrderDetail.length - 1 && (
                    <div className="h-[1px] w-[100%] bg-stroke"></div>
                  )}
                </>
              ))}
          </div>
        </div>

        <div className="h-[100%] w-[100%] rounded-md border border-stroke p-7 lg:w-[35%]">
          <div>
            <h1 className="mb-2 text-center text-xl font-bold text-kalbe-light">
              Additional Payment
            </h1>
            <div className="flex justify-between">
              <p className="mb-1 text-dark-secondary">
                Total Price (
                {medicine.medicineOrderDetail &&
                  medicine.medicineOrderDetail.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}{" "}
                item)
              </p>
              <p>
                Rp.{" "}
                {medicine.medicineOrderDetail &&
                  medicine.medicineOrderDetail.reduce(
                    (acc, item) => acc + item.total_price,
                    0
                  )}
              </p>
            </div>
            <div className="mb-3 flex justify-between">
              <p className="mb-1 text-dark-secondary">Delivery Fee</p>
              <p>Rp. 10.000</p>
            </div>
          </div>
          <div className="mb-3 h-[1px] w-[100%] bg-kalbe-light"></div>
          <div className="mb-5 flex justify-between">
            <h1>Total Charge</h1>
            <h1 className="font-semibold">
              Rp.{" "}
              {medicine.medicineOrderDetail &&
                medicine.medicineOrderDetail.reduce(
                  (acc, item) => acc + item.total_price,
                  0
                ) + 10000}
            </h1>
          </div>

          {medicine.is_paid ? (
            <div>
              <h1 className="mb-2 text-lg font-semibold">Payment Status</h1>
              <div className="mb-3.5 rounded-[7px] border border-primary bg-kalbe-proLight p-1.5 text-center text-primary">
                <h1 className="text-lg font-semibold">Verified</h1>
              </div>
              <AxolotlButton
                label="Finish"
                onClick={() => {}}
                variant="primary"
                fontThickness="bold"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AxolotlButton
                label="Continue to Payment"
                onClick={() => setIsOpen(true)}
                variant="primary"
                fontThickness="bold"
              />
              <AxolotlButton
                label="Skip This Step"
                onClick={() => {}}
                variant="primaryOutlined"
                fontThickness="bold"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AxolotlModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmModal}
        title="Confirmation"
        question="Are you sure you want to skip this step?"
        action="skip"
      />
    </div>
  );
};

export default AdditionalMedicine;
