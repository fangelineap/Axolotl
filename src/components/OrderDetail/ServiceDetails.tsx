import React from "react";

interface ServiceDetailsProps {
  orderId: string;
  orderDate: string;
  serviceType: string;
  totalDays: string;
  startTime: string;
  endTime: string;
  serviceFee: string;
  totalCharge: string;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  orderId,
  orderDate,
  serviceType,
  totalDays,
  startTime,
  endTime,
  serviceFee,
  totalCharge,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">Service Details</h2>
      <p>
        <strong>Order ID:</strong> {orderId}
      </p>
      <p>
        <strong>Order Date:</strong> {orderDate}
      </p>
      <p>
        <strong>Service Type:</strong> {serviceType}
      </p>
      <p>
        <strong>Total Days of Visit:</strong> {totalDays}
      </p>
      <p>
        <strong>Start Date/Time:</strong> {startTime}
      </p>
      <p>
        <strong>End Date/Time:</strong> {endTime}
      </p>
      <p>
        <strong>Service Fee:</strong> {serviceFee}
      </p>
      <p>
        <strong>Total Charge:</strong> {totalCharge}
      </p>
    </div>
  );
};

export default ServiceDetails;
