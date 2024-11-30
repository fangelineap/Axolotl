"use client";
import {
  cancelAppointment,
  fetchOngoingOrders
} from "@/app/_server-action/caregiver";
import CustomBreadcrumbs from "@/components/Axolotl/Breadcrumbs/CustomBreadcrumbs";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import AxolotlModal from "@/components/Axolotl/Modal/AxolotlModal";
import AxolotlRejectionModal from "@/components/Axolotl/Modal/AxolotlRejectionModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ORDER } from "@/types/AxolotlMainType";
import { CAREGIVER_SCHEDULE_ORDER } from "@/types/AxolotlMultipleTypes";
import { Skeleton } from "@mui/material";
import { IconClock, IconMapPin, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const [orders, setOrders] = useState<{
    [key: string]: CAREGIVER_SCHEDULE_ORDER[];
  }>({});
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [openCancelNoteModal, setOpenCancelNoteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const router = useRouter();

  const [orderId, setOrderId] = useState<ORDER["id"]>("");

  const groupOrdersByDate = (orders: CAREGIVER_SCHEDULE_ORDER[]) => {
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
      {} as { [key: string]: CAREGIVER_SCHEDULE_ORDER[] }
    );
  };

  const handleFilter = (data: CAREGIVER_SCHEDULE_ORDER[]) => {
    // Filter orders that are today or in the future
    const filteredOrders = data.filter((order) => {
      const appointmentDate = new Date(
        order.appointment?.appointment_date
      ).setHours(0, 0, 0, 0);
      const todayDate = new Date().setHours(0, 0, 0, 0);

      return appointmentDate >= todayDate;
    });

    // Group the filtered orders by date
    const groupedOrders = groupOrdersByDate(filteredOrders);

    // Update the state with the grouped orders
    setOrders(groupedOrders);
  };

  // Fetch orders from the backend
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);

        // Fetch data from the backend
        const data = await fetchOngoingOrders();

        if (data) {
          // Call handleFilter with the fetched data
          handleFilter(data);
        } else {
          // Handle the case where data is undefined or null
          setOrders({});
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle error state if necessary
      } finally {
        setLoading(false);
        setIsCanceled(false);
      }
    };

    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCanceled]);

  const openFirstModal = (appointment: any) => {
    setOrderId(appointment.id);
    setSelectedAppointment(appointment);
    setOpenCancelModal(true);
  };

  const closeFirstModal = () => {
    setOrderId("");
    setOpenCancelModal(false);
    setSelectedAppointment(null);
  };

  const openSecondModal = () => {
    setOpenCancelModal(false);
    setOpenCancelNoteModal(true);
  };

  const closeSecondModal = () => {
    setOrderId("");
    setOpenCancelNoteModal(false);
    setOpenCancelModal(false);
  };

  const handleCancel = async (notes: string) => {
    try {
      const cancel = await cancelAppointment(orderId, notes);

      if (!cancel) {
        toast.error("Failed to perform the action. Please try again.", {
          position: "bottom-right"
        });

        return;
      }

      setIsCanceled(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to perform the action. Please try again.", {
        position: "bottom-right"
      });
    } finally {
      toast.success("Appointment canceled successfully", {
        position: "bottom-right"
      });

      closeSecondModal();

      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  const handleMedicinePreparation = (orderId: string) => {
    router.push(`/caregiver/order/${orderId}/prepare/${orderId}`);
  };

  return (
    <DefaultLayout>
      <CustomBreadcrumbs pageName="Schedule" />
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
          <div className="ml-3 mr-3 mt-4 rounded-lg border border-gray-dark p-4 text-center">
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
                  className="ml-3 mr-3 mt-4 rounded-lg border border-gray-dark p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between">
                    <div className="mt-1 h-5 border-l-4 border-l-green-500 pl-1" />
                    <div className=" flex-1 lg:mb-0">
                      <h3 className="text-lg font-bold">
                        {order.appointment.service_type}
                      </h3>
                      <p className="text-dark-seconday text-sm">
                        {order.appointment.main_concern}
                      </p>
                      <div className="mb-2 mt-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <IconUserCircle
                            className="text-dark-secondary "
                            stroke={1}
                          />
                          <span className="ml-2">
                            {order.patient.users?.first_name}{" "}
                            {order.patient.users?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <IconClock
                            className="text-dark-secondary "
                            stroke={1}
                          />
                          <span className="ml-2">
                            {order.appointment?.appointment_time}
                          </span>
                        </div>
                        <div className=" flex items-center">
                          <IconMapPin
                            className="text-dark-secondary "
                            stroke={1}
                          />
                          <span className="ml-2">
                            {order.patient.users?.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:p-2 lg:mb-0 lg:flex-row lg:items-center lg:space-x-4">
                      <div className="h-full border-l border-gray-dark" />
                      <div className="flex flex-col gap-2">
                        <AxolotlButton
                          label="Cancel Appointment"
                          variant="secondary"
                          onClick={() => openFirstModal(order)}
                          fontThickness="bold"
                          roundType="regular"
                        />

                        <AxolotlButton
                          label="Medicine Preparation"
                          variant="primary"
                          onClick={() => handleMedicinePreparation(order.id)}
                          fontThickness="bold"
                          roundType="regular"
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
        from="appointment"
      />
    </DefaultLayout>
  );
};

export default Dashboard;
