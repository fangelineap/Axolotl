/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { updateAdminMedicineById } from "@/app/(pages)/admin/manage/medicine/actions";
import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import DisabledCustomInputGroup from "@/components/Axolotl/DisabledInputFields/DisabledCustomInputGroup";
import CustomInputGroup from "@/components/Axolotl/InputFields/CustomInputGroup";
import PriceBox from "@/components/Axolotl/InputFields/PriceBox";
import SelectDropdown from "@/components/Axolotl/SelectDropdown";
import CustomDatePicker from "@/components/FormElements/DatePicker/CustomDatePicker";
import { createBrowserClient } from "@supabase/ssr";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uuidv7 } from "uuidv7";
import { AdminMedicineValidation } from "./Validation/AdminMedicineValidation";

interface UpdateMedicineProps {
  medicine: AdminMedicineTable;
}

function UpdateMedicine({ medicine }: UpdateMedicineProps) {
  const router = useRouter();
  const [medicinePhoto, setMedicinePhoto] = useState<string | File | null>(
    medicine.medicine_photo ? medicine.medicine_photo : null
  );
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: medicine.name,
    type: medicine.type,
    price: medicine.price,
    exp_date: medicine.exp_date
  });

  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(formData.exp_date));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setMedicinePhoto(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/jpg"
      ) {
        setMedicinePhoto(selectedFile);
      } else {
        toast.warning("Invalid file type. Only JPG and PNG are allowed.", {
          position: "bottom-right"
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  async function uploadAdminToStorage(
    storage: string,
    fileName: string,
    file: string
  ) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userData, error } = await supabase.auth.getSession();

    if (userData.session?.user) {
      const { data, error } = await supabase.storage
        .from(storage)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        return undefined;
      }

      return data?.path;
    }
  }

  async function cancelUploadAdminToStorage(path: string) {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.storage
        .from("medicine")
        .remove([path]);

      if (error) {
        return error;
      }

      return true;
    } catch (error) {
      return error;
    }
  }

  const handleFileUpload = async (medicinePhoto: File) => {
    try {
      const name = uuidv7();
      const extension = medicinePhoto.name.split(".")[1];
      const fileName = `${name}_${Date.now()}.${extension}`;

      const path = await uploadAdminToStorage(
        "medicine",
        fileName,
        medicinePhoto as unknown as string
      );

      return fileName;
    } catch (error) {
      toast.error("Error uploading file: " + error, {
        position: "bottom-right"
      });

      return undefined;
    }
  };

  const saveUpdatedMedicine = async (form: FormData) => {
    if (AdminMedicineValidation(form, medicinePhoto) == false) return;

    let pathMedicine: string | undefined = undefined;

    if (medicinePhoto && typeof medicinePhoto !== "string") {
      // Only upload if medicinePhoto is a new file
      pathMedicine = await handleFileUpload(medicinePhoto as File);

      if (!pathMedicine) {
        toast.error("Something went wrong. Please try again", {
          position: "bottom-right"
        });

        return;
      }
    } else {
      pathMedicine = medicine.medicine_photo;
    }

    // Update the medicine in the database
    const updatedMedicine: AdminMedicineTable = {
      uuid: medicine.uuid,
      name: form.get("name")?.toString() || "",
      type: form.get("type")?.toString() || "",
      price: parseFloat(form.get("price")?.toString() || "0"),
      exp_date: new Date(form.get("exp_date")?.toString() || ""),
      medicine_photo: pathMedicine
    };

    const { data, error } = await updateAdminMedicineById(updatedMedicine);

    if (error !== null && error !== undefined) {
      await cancelUploadAdminToStorage(pathMedicine as string);

      toast.error("Failed to save medicine. Uploaded photo has been deleted.", {
        position: "bottom-right"
      });

      return;
    }

    toast.success("Medicine updated successfully.", {
      position: "bottom-right"
    });

    setTimeout(() => {
      window.location.href = `/admin/manage/medicine/${medicine.uuid}`;
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <form action={saveUpdatedMedicine}>
        {/* Title */}
        <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
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
                  typeof medicinePhoto === "string" ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medicine/${encodeURIComponent(medicine.medicine_photo ?? "")}`}
                      alt="Medicine Photo"
                      className="max-h-[25%] max-w-[80%] rounded-xl border border-primary object-contain"
                      width={200}
                      height={200}
                      layout="responsive"
                    />
                  ) : (
                    <Image
                      src={URL.createObjectURL(medicinePhoto)}
                      alt="Medicine Photo"
                      className="max-h-[25%] max-w-[90%] rounded-xl border border-primary object-contain"
                      width={200}
                      height={200}
                    />
                  )
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
                value={medicine.uuid}
                type="text"
                horizontal
              />
              <CustomInputGroup
                name="name"
                label="Name"
                placeholder="Medicine Name"
                value={formData.name}
                type="text"
                onChange={handleInputChange}
                required={true}
                horizontal
              />
              <SelectDropdown
                value={formData.type}
                name="type"
                placeholder="Select Type"
                horizontal={true}
                content={["Generic", "Branded"]}
                label="Type"
                required={true}
              />
              <CustomDatePicker
                name="exp_date"
                label="Exp. Date"
                placeholder={formatDate}
                required={true}
                horizontal={true}
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
                <Link href={`/admin/manage/medicine/${medicine.uuid}`}>
                  <button className="w-full rounded-[4px] border border-red py-2 text-lg font-semibold text-red hover:bg-red-hover">
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="w-full rounded-[4px] border border-primary bg-primary py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary"
                >
                  Update Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateMedicine;
