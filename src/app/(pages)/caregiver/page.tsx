"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactModal from "react-modal";
import { fetchOrdersByCaregiver } from "@/app/server-action/caregiver/action";

// Helper function to format the date
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return date.toLocaleDateString("en-US", options);
};

const Dashboard = () => {
  const today = new Date();
  const [orders, setOrders] = useState<{ [key: string]: any[] }>({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [reasonModalIsOpen, setReasonModalIsOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const groupOrdersByDate = (orders: any[]) => {
    return orders.reduce(
      (groupedOrders, order) => {
        const dateKey = formatDate(
          new Date(order.appointment.appointment_date)
        );
        if (!groupedOrders[dateKey]) {
          groupedOrders[dateKey] = [];
        }
        groupedOrders[dateKey].push(order);
        return groupedOrders;
      },
      {} as { [key: string]: any[] }
    );
  };

  // Fetch orders from the backend
  useEffect(() => {
    const getOrders = async () => {
      const data = await fetchOrdersByCaregiver();
      if (data) {
        const filteredOrders = data.filter((order) => {
          const appointmentDate = new Date(
            order.appointment.appointment_date
          ).setHours(0, 0, 0, 0);
          // Only show orders that are today or in the future
          const todayDate = new Date().setHours(0, 0, 0, 0);
          return appointmentDate >= todayDate; // Compare dates without considering time
        });

        const groupedOrders = groupOrdersByDate(filteredOrders);
        setOrders(groupedOrders);
      }
    };

    getOrders();
  }, []);

  const openModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAppointment(null);
  };

  const openReasonModal = () => {
    setModalIsOpen(false);
    setReasonModalIsOpen(true);
  };

  const closeReasonModal = () => {
    setReasonModalIsOpen(false);
  };

  const handleCancel = () => {
    console.log("Cancel appointment", selectedAppointment);
    openReasonModal();
  };

  const handleFinalCancel = () => {
    console.log("Reason for cancellation:", cancellationReason);
    closeReasonModal();
    // Further logic to handle the cancellation can be added here
  };

  return (
    <DefaultLayout>
      <nav className="mb-2 text-sm text-gray-600">Dashboard / Schedule</nav>
      <h1 className="text-5xl font-bold">Schedule</h1>

      {Object.keys(orders).length === 0 ? (
        <div className="ml-3 mr-3 mt-4 rounded-lg border border-gray-300 p-4 text-center">
          You don&apos;t have any appointments today.
        </div>
      ) : (
        Object.keys(orders).map((date) => (
          <div key={date} className="mt-8">
            <h2
              className={`text-3xl font-medium sm:text-2xl ${
                date === formatDate(today)
                  ? "rounded-lg border-0 bg-kalbe-ultraLight pb-2 pl-5 pt-2 text-kalbe-light"
                  : "rounded-lg border-0 bg-gray pb-2 pl-5 pt-2 text-gray-800"
              }`}
            >
              {date}{" "}
              {date === formatDate(today) && (
                <span className="text-kalbe-light">| Today</span>
              )}
            </h2>

            {orders[date].map((order) => (
              <div
                key={order.id}
                className="ml-3 mr-3 mt-4 rounded-lg border border-gray-300 p-4"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between">
                  <div className=" flex-1 lg:mb-0">
                    <h3 className="text-lg font-bold">
                      {order.appointment.service_type}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.appointment.main_concern}
                    </p>
                    <div className="mb-2 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Image
                          width={16}
                          height={16}
                          src="/images/icon/profile-icon.svg"
                          alt="Profile"
                        />
                        <span className="ml-2">
                          {order.patient?.users?.first_name}{" "}
                          {order.patient?.users?.last_name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Image
                          width={16}
                          height={16}
                          src="/images/icon/clock-icon.svg"
                          alt="Calendar"
                        />
                        <span className="ml-2">
                          {order.appointment?.appointment_time}
                        </span>
                      </div>
                      <div className=" flex items-center">
                        <Image
                          width={16}
                          height={16}
                          src="/images/icon/location-icon.svg"
                          alt="Location"
                        />
                        <span className="ml-2">
                          {order.patient?.users?.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:p-3 lg:mb-0 lg:flex-row lg:items-start lg:space-x-4">
                    <button className="hover:bg-green-success-hover mb-2 mt-0 rounded-lg border border-green px-4 py-2 text-sm font-bold text-kalbe-light hover:bg-green-light-4">
                      See more
                    </button>
                    <div className="hidden lg:block lg:h-20 lg:border-l lg:border-gray-400"></div>

                    <div className="flex flex-col">
                      <button
                        className="b mb-2 rounded-lg border bg-gray-cancel px-4 py-2 text-sm font-bold text-white hover:bg-gray-cancel-hover hover:text-black"
                        onClick={() => openModal(order.appointment)}
                      >
                        Cancel Appointment
                      </button>

                      <button className="bg-green-success hover:bg-green-success-hover mb-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-green-light-4 hover:text-primary">
                        Medicine Preparation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* First Modal */}
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Cancel Appointment"
        className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4"
        ariaHideApp={false}
      >
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Confirmation</h2>
          {selectedAppointment && (
            <div>
              <p className="mb-4">
                Are you sure you want to cancel this appointment?
              </p>
              <p className="mb-2">
                <strong>{selectedAppointment.title}</strong>
              </p>
              <p className="text-sm text-gray-500">
                {selectedAppointment.description}
              </p>
              <p className="text-sm text-gray-500">
                {selectedAppointment.provider}
              </p>
              <p className="text-sm text-gray-500">
                {selectedAppointment.startTime} - {selectedAppointment.endTime}
              </p>
              <p className="text-sm text-gray-500">
                {selectedAppointment.location}
              </p>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              className="mr-4 rounded-lg bg-gray-cancel px-4 py-2 text-sm font-bold text-white hover:bg-gray-cancel-hover hover:text-black"
              onClick={closeModal}
            >
              No, cancel
            </button>
            <button
              className="rounded-lg bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-hover hover:text-red"
              onClick={handleCancel}
            >
              Yes, I&apos;m sure
            </button>
          </div>
        </div>
      </ReactModal>

      {/* Second Modal */}
      <ReactModal
        isOpen={reasonModalIsOpen}
        onRequestClose={closeReasonModal}
        contentLabel="Cancellation Reason"
        className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4"
        ariaHideApp={false}
      >
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Confirmation</h2>
          <p className="mb-4">
            To confirm, type your reason why you cancel this appointment
          </p>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-2"
            rows={4}
            placeholder="Type your reason here..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
          <div className="mt-6 flex justify-end">
            <button
              className="mr-4 rounded-lg bg-gray-cancel px-4 py-2 text-sm font-bold text-white hover:bg-gray-cancel-hover hover:text-black"
              onClick={closeReasonModal}
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-red px-4 py-2 text-sm font-bold text-white hover:bg-red-hover hover:text-red"
              onClick={handleFinalCancel}
            >
              Cancel this appointment
            </button>
          </div>
        </div>
      </ReactModal>
    </DefaultLayout>
  );
};

export default Dashboard;
