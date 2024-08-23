import React from "react";

interface OrderDetailProps {
  status: string;
  patientInfo: {
    name: string;
    address: string;
    phoneNumber: string;
    birthdate: string;
  };
  medicalDetails: {
    causes: string;
    mainConcerns: string[];
    currentMedicine: string[];
    symptoms: string[];
    medicalDescriptions: string;
    conjectures: string;
  };
  serviceDetails: {
    orderId: string;
    orderDate: string;
    serviceType: string;
    totalDays: string;
    startTime: string;
    endTime: string;
    serviceFee: string;
    totalCharge: string;
  };
  medications: {
    quantity: number;
    name: string;
    price: string;
  }[];
  price: {
    total: string;
    delivery: string;
    totalCharge: string;
  };
  proofOfService: {
    imageUrl: string;
  };
  orderType: string;
  patientName: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  status,
  patientInfo,
  medicalDetails,
  serviceDetails,
  medications,
  price,
  proofOfService,
}) => {
  return (
    <div className="flex justify-between">
      {/* Left Side */}
      <div className="flex-1">
        {/* Order Status */}
        <div className="flex-auto">
          <div className="mb-6">
            <div>
              <h2 className="text-xl font-bold">Order Status</h2>
            </div>
            <div className="flex flex-row">
              <div>
                <p className="font-bold text-gray-600">Current Status</p>
              </div>
              <div
                className={`ml-20 inline-block rounded-full px-5 py-1.5 text-xs font-bold text-white ${
                  status === "Done"
                    ? "bg-green-500"
                    : status === "Ongoing"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {status}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Patient Information</h2>
          <div className="flex flex-row">
            <div className="flex flex-col gap-y-1">
              <div>
                <strong>Patient Name</strong>
              </div>
              <div>
                <strong>Address</strong>
              </div>
              <div>
                <strong>Phone Number</strong>
              </div>
              <div>
                <strong>Birthdate</strong>
              </div>
            </div>
            <div className="ml-20 flex flex-col gap-y-1">
              <div>{patientInfo.name}</div>
              <div>{patientInfo.address}</div>
              <div>{patientInfo.phoneNumber}</div>
              <div>{patientInfo.birthdate}</div>
            </div>
          </div>
        </div>

        {/* Medical Concerns & Conjecture (Medical Details) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
          <div className="flex flex-row">
            <div className="flex flex-col gap-y-1">
              <div>
                <strong>Causes</strong>
              </div>
              <div>
                <strong>Main Concerns</strong>
              </div>
              <div>
                <strong>Current Medicine</strong>
              </div>
              <div>
                <strong>Symptoms</strong>
              </div>
              <div>
                <strong>Medical Descriptions</strong>
              </div>
            </div>
            <div className="ml-9 flex flex-col gap-y-1">
              <div>{medicalDetails.causes}</div>
              <div>{medicalDetails.mainConcerns.join(", ")}</div>
              <div>{medicalDetails.currentMedicine.join(", ")}</div>
              <div>{medicalDetails.symptoms.join(", ")}</div>
            </div>
          </div>
          <div className="mt-2 flex flex-col">
            <div>{medicalDetails.medicalDescriptions}</div>
          </div>

          <div className="mt-2">
            <div className="rounded-lg border border-green-300">
              <div className="rounded-t-lg bg-green-light py-2 text-center text-white">
                <p className="font-bold">Conjecture</p>
              </div>
              <div className="bg-white py-2 text-center">
                <p className="font-bold text-primary">
                  {medicalDetails.conjectures}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Service Details</h2>
          <div className="flex flex-col gap-y-1">
            <div className="flex">
              <strong className="mr-19.5">Order ID</strong>
              <div className="ml-8">{serviceDetails.orderId}</div>{" "}
            </div>
            <div className="flex">
              <strong className="mr-15">Order Date</strong>
              <div className="ml-8">{serviceDetails.orderDate}</div>
            </div>
            <div className="my-2 w-full border-b border-gray-400"></div>{" "}
            {/* Full-width horizontal line */}
            <div className="flex">
              <strong className="mr-12">Service Type</strong>
              <div className="ml-8">{serviceDetails.serviceType}</div>
            </div>
            <div className="flex">
              <strong className="mr-3">Total Days of Visit</strong>
              <div className="ml-8">{serviceDetails.totalDays}</div>
            </div>
            <div className="flex">
              <strong className="mr-6.5">Start Date/Time</strong>
              <div className="ml-8">{serviceDetails.startTime}</div>
            </div>
            <div className="flex">
              <strong className="mr-8">End Date/Time</strong>
              <div className="ml-8">{serviceDetails.endTime}</div>
            </div>
            <div className="flex">
              <strong className="mr-14.5">Service Fee</strong>
              <div className="ml-8">{serviceDetails.serviceFee}</div>
            </div>
            <div className="flex">
              <strong className="mr-12.5">Total Charge</strong>
              <div className="ml-8">{serviceDetails.totalCharge}</div>
            </div>
          </div>
        </div>

        {/* Additional Medications */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold">Additional Medications</h2>
          <div className="overflow-hidden rounded-lg border border-primary">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-green-light text-white">
                  <th className="rounded-tl-lg p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Name</th>
                  <th className=" rounded-tr-lg p-2  pr-15 text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={index}>
                    <td className=" border-primary p-2 text-left">
                      {med.quantity}
                    </td>
                    <td className=" border-primary p-2">{med.name}</td>
                    <td className=" border-primary p-2 text-right">
                      {med.price}
                    </td>
                  </tr>
                ))}
                {/* Summary Rows */}
                <tr>
                  <td
                    colSpan={2}
                    className="border-t border-primary p-2 text-left font-bold"
                  >
                    Total Price
                  </td>
                  <td className="border-t border-primary p-2 text-right">
                    {price.total}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className=" border-primary p-2 text-left font-bold"
                  >
                    Delivery Fee
                  </td>
                  <td className=" border-primary p-2 text-right">
                    {price.delivery}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="rounded-bl-lg  border-primary p-2 text-left font-bold"
                  >
                    Total Charge
                  </td>
                  <td className="rounded-br-lg  border-primary p-2 text-right font-bold text-black">
                    {price.totalCharge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="mr-14">
        <div className="h-auto w-full max-w-md rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-center text-xl font-bold text-primary">
            Evidence
          </h2>
          <p className="text-md mb-4 text-left font-bold">Proof of Service</p>
          <div className="mt-4 rounded-lg border p-4">
            <img
              src={proofOfService.imageUrl}
              alt="Proof of Service"
              className="mx-auto h-auto max-w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
