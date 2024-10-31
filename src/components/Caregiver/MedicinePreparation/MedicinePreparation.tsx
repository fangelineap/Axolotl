"use client";
import { getGlobalAllMedicine } from "@/app/_server-action/global";
import { getClientPublicStorageURL } from "@/app/_server-action/storage/client";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import CustomDivider from "@/components/Axolotl/CustomDivider";
import FileInput from "@/components/Axolotl/InputFields/FileInput";
import ExpiredDatePicker from "@/components/FormElements/DatePicker/ExpiredDatePicker";
import InputGroupWithCurrency from "@/components/FormElements/InputGroup/InputGroupWithCurrency";
import InputGroupWithChange from "@/components/FormElements/InputGroup/InputWithChange";
import SelectGroupWithChange from "@/components/FormElements/SelectGroup/SelectGroupWithChange";
import { MEDICINE } from "@/types/AxolotlMainType";
import { IconCircleMinus, IconCirclePlus, IconX } from "@tabler/icons-react";
import "flatpickr/dist/flatpickr.min.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MedecinePreparationProps {
  orderStatus: string;
  patientInfo: {
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
  orderStatus,
  patientInfo,
  medicalDetails,
  serviceDetails,
  price
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
    { quantity: number; name: string; price: number }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(price.total);
  const [totalCharge, setTotalCharge] = useState<number>(price.totalCharge);

  const deliveryFee = 10000;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMedicine, setCurrentMedicine] = useState<MEDICINE | null>(null);

  const medicinePhoto = getClientPublicStorageURL(
    "medicine",
    currentMedicine?.medicine_photo as string
  );

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
              quantity: 1,
              name: currentMedicine.name,
              price: currentMedicine.price || 0
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

  const handleSaveNewMedicine = () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.expired) {
      toast.warning("Please fill out all fields.", {
        position: "top-right"
      });

      return;
    }

    const medicinePrice = parseInt(
      newMedicine.price.toString().replace(/\./g, "")
    );

    // Add the new medicine to the medicine list
    setSelectedMedications((prev) => [
      ...prev,
      {
        quantity: newMedicine.quantity,
        name: newMedicine.name,
        price: isNaN(medicinePrice) ? 0 : medicinePrice
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

  const handleFinishOrder = async () => {
    console.log("Order finished");
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
                orderStatus === "Done"
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
              label=""
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
        <ToastContainer />
      </div>

      {/* Modal for Adding Medicine */}
      {isModalOpen && currentMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="mx-auto w-full max-w-xs overflow-y-auto rounded-lg 
            bg-white sm:h-auto sm:max-w-sm md:h-auto md:max-w-md lg:h-auto lg:max-w-md
            xl:h-auto xl:max-w-xl"
          >
            <div className="rounded-t-lg bg-primary px-6 py-4">
              <h2 className="text-center text-xl font-bold text-white">
                Add Medicine
              </h2>
            </div>
            <div className=" overflow-y-auto p-6  ">
              {/* Medicine Photo Section */}
              <div className="mb-6">
                <h3 className="mb-2 font-bold text-primary">Medicine Photo</h3>
                <div className="flex h-48 w-full items-center justify-center rounded-lg border border-primary p-4">
                  {currentMedicine.medicine_photo ? (
                    <div className="relative flex h-full w-full items-center justify-center">
                      <Image
                        src={medicinePhoto}
                        alt={currentMedicine.medicine_photo}
                        className="object-contain" // Make image contain within the container
                        layout="fill" // Fills the container
                      />
                    </div>
                  ) : (
                    <p>No Image Available</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 font-bold text-primary">
                  Medicine Description
                </h3>
                <div className="mb-4">
                  <label className="mb-4 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border p-2"
                    value={currentMedicine.name}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-4 block text-sm font-medium">Type</label>
                  <input
                    className="mt-1 block w-full rounded border p-2"
                    value={currentMedicine.type}
                    disabled
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <div className="w-1/2">
                    <label className="mb-4 block text-sm font-medium">
                      Expired Date
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="text"
                        className="mt-1 block w-full rounded border p-2"
                        value={new Date(
                          currentMedicine.exp_date
                        ).toDateString()}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mt-1 w-1/2 pl-4 ">
                    <label className="mb-4 block text-sm font-medium">
                      Price
                    </label>
                    <div className="relative mt-1 flex items-center">
                      <span className="absolute left-3 text-gray-500">Rp.</span>

                      <input
                        type="text"
                        className="block w-full rounded border p-2 pl-10"
                        value={currentMedicine.price}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-primary px-4 py-2 text-white"
                  onClick={handleAddMedicine}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Medicine */}
      {isAddNewMedicineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white">
            <div className="rounded-t-lg bg-primary px-6 py-4">
              <h2 className="text-center text-lg font-bold text-white">
                Add New Medicine
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="mb-2">
                  <InputGroupWithChange
                    customClasses="mb-4"
                    label="Name"
                    type="text"
                    placeholder="Enter medicine name"
                    required={true}
                    name="medicineName"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <SelectGroupWithChange
                    name="Brand"
                    label="Type"
                    content={["Branded", "Generic"]}
                    customClasses="w-full"
                    required
                    onChange={(value) =>
                      setNewMedicine({ ...newMedicine, type: value })
                    }
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <div className="w-1/2">
                    <ExpiredDatePicker
                      customClasses="mb-3"
                      label="Expired Date"
                      required={true}
                      name="expiredDate"
                      expired={newMedicine.expired ? newMedicine.expired : ""}
                      onChange={(date) =>
                        setNewMedicine({ ...newMedicine, expired: date })
                      }
                    />
                  </div>
                  <div className="mt-3 w-1/2 pl-4">
                    <InputGroupWithCurrency
                      customClasses="mb-6.5"
                      label="Price"
                      type="text"
                      placeholder="Enter medicine price"
                      required={true}
                      name="medicinePrice"
                      value={
                        newMedicine.price
                          ? newMedicine.price.toLocaleString("id-ID")
                          : ""
                      }
                      onChange={(e) => {
                        const price = parseInt(
                          e.target.value.replace(/\./g, "")
                        );
                        setNewMedicine({
                          ...newMedicine,
                          price: isNaN(price) ? 0 : price
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                  onClick={() => {
                    resetFormNewMedicine(); // Reset the form fields
                    setIsAddNewMedicineModalOpen(false); // Close the modal
                  }}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-primary px-4 py-2 text-white"
                  onClick={handleSaveNewMedicine}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinePreparation;
