import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MedecinePreparationProps {
  orderStatus: string;
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
  price: {
    total: string;
    delivery: string;
    totalCharge: string;
  };
}

const MedicinePreparation: React.FC<MedecinePreparationProps> = ({
  orderStatus,
  patientInfo,
  medicalDetails,
  serviceDetails,
  price,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isMdOrLarger, setIsMdOrLarger] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMedications, setSelectedMedications] = useState<
    { quantity: number; name: string; price: string }[]
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(
    parseInt(price.total.replace(/Rp\.\s/g, "").replace(/\./g, "")),
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(
    parseInt(price.delivery.replace(/Rp\.\s/g, "").replace(/\./g, "")),
  );
  const [totalCharge, setTotalCharge] = useState<number>(
    parseInt(price.totalCharge.replace(/Rp\.\s/g, "").replace(/\./g, "")),
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMedicine, setCurrentMedicine] = useState<{
    name: string;
    type: string;
    price: string;
  } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const [isAddNewMedicineModalOpen, setIsAddNewMedicineModalOpen] =
    useState<boolean>(false);
  const [newMedicine, setNewMedicine] = useState<{
    name: string;
    type: string;
    price: string;
    quantity: number;
  }>({
    name: "",
    type: "Branded",
    price: "",
    quantity: 1,
  });

  // Dummy data for the medication list
  const medicineList = [
    { name: "Propofol", type: "Branded", price: "10.000" },
    { name: "Profertil", type: "Branded", price: "15.000" },
    { name: "Pronicy", type: "Branded", price: "20.000" },
    { name: "Panadol", type: "Branded", price: "15.000" },
  ];

  const handleMedicineSelect = (medicine: {
    name: string;
    type: string;
    price: string;
  }) => {
    setCurrentMedicine(medicine);
    setIsModalOpen(true); // Open the modal when a medicine is selected
  };

  const handleAddMedicine = () => {
    if (currentMedicine) {
      setSelectedMedications((prev) => [
        ...prev,
        { quantity, name: currentMedicine.name, price: currentMedicine.price },
      ]);
      setTotalPrice(
        (prev) =>
          prev +
          parseInt(
            currentMedicine.price.replace(/Rp\.\s/g, "").replace(/\./g, ""),
          ) *
            quantity,
      );
      setIsModalOpen(false); // Close the modal after adding the medicine
      setSearchTerm(""); // Clear the search term
    }
  };

  const handleAddNewMedicine = () => {
    setIsAddNewMedicineModalOpen(true);
  };

  const resetFormNewMedicine = () => {
    setNewMedicine({ name: "", type: "Branded", price: "", quantity: 1 });
    setIsAddNewMedicineModalOpen(false);
  };

  const handleSaveNewMedicine = () => {
    if (!newMedicine.name || !newMedicine.price) {
      alert("Please fill out all fields.");
      return;
    }

    // Add the new medicine to the medicine list
    setSelectedMedications((prev) => [
      ...prev,
      {
        quantity: newMedicine.quantity,
        name: newMedicine.name,
        price: newMedicine.price,
      },
    ]);

    parseInt(newMedicine.price.replace(/Rp\.\s/g, "").replace(/\./g, "")) *
      newMedicine.quantity;
    // Close the modal and reset the new medicine form
    setIsAddNewMedicineModalOpen(false);
    setNewMedicine({ name: "", type: "Branded", price: "", quantity: 1 });
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const sum = selectedMedications.reduce((acc, med) => {
        const medPrice = parseInt(
          med.price.replace(/Rp\.\s/g, "").replace(/\./g, ""),
        );
        return acc + medPrice * med.quantity;
      }, 0);

      setTotalPrice(sum);
    };

    calculateTotalPrice();

    // Set delivery fee to 0 if no additional medicine is added
    if (selectedMedications.length === 0) {
      setDeliveryFee(0);
    } else {
      setDeliveryFee(
        parseInt(price.delivery.replace(/Rp\.\s/g, "").replace(/\./g, "")),
      );
    }
  }, [selectedMedications, price.delivery]);

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
        i === index ? { ...med, quantity: Math.max(med.quantity - 1, 1) } : med,
      ),
    );
  };

  const handleIncreaseQuantity = (index: number) => {
    setSelectedMedications((prev) =>
      prev.map((med, i) =>
        i === index ? { ...med, quantity: med.quantity + 1 } : med,
      ),
    );
  };

  const handleRemoveMedicine = (index: number) => {
    setSelectedMedications((prev) => prev.filter((_, i) => i !== index));
  };

  // Updated onDrop function with additional checks
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (file && file instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setErrorMessage(""); // Clear any previous error messages
      } else {
        toast.error("Error reading file. Please try again.");
      }
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    console.log("Rejected files:", fileRejections);
    fileRejections.forEach((file) => {
      if (file.errors.some((e) => e.code === "file-invalid-type")) {
        toast.warning(
          "File type not supported. Please upload a JPG or PNG file.",
          {
            position: "top-right",
          },
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  });

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
            <div className=" mt-2 flex flex-row ">
              <div className=" flex flex-col gap-y-1">
                <strong>Patient Name</strong>
                <strong>Address</strong>
                <strong>Phone Number</strong>
                <strong>Birthdate</strong>
              </div>
              <div className="ml-19 flex flex-col gap-y-1">
                <div>{patientInfo.name}</div>
                <div>{patientInfo.address}</div>
                <div>{patientInfo.phoneNumber}</div>
                <div>{patientInfo.birthdate}</div>
              </div>
            </div>
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
                <strong>Birthdate:</strong> {patientInfo.birthdate}
              </div>
            </div>
          )}
        </div>

        {/* Medical Concerns & Conjecture (Medical Details) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Medical Concerns & Conjecture</h2>
          <div className="mt-2 flex flex-col sm:flex-row">
            <div className="flex flex-col gap-y-1">
              <strong>Causes</strong>
              <strong>Main Concerns</strong>
              <strong>Current Medicine</strong>
              <strong>Symptoms</strong>
              <strong>Medical Descriptions</strong>
            </div>
            <div className="mt-2 flex flex-col gap-y-1 sm:ml-8 sm:mt-0">
              <div>{medicalDetails.causes}</div>
              <div>{medicalDetails.mainConcerns.join(", ")}</div>
              <div>{medicalDetails.currentMedicine.join(", ")}</div>
              <div>{medicalDetails.symptoms.join(", ")}</div>
            </div>
          </div>
          <div className="mt-2">{medicalDetails.medicalDescriptions}</div>

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
        <div>
          <h2 className="mb-4 text-xl font-bold">Additional Medications</h2>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full rounded border p-2"
              placeholder="Search for a medicine or add a new one"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute z-10 w-full rounded border bg-white shadow-lg">
                {medicineList
                  .filter((med) =>
                    med.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((med, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleMedicineSelect(med)}
                    >
                      {med.name} -{" "}
                      <span className="italic text-gray-500">{med.type}</span>
                    </div>
                  ))}
                <div
                  className="cursor-pointer p-2 text-blue-500 hover:bg-gray-100"
                  onClick={handleAddNewMedicine}
                >
                  Not in the list?{" "}
                  <span className="underline">Add a new Medicine</span>
                </div>
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-lg border border-primary">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-green-light text-white">
                  <th className="rounded-tl-lg p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Name</th>
                  <th className=" p-2 text-right">Price</th>
                  {selectedMedications.length > 0 && (
                    <th className="rounded-tr-lg p-2 text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedMedications.map((med, index) => (
                  <tr key={index}>
                    <td className="border-primary p-2 text-left">
                      <div className="flex items-center">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full border"
                          onClick={() => handleDecreaseQuantity(index)}
                        >
                          -
                        </button>
                        <span className="mx-4">{med.quantity}</span>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full border"
                          onClick={() => handleIncreaseQuantity(index)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="border-primary p-2">{med.name}</td>
                    <td className="border-primary p-2 text-right">
                      Rp. {med.price}
                    </td>
                    {selectedMedications.length > 0 && (
                      <td className="border-primary p-2 text-right">
                        <button onClick={() => handleRemoveMedicine(index)}>
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.6663 29.9991C11.3367 29.999 11.0146 29.9012 10.7405 29.7181C10.4665 29.5349 10.253 29.2746 10.1268 28.9701C10.0007 28.6656 9.96773 28.3306 10.032 28.0073C10.0963 27.6841 10.255 27.3871 10.488 27.154L27.1546 10.4874C27.469 10.1838 27.89 10.0158 28.327 10.0196C28.764 10.0234 29.182 10.1987 29.491 10.5077C29.8 10.8167 29.9753 11.2347 29.9791 11.6717C29.9829 12.1087 29.8149 12.5297 29.5113 12.8441L12.8446 29.5107C12.6901 29.6657 12.5064 29.7886 12.3042 29.8724C12.102 29.9563 11.8852 29.9993 11.6663 29.9991Z"
                              fill="#EE4D4D"
                            />
                            <path
                              d="M28.3334 29.9991C28.1145 29.9993 27.8977 29.9563 27.6955 29.8724C27.4933 29.7886 27.3096 29.6657 27.155 29.5107L10.4884 12.8441C10.1848 12.5297 10.0168 12.1087 10.0206 11.6717C10.0244 11.2347 10.1997 10.8167 10.5087 10.5077C10.8177 10.1987 11.2357 10.0234 11.6727 10.0196C12.1097 10.0158 12.5307 10.1838 12.845 10.4874L29.5117 27.154C29.7447 27.3871 29.9034 27.6841 29.9677 28.0073C30.0319 28.3306 29.9989 28.6656 29.8728 28.9701C29.7467 29.2746 29.5331 29.5349 29.2591 29.7181C28.9851 29.9012 28.6629 29.999 28.3334 29.9991Z"
                              fill="#EE4D4D"
                            />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Summary Rows */}
                <tr>
                  <td
                    colSpan={selectedMedications.length > 0 ? 3 : 2}
                    className="border-t border-primary p-2 text-left font-bold"
                  >
                    Total Price
                  </td>
                  <td className="border-t border-primary p-2 text-right">
                    Rp. {totalPrice.toLocaleString("id-ID")}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={selectedMedications.length > 0 ? 3 : 2}
                    className="border-primary p-2 text-left font-bold"
                  >
                    Delivery Fee
                  </td>
                  <td className="border-primary p-2 text-right">
                    Rp. {deliveryFee.toLocaleString("id-ID")}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={selectedMedications.length > 0 ? 3 : 2}
                    className="rounded-bl-lg border-primary p-2 text-left font-bold"
                  >
                    Total Charge
                  </td>
                  <td className="rounded-br-lg border-primary p-2 text-right font-bold text-black">
                    Rp.{totalCharge.toLocaleString("id-ID")}
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
          {errorMessage && (
            <p className="mb-2 text-center text-red-500">{errorMessage}</p>
          )}
          {uploadedImage ? (
            <div className="mt-4 inline-block rounded-lg border p-4">
              <Image
                src={uploadedImage}
                alt="Uploaded Proof of Service"
                className="mx-auto h-auto max-w-full rounded-lg"
                width={350}
                height={350}
              />
              <button
                className="mt-4 w-full rounded bg-gray-500 py-2 text-white"
                onClick={() => setUploadedImage(null)}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-kalbe-light bg-green-50 hover:bg-green-100"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 rounded-full bg-gray-100 p-2">
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 54 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25.875 35.0483V15.5858L20.6325 20.8283L19.0395 19.2127L27 11.25L34.9628 19.2127L33.3698 20.8305L28.125 15.5858V35.0483H25.875ZM14.886 42.75C13.8495 42.75 12.9847 42.4035 12.2917 41.7105C11.5987 41.0175 11.2515 40.152 11.25 39.114V33.6623H13.5V39.114C13.5 39.4605 13.644 39.7785 13.932 40.068C14.22 40.3575 14.5372 40.5015 14.8837 40.5H39.1163C39.4613 40.5 39.7785 40.356 40.068 40.068C40.3575 39.78 40.5015 39.462 40.5 39.114V33.6623H42.75V39.114C42.75 40.1505 42.4035 41.0153 41.7105 41.7083C41.0175 42.4013 40.152 42.7485 39.114 42.75H14.886Z"
                      fill="#1CBF90"
                    />
                  </svg>
                </div>
                <p className="text-black">Drop files here to upload</p>
                <p className="text-sm text-gray-400">JPG & PNG</p>
              </div>
            </div>
          )}
        </div>
        <button
          className="mt-4 w-full rounded bg-gray-500 py-2 font-bold text-white hover:bg-gray-700"
          onClick={() => alert("Order Finished!")}
        >
          Finish Order
        </button>
        <ToastContainer />
      </div>

      {/* Modal for Adding Medicine */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-xl font-bold text-green-600">
              Add Medicine
            </h2>
            <div className="mb-4">
              <h3 className="mb-2 font-bold text-green-500">
                Medicine Description
              </h3>
              <div className="mb-2">
                <label className="block text-sm font-medium">Product ID</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border p-2"
                  value="UPC-012345678910"
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border p-2"
                  value={currentMedicine?.name}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Type</label>
                <select
                  className="mt-1 block w-full rounded border p-2"
                  value={currentMedicine?.type}
                  disabled
                >
                  <option>Branded</option>
                </select>
              </div>
              <div className="mb-2 flex items-center">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Quantity</label>
                  <div className="mt-1 flex items-center">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                      onClick={() =>
                        setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                    >
                      -
                    </button>
                    <span className="mx-4">{quantity}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-1/2 pl-4">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border p-2"
                    value={currentMedicine?.price}
                    disabled
                  />
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
                className="rounded bg-green-500 px-4 py-2 text-white"
                onClick={handleAddMedicine}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Medicine */}
      {isAddNewMedicineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h2 className="mb-4 text-center text-xl font-bold text-green-600">
              Add New Medicine
            </h2>
            <div className="mb-4">
              <div className="mb-2">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border p-2"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Type</label>
                <select
                  className="mt-1 block w-full rounded border p-2"
                  value={newMedicine.type}
                  onChange={(e) =>
                    setNewMedicine({ ...newMedicine, type: e.target.value })
                  }
                >
                  <option value="Branded">Branded</option>
                  <option value="Generic">Generic</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Quantity</label>
                  <div className="mt-1 flex items-center">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                      onClick={() =>
                        setNewMedicine((prev) => ({
                          ...prev,
                          quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
                        }))
                      }
                    >
                      -
                    </button>
                    <span className="mx-4">{newMedicine.quantity}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                      onClick={() =>
                        setNewMedicine((prev) => ({
                          ...prev,
                          quantity: prev.quantity + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Periksa lagi bagian price masih ga bener buat show Rp.*/}
                <div className="w-1/2 pl-4">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border p-2"
                    placeholder="Rp. 0"
                    value={`${newMedicine.price}`}
                    onChange={(e) => {
                      // Remove non-numeric characters except for decimal point
                      const numericValue = e.target.value.replace(/[^\d]/g, "");
                      setNewMedicine((prev) => ({
                        ...prev,
                        price: numericValue,
                      }));
                    }}
                    onFocus={(e) => {
                      // Move cursor after "Rp. " when input is focused
                      e.target.setSelectionRange(4, 4);
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
                className="rounded bg-green-500 px-4 py-2 text-white"
                onClick={handleSaveNewMedicine}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinePreparation;
