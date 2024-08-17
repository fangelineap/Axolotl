import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

function AdminShowMedicine({ params }: { params: { productId: string } }) {
  const { productId } = params;

  return (
    <DefaultLayout>
      <div className="mx-20 h-auto w-auto">
        <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
        <h1>Medicine Details ID: {productId}</h1>
      </div>
    </DefaultLayout>
  );
}

export default AdminShowMedicine;
