"use client";

import { addAdminMedicine } from "@/app/(pages)/admin/manage/medicine/actions";
import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import {
  removeUploadedFileFromStorage,
  prepareFileBeforeUpload
} from "@/app/_server-action/storage";
import AxolotlButton from "@/components/Axolotl/Buttons/AxolotlButton";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import CustomDatePicker from "@/components/Axolotl/InputFields/CustomDatePicker";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import PriceBox from "@/components/Axolotl/InputFields/PriceBox";
import SelectDropdown from "@/components/Axolotl/SelectDropdown";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { AdminMedicineValidation } from "./Validation/AdminMedicineValidation";

function AddMedicine() {
  /**
   * * States & Initial Variables
   */
  const router = useRouter();
  const [medicinePhoto, setMedicinePhoto] = useState<string | File | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<AdminMedicineTable>({
    uuid: "",
    name: "",
    type: "",
    price: 0,
    exp_date: new Date()
  });

  /**
   * * Date Formatter
   */
  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(formData.exp_date));

  /**
   * * Handle Input Change
   * @param e
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  /**
   * * Handling File Change
   * @param e
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setMedicinePhoto(selectedFile);
    }
  };

  /**
   * * Handle Drop Event
   * @param e
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        setMedicinePhoto(selectedFile);
      } else {
        toast.warning("Invalid file type. Only JPG and PNG are allowed.", {
          position: "bottom-right"
        });
      }
    }
  };

  /**
   * * Handle Drag Over & Leave Event
   * @param e
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  /**
   * * Handle File Upload
   * @param medicinePhoto
   * @returns
   */
  const handleFileUpload = async (medicinePhoto: File) => {
    try {
      const fileName = await prepareFileBeforeUpload("medicine", medicinePhoto);

      if (!fileName) return undefined;

      return fileName;
    } catch (error) {
      toast.error("Error uploading file: " + error, {
        position: "bottom-right"
      });

      return undefined;
    }
  };

  /**
   * * Save Medicine
   * @param form
   * @returns
   */
  const saveMedicine = async (form: FormData) => {
    if (AdminMedicineValidation(form, medicinePhoto) === false) return;

    const pathMedicine = await handleFileUpload(medicinePhoto as File);

    if (pathMedicine?.length === 0 && pathMedicine === undefined) {
      toast.error("Something went wrong. Please try again", {
        position: "bottom-right"
      });

      return;
    }

    // Update the medicine in the database
    const medicineData: AdminMedicineTable = {
      uuid: "",
      name: form.get("name")!.toString(),
      type: form.get("type")!.toString(),
      price: parseFloat(form.get("price")!.toString()),
      exp_date: new Date(form.get("exp_date")!.toString()),
      medicine_photo: pathMedicine as string
    };

    const uploadMedicine = await addAdminMedicine(medicineData);

    if (!uploadMedicine) {
      await removeUploadedFileFromStorage("medicine", pathMedicine as string);

      toast.error("Failed to save medicine. Uploaded photo has been deleted.", {
        position: "bottom-right"
      });

      return;
    }

    toast.success("A new medicine has been added successfully.", {
      position: "bottom-right"
    });

    setTimeout(() => {
      router.refresh();
      router.replace(`/admin/manage/medicine/`);
      router.refresh();
    }, 250);
  };

  return (
    <>
      <ToastContainer />
      <form action={saveMedicine}>
        {/* Title */}
        <h1 className="mb-5 text-heading-1 font-bold">Add Medicine</h1>
        {/* Container */}
        <div className="flex flex-col justify-between lg:flex-row">
          {/* Left Side */}
          <div className="w-[100%] lg:mr-11 lg:w-[65%]">
            <div className="mb-4 flex flex-col gap-2">
              <h1 className="text-lg font-semibold">Product Photo</h1>
              <div
                id="FileUpload"
                className={`relative flex h-auto min-h-65 w-full cursor-pointer appearance-none items-center justify-center rounded-lg border border-primary px-4 py-8 ${medicinePhoto ? "bg-white" : "bg-kalbe-ultraLight"} ${isDragging ? "border-4 border-dashed" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  aria-label="Upload Photo"
                  type="file"
                  name="medicinePhoto"
                  id="medicinePhoto"
                  accept="image/png, image/jpg, image/jpeg"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  onChange={handleFileChange}
                />
                {medicinePhoto ? (
                  <Image
                    src={URL.createObjectURL(medicinePhoto as Blob)}
                    alt="Medicine Photo"
                    className="max-h-[25%] max-w-[90%] rounded-xl border border-primary object-contain"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    {isDragging ? (
                      <h1 className="text-lg font-medium">Release to upload</h1>
                    ) : (
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray p-2">
                          <IconUpload size={32} className="mb-2 text-primary" />
                        </div>
                        <h1 className="font-medium">
                          Drop files here to upload
                        </h1>
                        <p className="text-dark-secondary">JPG & PNG</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <DisabledCustomInputGroup
                label="Product ID"
                value="This will be auto-generated"
                type="text"
                horizontal
              />
              <CustomInputGroup
                name="name"
                label="Name"
                placeholder="Medicine Name"
                type="text"
                onChange={handleInputChange}
                required={true}
                horizontal
              />
              <SelectDropdown
                content={["Generic", "Branded"]}
                name="type"
                placeholder="Select Medicine Type"
                horizontal={true}
                label="Type"
                required={true}
              />
              <CustomDatePicker
                name="exp_date"
                label="Exp. Date"
                placeholder={formatDate}
                required={true}
                horizontal
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-[100%] lg:w-[35%]">
            <div className="flex flex-col rounded-lg border border-gray-1 bg-white p-5">
              <div className="mb-5 flex items-center justify-center text-primary">
                <h1 className="text-center text-heading-4 font-bold">
                  Pricing
                </h1>
              </div>
              <div className="flex flex-col gap-5">
                <PriceBox
                  name="price"
                  placeholder="Enter price"
                  value={
                    typeof formData.price === "number" ? formData.price : ""
                  }
                  disabled={false}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setFormData({
                      ...formData,
                      price: inputValue === "" ? 0 : parseFloat(inputValue)
                    });
                  }}
                  required={true}
                />
                <Link href={"/admin/manage/medicine"}>
                  <AxolotlButton
                    label="Cancel"
                    fontThickness="bold"
                    variant="dangerOutlined"
                    customClasses="text-lg"
                    roundType="regular"
                  />
                </Link>
                <AxolotlButton
                  isSubmit
                  label="Add Medicine"
                  fontThickness="bold"
                  variant="primary"
                  customClasses="text-lg"
                  roundType="regular"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddMedicine;
