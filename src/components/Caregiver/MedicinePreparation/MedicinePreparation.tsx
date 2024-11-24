"use client";
import {
  finishOrder,
  insertMedicineOrder,
  insertMedicineOrderDetail,
  insertNewMedicine,
  updateOrderWithMedicineOrderId
} from "@/app/_server-action/caregiver";
import { getGlobalAllMedicine } from "@/app/_server-action/global";
import {
  getClientPublicStorageURL,
  prepareFileBeforeUpload
} from "@/app/_server-action/global/storage/client";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import FileInput from "@/components/Axolotl/InputFields/FileInput";
import MedicineModal from "@/components/Axolotl/Modal/AxolotlAddMedicine";
import { MEDICINE } from "@/types/AxolotlMainType";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconMessage,
  IconX
} from "@tabler/icons-react";
import "flatpickr/dist/flatpickr.min.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MedecinePreparationProps {
  orderId: string;
  orderStatus: string;
  patientInfo: {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    birthdate: Date;
  };
  medicalDetails: {
    causes: string;
    mainConcerns: string;
    currentMedicine: string;
    symptoms: string[];
    medicalDescriptions: string;
    conjectures: string;
  };
  serviceDetails: {
    orderId: string;
    orderDate: string;
    serviceType: string;
    totalDays: number;
    startTime: string;
    endTime: string;
    serviceFee: number;
    totalCharge: number;
  };
  price: {
    total: number;
    delivery: number;
    totalCharge: number;
  };
  rate: number | null;
}

function renderFields(fieldName: string[], fieldValue: string[]) {
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-start gap-7 sm:flex-row">
      <div className="flex w-40 flex-col gap-y-1">
        {fieldName.map((field, index) => (
          <strong key={index}>{field}</strong>
        ))}
      </div>
      <div className="mt-2 flex flex-1 flex-col gap-y-1 sm:mt-0">
        {fieldValue.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </div>
    </div>
  );
}

