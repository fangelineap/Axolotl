import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpiredDatePicker from "@/components/FormElements/DatePicker/ExpiredDatePicker";
import "flatpickr/dist/flatpickr.min.css";
import SelectGroupWithChange from "@/components/FormElements/SelectGroup/SelectGroupWithChange";
import InputGroupWithChange from "@/components/FormElements/InputGroup/InputWithChange";
import InputGroupWithCurrency from "@/components/FormElements/InputGroup/InputGroupWithCurrency";
import { FaSearch } from "react-icons/fa";
import {
  IconCircleMinus,
  IconCirclePlus,
  IconMessage,
  IconX
} from "@tabler/icons-react";
import { fetchMedicine } from "@/app/server-action/caregiver/action";

interface MedecinePreparationProps {
  orderStatus: string;
  caregiverInfo: {
    name: string;
    str: string;
    profile_photo_url: string;
  };
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
  medicineDetail?: {
    quantity: number;
    name: string;
    price: string;
  }[];
  price: {
    total: string;
    delivery: string;
    totalCharge: string;
  };
}

interface MedicineType {
  uuid: number;
  name: string;
  type: string;
  price: string;
  exp_date: string;
  medicine_photo: string;
}

const OrderDetail: React.FC<MedecinePreparationProps> = ({
  orderStatus,
  caregiverInfo,
  patientInfo,
  medicalDetails,
  medicineDetail,
  serviceDetails,
  price
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isMdOrLarger, setIsMdOrLarger] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [medicineList, setMedicineList] = useState<MedicineType[]>([]);
  const [filteredMedicineList, setFilteredMedicineList] = useState<
    MedicineType[]
  >([]);

  const [selectedMedications, setSelectedMedications] = useState<
    { quantity: number; name: string; price: string }[]
  >(medicineDetail ? medicineDetail : []);
  const [totalPrice, setTotalPrice] = useState<number>(parseInt(price.total));
  const [deliveryFee, setDeliveryFee] = useState<number>(
    parseInt(price.delivery)
  );
  const [totalCharge, setTotalCharge] = useState<number>(
    parseInt(price.totalCharge)
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMedicine, setCurrentMedicine] = useState<MedicineType | null>(
    null
  );

  const [isAddNewMedicineModalOpen, setIsAddNewMedicineModalOpen] =
    useState<boolean>(false);

  const [newMedicine, setNewMedicine] = useState<{
    name: string;
    type: string;
    price: string;
    quantity: number;
    expired: string | null;
  }>({
    name: "",
    type: "Branded",
    price: "",
    quantity: 1,
    expired: null
  });

  console.log("selectedMedications", selectedMedications);
  useEffect(() => {
    // Fetch medicine data from the database
    // const loadMedicineList = async () => {
    //   try {
    //     const medicines: MedicineType[] = await fetchMedicine(); // Fetch data from your database
    //     setMedicineList(medicines || []); // Set the medicine list with fetched data
    //     setFilteredMedicineList(medicines || []); // Initialize filtered list with full data
    //   } catch (err) {
    //     console.error("Failed to load medicines", err);
    //   }
    // };

    // loadMedicineList();
    const medPrice = selectedMedications.reduce((acc, med) => {
      acc += parseInt(med.price) * med.quantity;
      return acc;
    }, 0);

    console.log("all meds price", medPrice);
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

  const handleMedicineSelect = (medicine: MedicineType) => {
    console.log("Selected Medicine UUID:", medicine.uuid);
    setCurrentMedicine(medicine);
    setIsModalOpen(true); // Open the modal when a medicine is selected
  };

  const handleAddMedicine = () => {
    if (currentMedicine) {
      setSelectedMedications((prev) => [
        ...prev,
        {
          quantity: 1,
          name: currentMedicine.name,
          price: currentMedicine.price || "0"
        }
      ]);

      const priceAsString = currentMedicine.price
        ? currentMedicine.price.toString()
        : "0";

      const cleanedPrice = parseInt(
        priceAsString.replace(/Rp\.\s/g, "").replace(/\./g, "")
      );

      setTotalPrice((prev) => prev + (isNaN(cleanedPrice) ? 0 : cleanedPrice));
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
      price: "",
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

    // Add the new medicine to the medicine list
    setSelectedMedications((prev) => [
      ...prev,
      {
        quantity: newMedicine.quantity,
        name: newMedicine.name,
        price: newMedicine.price
      }
    ]);

    parseInt(newMedicine.price.replace(/Rp\.\s/g, "").replace(/\./g, "")) *
      newMedicine.quantity;
    // Close the modal and reset the new medicine form
    setIsAddNewMedicineModalOpen(false);
    setNewMedicine({
      name: "",
      type: "Branded",
      price: "",
      quantity: 1,
      expired: null
    });
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const sum = selectedMedications.reduce((acc, med) => {
        // Ensure med.price is treated as a string and handle null/undefined cases
        const priceAsString = med.price ? med.price.toString() : "0";

        // Safely perform replace operations
        const medPrice = parseInt(
          priceAsString.replace(/Rp\.\s/g, "").replace(/\./g, ""),
          10 // Ensure base 10 parsing
        );

        return acc + (isNaN(medPrice) ? 0 : medPrice * med.quantity); // Handle NaN cases
      }, 0);

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
            position: "top-right"
          }
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/jpeg": [],
      "image/png": []
    },
    maxFiles: 1
  });

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
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold">Caregiver Information</h2>
          <div className="my-5 flex">
            <Image
              src={
                caregiverInfo.profile_photo_url || "/images/user/caregiver.png"
              }
              height={100}
              width={100}
              className="h-[100px] w-[100px] rounded-full bg-kalbe-veryLight object-cover"
              alt="CG pfp"
            />
          </div>
          <div>
            {isMdOrLarger ? (
              <div className=" mt-2 flex flex-row ">
                <div className=" flex flex-col gap-y-1">
                  <strong>Caregiver Name</strong>
                  <strong>STR Number</strong>
                </div>
                <div className="ml-19 flex flex-col gap-y-1">
                  <div>{caregiverInfo.name}</div>
                  <div>{caregiverInfo.str}</div>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-y-2">
                <div>
                  <strong>Caregiver Name:</strong> {caregiverInfo.name}
                </div>
                <div>
                  <strong>STR Number:</strong> {caregiverInfo.str}
                </div>
              </div>
            )}
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
        {/* <div>
          <h2 className="mb-4 text-xl font-bold">Additional Medications</h2>
          <div className="overflow-hidden rounded-lg border border-primary">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className=" bg-green-light text-white">
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedMedications.map((med, index) => (
                  <tr key={index}>
                    <td className="border-primary p-2 text-left">
                      <div className="flex w-1/2 justify-between p-2 text-primary">
                        <h1 className="text-lg text-black">{med.quantity}</h1>
                      </div>
                    </td>
                    <td className="border-primary p-2">{med.name}</td>
                    <td className="border-primary p-2 text-right">
                      Rp. {med.price}
                    </td>
                  </tr>
                ))}
                {/* Summary Rows */}
        {/* <tr>
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
        </div> */}
      </div>

      {/* Right Side */}
      {/* Evidence Upload */}
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <button
          className="disabled pointer-events-none mb-4 w-full rounded border border-dark-secondary bg-dark-secondary py-2 text-lg font-bold text-white"
          onClick={() => alert("Order Finished!")}
        >
          Additional Medicine
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded border border-primary py-2 text-lg font-bold text-primary hover:bg-kalbe-ultraLight hover:text-primary"
          onClick={() => alert("Order Finished!")}
        >
          <IconMessage size={25} />
          Chat With Caregiver
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default OrderDetail;
