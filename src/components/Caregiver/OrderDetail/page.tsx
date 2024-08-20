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
    conjectures: string[];
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
  proofOfService,
  orderType,
  patientName,
}) => {
  return (
    <div>
      {/* Order Type and Patient Name */}
      <h2>Order Type: {orderType}</h2>
      <h2>Patient Name: {patientName}</h2>

      {/* Order status */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Order Status</h2>
        <p className="text-gray-600">Current Status</p>
        <div
          className={`ml-9 mt-2 inline-block rounded-full px-7 py-1 text-xs font-bold text-white ${
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

      {/* Patient Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Patient Information</h2>
        <p>
          <strong>Patient Name:</strong> {patientInfo.name}
        </p>
        <p>
          <strong>Address:</strong> {patientInfo.address}
        </p>
        <p>
          <strong>Phone Number:</strong> {patientInfo.phoneNumber}
        </p>
        <p>
          <strong>Birthdate:</strong> {patientInfo.birthdate}
        </p>
      </div>

      {/* Medical Concerns & Conjecture (Medical Details) */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
        <p>
          <strong>Causes:</strong> {medicalDetails.causes}
        </p>
        <p>
          <strong>Main Concerns:</strong>{" "}
          {medicalDetails.mainConcerns.join(", ")}
        </p>
        <p>
          <strong>Current Medicine:</strong>{" "}
          {medicalDetails.currentMedicine.join(", ")}
        </p>
        <p>
          <strong>Symptoms:</strong> {medicalDetails.symptoms.join(", ")}
        </p>
        <p>
          <strong>Medical Descriptions:</strong>{" "}
          {medicalDetails.medicalDescriptions}
        </p>
        <div className="mt-2">
          {medicalDetails.conjectures.map((conjecture, index) => (
            <span
              key={index}
              className="mr-2 inline-block rounded-full bg-green-500 px-3 py-1 text-xs text-white"
            >
              {conjecture}
            </span>
          ))}
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Service Details</h2>
        <p>
          <strong>Order ID:</strong> {serviceDetails.orderId}
        </p>
        <p>
          <strong>Order Date:</strong> {serviceDetails.orderDate}
        </p>
        <p>
          <strong>Service Type:</strong> {serviceDetails.serviceType}
        </p>
        <p>
          <strong>Total Days of Visit:</strong> {serviceDetails.totalDays}
        </p>
        <p>
          <strong>Start Date/Time:</strong> {serviceDetails.startTime}
        </p>
        <p>
          <strong>End Date/Time:</strong> {serviceDetails.endTime}
        </p>
        <p>
          <strong>Service Fee:</strong> {serviceDetails.serviceFee}
        </p>
        <p>
          <strong>Total Charge:</strong> {serviceDetails.totalCharge}
        </p>
      </div>

      {/* Additional Medications */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">Additional Medications</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{med.quantity}</td>
                <td className="border p-2">{med.name}</td>
                <td className="border p-2 text-right">{med.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Proof of Service */}
      <div className="ml-8 w-1/3">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Evidence</h2>
          <div className="border p-4">
            <h3 className="mb-2 text-lg font-bold">Proof of Service</h3>
            <img
              src={proofOfService.imageUrl}
              alt="Proof of Service"
              className="h-auto max-w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
