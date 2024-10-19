"use client";
import { fetchOngoingOrders } from "@/app/_server-action/caregiver";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import AxolotlRejectionModal from "@/components/Axolotl/Modal/AxolotlRejectionModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [openCancelNoteModal, setOpenCancelNoteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
      setLoading(true);
      const data = await fetchOngoingOrders();
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
      setLoading(false);
    };

    getOrders();
  }, []);

  const openFirstModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setOpenCancelModal(true);
  };

  const closeFirstModal = () => {
    setOpenCancelModal(false);
    setSelectedAppointment(null);
  };

  const openSecondModal = () => {
    setOpenCancelModal(false);
    setOpenCancelNoteModal(true);
  };

  const closeSecondModal = () => setOpenCancelNoteModal(false);

  const handleCancel = () => openSecondModal();

  const handleSeeMore = (order: any) => {
    router.push(`/caregiver/order/${order.id}`);
  };

  return (
    <DefaultLayout>
      <nav className="mb-2 text-sm text-gray-600">Dashboard / Schedule</nav>
      <h1 className="text-5xl font-bold">Schedule</h1>
      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <Skeleton
            variant="rectangular"
            width="100%"
            animation="wave"
            height={45}
            className="rounded-lg"
          />
          <Skeleton
            variant="rectangular"
            width="98%"
            animation="wave"
            height={150}
            className="rounded-lg"
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            animation="wave"
            height={45}
            className="rounded-lg"
          />
          <Skeleton
            variant="rectangular"
            width="98%"
            animation="wave"
            height={150}
            className="rounded-lg"
          />
        </div>
      )}
      <div className={`${loading ? "hidden" : ""}`}>
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
                    ? "rounded-lg border-0 bg-kalbe-ultraLight py-2 pl-5 text-kalbe-light"
                    : "rounded-lg border-0 bg-gray py-2 pl-5 text-gray-800"
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
                  className="ml-3 mr-3 mt-4 rounded-lg border border-gray-1 p-4"
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
                      <AxolotlButton
                        label="See more"
                        variant="primaryOutlined"
                        onClick={() => handleSeeMore(order)}
                        customWidth
                        customClasses="w-fit"
                        fontThickness="bold"
                      />

                      <CustomDivider color="gray-1" />
                      {/* <div className="hidden lg:block lg:h-20 lg:border-l lg:border-gray-400"></div> */}

                      <div className="flex flex-col gap-2">
                        <AxolotlButton
                          label="Cancel Appointment"
                          variant="secondary"
                          onClick={() => openFirstModal(order)}
                          fontThickness="bold"
                        />

                        <AxolotlButton
                          label="Medicine Preparation"
                          variant="primary"
                          fontThickness="bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* First Modal */}

      <AxolotlModal
        isOpen={openCancelModal}
        onClose={closeFirstModal}
        onConfirm={openSecondModal}
        title="Cancel Appointment"
        question="Are you sure you want to cancel this appointment?"
        action="cancel appointment"
        order={selectedAppointment}
      />

      <AxolotlRejectionModal
        isOpen={openCancelNoteModal}
        onClose={closeSecondModal}
        onReject={handleCancel}
      />

      {/* <ReactModal
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
      </ReactModal> */}

      {/* Second Modal */}
      {/* <ReactModal
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
      </ReactModal> */}
    </DefaultLayout>
  );
};

export default Dashboard;
