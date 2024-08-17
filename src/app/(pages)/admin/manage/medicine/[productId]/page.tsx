import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { AdminMedicineTable, data } from "../table/data";

interface MedicinePageProps {
  params: { productId: string };
}

export async function generateMetadata({ params }: MedicinePageProps) {
  const { productId } = params;
  const medicine = data.find((item) => item.uuid === productId);

  if (!medicine) {
    return {
      title: "Medicine Not Found",
    };
  }

  return {
    title: `${medicine.name} Details`,
  };
}

export default function AdminShowMedicine({ params }: MedicinePageProps) {
  const { productId } = params;
  const medicine = data.find((item) => item.uuid === productId);

  if (!medicine) {
    return (
      <DefaultLayout>
        <div className="mx-20 h-auto w-auto">
          <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
          <p>No medicine details found.</p>
        </div>
      </DefaultLayout>
    );
  }

  const { uuid, name, type, price } = medicine;

  return (
    <DefaultLayout>
      <div className="mx-20 h-auto w-auto">
        <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
        <h1>Medicine Details ID: {uuid}</h1>
        <h1>Medicine Name: {name}</h1>
        <h1>Medicine Type: {type}</h1>
        <h1>Medicine Price: {price}</h1>
      </div>
    </DefaultLayout>
  );
}
