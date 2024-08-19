import React from "react";

interface OrderStatusProps {
  status: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  return (
    <div className="mb-4 flex flex-row">
      <div>
        <h2 className="text-xl font-bold">Order Status</h2>
        <p className="text-gray-600">Current Status</p>
      </div>

      <div
        className={`ml-9 mt-6 inline-block rounded-full px-7 py-1 text-xs font-bold text-white ${
          status === "Done"
            ? "bg-green-light"
            : status === "Pending"
              ? "bg-yellow-light"
              : "bg-red"
        }`}
      >
        {status}
      </div>
    </div>
  );
};

export default OrderStatus;