const MedicinePreparation: React.FC<MedecinePreparationProps> = ({
  orderId,
  orderStatus,
  patientInfo,
  medicalDetails,
  serviceDetails,
  price,
  rate
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | File | null>(
    null
  );
  const [isMdOrLarger, setIsMdOrLarger] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [medicineList, setMedicineList] = useState<MEDICINE[]>([]);
  const [filteredMedicineList, setFilteredMedicineList] = useState<MEDICINE[]>(
    []
  );

  const [selectedMedications, setSelectedMedications] = useState<
    {
      id: string;
      quantity: number;
      total_price: number;
      name: string;
      price: number;
    }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(price.total);
  const [totalCharge, setTotalCharge] = useState<number>(price.totalCharge);

  const deliveryFee = 10000;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMedicine, setCurrentMedicine] = useState<MEDICINE | null>(null);

  const [isAddNewMedicineModalOpen, setIsAddNewMedicineModalOpen] =
    useState<boolean>(false);

  const [newMedicine, setNewMedicine] = useState<{
    name: string;
    type: string;
    price: number;
    quantity: number;
    expired: string | null;
  }>({
    name: "",
    type: "Branded",
    price: 0,
    quantity: 1,
    expired: null
  });

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });

  const formattedTotalPrice = currencyFormatter.format(totalPrice);
  const formattedTotalCharge = currencyFormatter.format(totalCharge);
  const formattedDeliveryFee = currencyFormatter.format(deliveryFee);

  const router = useRouter();

  const medicinePhoto = getClientPublicStorageURL(
    "medicine",
    currentMedicine?.medicine_photo as string
  );

  useEffect(() => {
    // Fetch medicine data from the database
    const loadMedicineList = async () => {
      try {
        const medicines: MEDICINE[] = await getGlobalAllMedicine(); // Fetch data from your database
        setMedicineList(medicines || []); // Set the medicine list with fetched data
        setFilteredMedicineList(medicines || []); // Initialize filtered list with full data
      } catch (err) {
        console.error("Failed to load medicines", err);
      }
    };

    loadMedicineList();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = medicineList.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicineList(filtered);
    } else {
      setFilteredMedicineList(medicineList);
    }
  }, [searchTerm, medicineList]);

  const handleMedicineSelect = (medicine: MEDICINE) => {
    console.log("Selected Medicine UUID:", medicine.uuid);
    setCurrentMedicine(medicine);
    setIsModalOpen(true); // Open the modal when a medicine is selected
  };

  const handleAddMedicine = () => {
    if (currentMedicine) {
      setSelectedMedications((prev) => {
        const existingMedicineIndex = prev.findIndex(
          (med) => med.name === currentMedicine.name
        );

        if (existingMedicineIndex !== -1) {
          // If the medicine already exists, update its quantity
          return prev.map((med, index) =>
            index === existingMedicineIndex
              ? { ...med, quantity: med.quantity + 1 }
              : med
          );
        } else {
          // If the medicine doesn't exist, add it to the list
          return [
            ...prev,
            {
              id: currentMedicine.uuid,
              quantity: 1,
              name: currentMedicine.name,
              price: currentMedicine.price || 0,
              total_price: currentMedicine.price
            }
          ];
        }
      });

      // Add the price of the selected medicine to the total price
      setTotalPrice((prev) => prev + currentMedicine.price);
      setIsModalOpen(false); // Close the modal after adding the medicine
      setSearchTerm(""); // Clear the search term
    }
  };

  const handleAddNewMedicine = () => {
    setIsAddNewMedicineModalOpen(true);
  };

  const resetFormNewMedicine = () => {
    setNewMedicine({
      name: "",
      type: "Branded",
      price: 0,
      quantity: 1,
      expired: null
    });
    setIsAddNewMedicineModalOpen(false);
  };

  const handleSaveNewMedicine = async () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.expired) {
      toast.warning("Please fill out all fields.", {
        position: "bottom-right"
      });

      return;
    }

    const medicinePrice = parseInt(
      newMedicine.price.toString().replace(/\./g, "")
    );

    // Insert the new medicine into the database
    const addNewMedicine = await insertNewMedicine(
      {
        uuid: "",
        name: newMedicine.name,
        type: newMedicine.type,
        price: isNaN(medicinePrice) ? 0 : medicinePrice,
        exp_date: new Date(newMedicine.expired)
      },
      orderId
    );

    if (!addNewMedicine) {
      toast.error("Failed to add new medicine.", {
        position: "bottom-right"
      });

      return;
    }

    // Add the newly created medicine with its ID to the selected medications
    setSelectedMedications((prev) => [
      ...prev,
      {
        id: addNewMedicine.uuid, // Use the ID returned from the database
        quantity: newMedicine.quantity,
        name: newMedicine.name,
        price: isNaN(medicinePrice) ? 0 : medicinePrice,
        total_price: isNaN(medicinePrice)
          ? 0
          : medicinePrice * newMedicine.quantity
      }
    ]);

    // Close the modal and reset the new medicine form
    setIsAddNewMedicineModalOpen(false);
    resetFormNewMedicine();
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const sum = selectedMedications.reduce(
        (acc, med) => acc + med.price * med.quantity,
        0
      );
      setTotalPrice(sum);
    };

    calculateTotalPrice();
  }, [selectedMedications]);

  useEffect(() => {
    setTotalCharge(totalPrice + deliveryFee);
  }, [totalPrice, deliveryFee]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)"); // Tailwind's 'md' size is 768px
    setIsMdOrLarger(mediaQuery.matches);

    const handleResize = () => setIsMdOrLarger(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleDecreaseQuantity = (index: number) => {
    setSelectedMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, quantity: Math.max(med.quantity - 1, 1) } : med
      )
    );
  };

  const handleIncreaseQuantity = (index: number) => {
    setSelectedMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, quantity: med.quantity + 1 } : med
      )
    );
  };

  const handleRemoveMedicine = (index: number) => {
    setSelectedMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const getImagePreview = () => {
    if (uploadedImage instanceof File) {
      return URL.createObjectURL(uploadedImage); // Generate a URL for previewing the image
    } else if (typeof uploadedImage === "string") {
      return uploadedImage; // Use the image URL if it's a string
    }

    return null;
  };

  /**
   * * Handle File Upload
   * @param medicinePhoto
   * @returns
   */
  const handleFileUpload = async (uploadImage: File) => {
    try {
      const fileName = await prepareFileBeforeUpload(
        "proof_of_service",
        uploadImage
      );

      if (!fileName) return undefined;

      return fileName;
    } catch (error) {
      toast.error("Error uploading file: " + error, {
        position: "bottom-right"
      });

      return undefined;
    }
  };

  const handleFinishOrder = async () => {
    if (rate === null) {
      toast.warning("Wait until the patient submit your rating.", {
        position: "bottom-right"
      });

      return;
    }

    if (!(uploadedImage instanceof File)) {
      toast.warning(
        "Please upload a proof of service image before finishing the order.",
        {
          position: "bottom-right"
        }
      );

      return;
    }

    try {
      let medicineOrderId;
      const hasAdditionalMedicine = selectedMedications.length > 0;

      if (hasAdditionalMedicine)
        if (selectedMedications.length > 0) {
          // If there are selected medications, insert them into the database
          // Calculate medicine order details
          const totalQuantity = selectedMedications.reduce(
            (sum, med) => sum + med.quantity,
            0
          );
          const subTotalMedicine = selectedMedications.reduce(
            (sum, med) => sum + med.price * med.quantity,
            0
          );
          const totalPrice = subTotalMedicine + deliveryFee;

          // Insert into the medicineOrder table
          const newMedicineOrder = await insertMedicineOrder({
            total_qty: totalQuantity,
            sub_total_medicine: subTotalMedicine,
            delivery_fee: deliveryFee,
            total_price: totalPrice,
            is_paid: "Unverified", // Set to true if payment has been completed
            paid_at: null // Set the date if payment is made
          });
          console.log("Inserted Medicine Order:", newMedicineOrder);
          console.log("ACHIVE NEW MEDICINE ORDER");

          // Check if newMedicineOrder and its ID are valid
          if (!newMedicineOrder || !newMedicineOrder.id) {
            toast.error(
              "Failed to insert medicine order. Response:",

              { position: "bottom-right" }
            );

            return;
          }

          medicineOrderId = newMedicineOrder.id;

          // Insert each medication into medicineOrderDetail
          await Promise.all(
            selectedMedications.map((med) =>
              insertMedicineOrderDetail({
                id: "",
                quantity: med.quantity,
                total_price: med.price * med.quantity,
                medicine_id: med.id, // Assuming each med has a unique ID
                medicine_order_id: medicineOrderId!,
                created_at: new Date(),
                updated_at: new Date()
              })
            )
          );
          console.log("ACHIVE INSERT NEW MEDICINE ORDER DETAIL");

          // Update the order with the new medicine_order_id
          const finalUpdate = await updateOrderWithMedicineOrderId(
            orderId,
            medicineOrderId
          );

          if (finalUpdate.length === 0) {
            toast.error("Failed to update order. Response:", {
              position: "bottom-right"
            });

            return;
          }

          toast.success("Order updated successfully", {
            position: "bottom-right"
          });
        }

      // Use the handleFileUpload function to upload the image
      const fileName = await handleFileUpload(uploadedImage);

      if (!fileName) {
        throw new Error("File upload failed.");
      }

      // Call finishOrder to update the database with the proof_of_service URL
      const result = await finishOrder(
        orderId,
        fileName,
        hasAdditionalMedicine
      ); // Pass orderId and URL to finishOrder function

      if (result.success) {
        toast.success(result.message, {
          position: "bottom-right"
        });
        // Optionally reset or navigate away as needed
        setUploadedImage(null); // Reset uploaded image after successful completion

        setTimeout(() => {
          router.refresh();
          router.push(`/caregiver/order/${orderId}`);
          router.refresh();
        }, 250);
      } else {
        throw new Error(result.message || "Failed to finish the order.");
      }
    } catch (error) {
      console.error("Error during proof of service upload:", error);
      toast.error("Failed to finish order. Please try again.", {
        position: "bottom-right"
      });
    }
  };

  const handleChatWithPatient = () => {
    console.log("Chat with Patient");
    router.push(`/chat`);
  };

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isModalOpen || isAddNewMedicineModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup when the component unmounts or modal is closed
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen, isAddNewMedicineModalOpen]);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between">
      {/* Left Side */}
      <div className="mb-6 flex-1 lg:mr-8">
        {/* Order Status */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Order Status</h2>
          <div className="mt-2 flex items-center">
            <p className="font-bold text-gray-600">Current Status</p>
            <span
              className={`ml-20 inline-block rounded-full px-5 py-1.5 text-xs font-bold text-white ${
                orderStatus === "Completed"
                  ? "bg-green-500"
                  : orderStatus === "Ongoing"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            >
              {orderStatus}
            </span>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Patient Information</h2>
          {isMdOrLarger ? (
            renderFields(
              ["Patient Name", "Address", "Phone Number", "Birthdate"],
              [
                patientInfo.name,
                patientInfo.address,
                patientInfo.phoneNumber,
                patientInfo.birthdate.toString()
              ]
            )
          ) : (
            <div className="mt-2 flex flex-col gap-y-2">
              <div>
                <strong>Patient Name:</strong> {patientInfo.name}
              </div>
              <div>
                <strong>Address:</strong> {patientInfo.address}
              </div>
              <div>
                <strong>Phone Number:</strong> {patientInfo.phoneNumber}
              </div>
              <div>
                <strong>Birthdate:</strong> {patientInfo.birthdate.toString()}
              </div>
            </div>
          )}
        </div>

        {/* Medical Concerns & Conjecture (Medical Details) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
          {renderFields(
            ["Causes", "Main Concerns", "Current Medicine", "Symptoms"],
            [
              medicalDetails.causes,
              medicalDetails.mainConcerns,
              medicalDetails.currentMedicine,
              medicalDetails.symptoms.join(", ")
            ]
          )}

          <div className="mt-2 flex flex-1 flex-col gap-y-1 font-bold">
            Medical Description
          </div>
          <div className="mt-2">{medicalDetails.medicalDescriptions}</div>

          <div className="mt-2">
            <div className="flex flex-col items-center justify-center text-center">
              <div className=" w-full rounded-t-md border border-primary bg-green-light py-2 text-white">
                <p className="font-bold">Conjecture</p>
              </div>
              <div className="w-full rounded-b-md border border-primary py-2 font-bold text-primary">
                <p>{medicalDetails.conjectures}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Service Details</h2>
          {renderFields(
            ["Order ID", "Order Date"],
            [
              serviceDetails.orderId,
              new Date(serviceDetails.orderDate).toLocaleString()
            ]
          )}

          {/* Divider */}
          <CustomDivider horizontal color="black" />

          {renderFields(
            [
              "Service Type",
              "Total Days of Visit",
              "Start Date/Time",
              "End Date/Time"
            ],
            [
              serviceDetails.serviceType,
              String(serviceDetails.totalDays),
              serviceDetails.startTime,
              serviceDetails.endTime
            ]
          )}
        </div>

        {/* Additional Medications */}
        <div>
          <h2 className="text-xl font-bold">Additional Medications</h2>
          <div className="relative mb-4 flex w-full justify-end">
            <div className="flex items-center">
              <input
                type="text"
                className="w-full rounded-l-md border p-2 focus:border-primary focus:outline-none"
                placeholder="Search for a medicine"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="flex h-full items-center justify-center rounded-r-md bg-primary px-4 py-2 text-white">
                <FaSearch size={17} />
              </button>
            </div>
            {searchTerm && (
              <div className="absolute z-10 mt-11 w-full max-w-md rounded border bg-white shadow-lg">
                {filteredMedicineList.map((medicine) => (
                  <div
                    key={medicine.uuid}
                    className="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100"
                    onClick={() => handleMedicineSelect(medicine)}
                  >
                    <span className="text-gray-500">{medicine.name}</span>
                    <span className="italic text-gray-500">
                      {medicine.type}
                    </span>
                  </div>
                ))}
                <div
                  className="cursor-pointer p-2 text-gray-500 hover:bg-gray-100"
                  onClick={handleAddNewMedicine}
                >
                  Not in the list?{" "}
                  <span className="text-primary underline">
                    Add a new Medicine
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-lg border border-primary">
            <table className=" w-full table-auto">
              <thead>
                <tr className="bg-green-light text-white">
                  <th className="px-5 py-2 text-left font-bold">Quantity</th>
                  <th className="px-5 py-2 text-left font-bold">Name</th>
                  <th className="px-5 py-2 text-right font-bold">Price</th>
                  {selectedMedications.length > 0 && (
                    <th className="rounded-tr-lg p-2 text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedMedications.map((med, index) => (
                  <tr key={index}>
                    <td className="border-primary px-2 py-2 text-left">
                      <div className="flex w-1/2 justify-between gap-3 p-2 text-primary">
                        <button onClick={() => handleDecreaseQuantity(index)}>
                          <IconCircleMinus size={25} />
                        </button>
                        <h1 className="text-lg text-black">{med.quantity}</h1>
                        <button onClick={() => handleIncreaseQuantity(index)}>
                          <IconCirclePlus size={25} />
                        </button>
                      </div>
                    </td>
                    <td className="border-primary px-5 py-2">{med.name}</td>
                    <td className="border-primary px-5 py-2 text-right">
                      {currencyFormatter.format(med.price)}
                    </td>
                    {selectedMedications.length > 0 && (
                      <td className="border-primary px-5 py-2 text-right">
                        <button onClick={() => handleRemoveMedicine(index)}>
                          <div className="flex items-center justify-center text-red">
                            <IconX size={30} />
                          </div>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Summary Rows */}
                <tr>
                  <td
                    colSpan={selectedMedications.length > 0 ? 3 : 2}
                    className="border-t border-primary py-2 pl-5 text-left font-bold "
                  >
                    Total Price
                  </td>
                  <td className="border-t border-primary py-2 pr-5 text-right">
                    {formattedTotalPrice}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={selectedMedications.length > 0 ? 3 : 2}
                    className="border-primary py-2 pl-5 text-left font-bold"
                  >
                    Delivery Fee
                  </td>
                  <td className="border-primary py-2 pr-5 text-right">
                    {formattedDeliveryFee}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={selectedMedications.length > 0 ? 3 : 2}
                    className="rounded-bl-lg border-primary py-2 pl-5 text-left font-bold"
                  >
                    Total Charge
                  </td>
                  <td className="rounded-br-lg border-primary py-2 pr-5 text-right font-bold text-black">
                    {formattedTotalCharge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side */}
      {/* Evidence Upload */}
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="rounded-xl border p-4">
          <h2 className="mb-4 text-center text-xl font-extrabold text-primary">
            Evidence
          </h2>
          <p className="text-md mb-4 text-left font-extrabold">
            Proof of Service
          </p>
          {uploadedImage ? (
            <div className="mt-4 flex flex-col gap-3 rounded-lg border p-4">
              <Image
                src={getImagePreview()!}
                alt="Uploaded Proof of Service"
                className="mx-auto h-auto max-w-full rounded-lg"
                width={350}
                height={350}
              />
              <button
                className="w-full rounded-[4px] border border-yellow-dark py-2  font-semibold text-yellow-dark hover:bg-yellow-light"
                onClick={() => setUploadedImage(null)}
              >
                Change Image
              </button>
            </div>
          ) : (
            <FileInput
              onFileSelect={(file) => setUploadedImage(file)}
              name="service_proof"
              label="Upload Proof of Service Photo"
              accept={["image/jpg", "image/jpeg", "image/png"]}
              isDropzone={true} // To use the dropzone style
            />
          )}
        </div>

        <AxolotlButton
          label="Finish Order"
          variant="primary"
          isSubmit={true}
          customClasses="mt-4"
          fontThickness="bold"
          onClick={handleFinishOrder}
        />

        <AxolotlButton
          label="Chat with patient"
          variant="primaryOutlined"
          isSubmit={false}
          customClasses="mt-4"
          startIcon={<IconMessage size={25} />}
          onClick={handleChatWithPatient}
        />
        <ToastContainer />
      </div>

      {/* Modal for Adding Medicine */}
      {isModalOpen && currentMedicine && (
        <MedicineModal
          mode="addExisting"
          isOpen={isModalOpen ? true : false}
          currentMedicine={currentMedicine}
          medicinePhoto={medicinePhoto}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddMedicine}
        />
      )}

      {/* Modal for Adding New Medicine */}
      {isAddNewMedicineModalOpen && (
        <MedicineModal
          mode="addNew"
          isOpen={true}
          newMedicine={newMedicine}
          setNewMedicine={(updates) =>
            setNewMedicine((prev) => ({ ...prev, ...updates }))
          }
          onClose={resetFormNewMedicine}
          onSave={handleSaveNewMedicine}
        />
      )}
    </div>
  );
};

export default MedicinePreparation;
