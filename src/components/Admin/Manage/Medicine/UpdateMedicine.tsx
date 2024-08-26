"use client";

import { updateAdminMedicineById } from "@/app/(pages)/admin/manage/medicine/actions";
import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import EditLabel from "@/components/Axolotl/EditLabel";
import PriceBox from "@/components/Axolotl/PriceBox";
import CustomDatePicker from "@/components/FormElements/DatePicker/CustomDatePicker";
import { createBrowserClient } from "@supabase/ssr";
import { IconUpload } from "@tabler/icons-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UpdateMedicineProps {
  medicine: AdminMedicineTable;
}

function UpdateMedicine({ medicine }: UpdateMedicineProps) {
  const router = useRouter();
  const [medicinePhoto, setMedicinePhoto] = useState<string | File | null>(
    medicine.medicine_photo ? medicine.medicine_photo : null,
  );

  // TODO: Add form validation
  const [formData, setFormData] = useState({
    name: medicine.name,
    type: medicine.type,
    price: medicine.price,
    exp_date: medicine.exp_date,
  });

  const formatDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(formData.exp_date));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (form: FormData) => {
    if (!formData.name) {
      toast.warning("Please enter the medicine name.", {
        position: "bottom-right",
      });
      return false;
    }
    if (!formData.type) {
      toast.warning("Please enter the medicine type.", {
        position: "bottom-right",
      });
      return false;
    }
    if (
      formData.price === null ||
      formData.price === undefined ||
      isNaN(formData.price)
    ) {
      toast.warning("Please enter a valid price.", {
        position: "bottom-right",
      });
      return false;
    }
    if (
      form.get("exp_date")?.toString() == "" ||
      form.get("exp_date") == null
    ) {
      toast.warning("Please select the expiry date.", {
        position: "bottom-right",
      });
      return false;
    }
    if (!medicinePhoto) {
      toast.warning("Please upload a photo.", {
        position: "bottom-right",
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setMedicinePhoto(selectedFile);
    }
  };

  async function uploadToStorage(
    storage: string,
    fileName: string,
    file: string,
  ) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: userData, error } = await supabase.auth.getSession();

    console.log("userData", userData);

    if (userData.session?.user) {
      const { data, error } = await supabase.storage
        .from(storage)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        return undefined;
      }

      console.log(`Data path for ${storage}: `, data?.path);
      return data?.path;
    }
  }

  const handleFileUpload = async (medicinePhoto: File) => {
    try {
      const [name, extension] = medicinePhoto.name.split(".");
      const fileName = `${name}_${Date.now()}.${extension}`;

      const path = await uploadToStorage(
        "medicine",
        fileName,
        medicinePhoto as unknown as string,
      );

      console.log("Uploaded file path:", path);

      if (!path) {
        throw new Error("Failed to upload file.");
      }

      return fileName;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file: " + error, {
        position: "bottom-right",
      });
      return undefined;
    }
  };

  const saveUpdatedMedicine = async (form: FormData) => {
    if (validateForm(form) == false) return;

    console.log(medicinePhoto as String);
    const pathMedicine = await handleFileUpload(medicinePhoto as File);

    console.log(pathMedicine);

    if (pathMedicine?.length == 0) return;

    // Update the medicine in the database
    const updatedMedicine = {
      uuid: medicine.uuid,
      name: form.get("name")?.toString() || "",
      type: form.get("type")?.toString() || "",
      price: parseFloat(form.get("price")?.toString() || "0"),
      exp_date: new Date(
        form.get("exp_date")?.toString() || "",
      ).toLocaleString(),
      medicine_photo: pathMedicine,
    };

    const { data, error } = await updateAdminMedicineById(updatedMedicine);

    if (error) {
      toast.error("Failed to update medicine details.", {
        position: "bottom-right",
      });
    } else {
      toast.success("Medicine details updated successfully.", {
        position: "bottom-right",
      });

      router.refresh();
      router.replace(`/admin/manage/medicine/${medicine.uuid}`);
    }
  };

  return (
    <div className="mx-20 h-auto w-auto">
      <ToastContainer />
      {/* Title */}
      <form action={saveUpdatedMedicine}>
        <h1 className="mb-5 text-heading-1 font-bold">Medicine Details</h1>
        {/* Container */}
        <div className="flex flex-col justify-between lg:flex-row">
          {/* Left Side */}
          <div className="w-[100%] lg:mr-11 lg:w-[65%]">
            <div className="mb-4 flex flex-col gap-2">
              <h1 className="text-lg font-semibold">Product Photo</h1>
              <div
                id="FileUpload"
                className="relative flex h-auto min-h-65 w-full cursor-pointer appearance-none items-center justify-center rounded-lg border border-primary bg-kalbe-ultraLight px-4 py-8"
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
                      className="max-w-[80%] rounded-xl border border-primary"
                      width={200}
                      height={200}
                      layout="responsive"
                    />
                  ) : (
                    <Image
                      src={URL.createObjectURL(medicinePhoto)}
                      alt="Medicine Photo"
                      className="w-[90%] rounded-xl border border-primary"
                      width={200}
                      height={200}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray p-2">
                      <IconUpload size={32} className="mb-2 text-primary" />
                    </div>
                    <h1 className="font-medium">Drop files here to upload</h1>
                    <p className="text-dark-secondary">JPG & PNG</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <EditLabel
                name="uuid"
                label="Product ID"
                value={medicine.uuid}
                type="text"
                disabled={true}
              />
              <EditLabel
                name="name"
                label="Name"
                value={formData.name}
                type="text"
                onChange={handleInputChange}
                required={true}
              />
              <EditLabel
                name="type"
                label="Type"
                value={formData.type}
                type="text"
                onChange={handleInputChange}
                required={true}
              />
              <CustomDatePicker
                name="exp_date"
                label="Exp. Date"
                placeholder={formatDate}
                required={true}
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
                        price: inputValue === "" ? 0 : parseFloat(inputValue),
                      });
                    }}
                    required={true}
                  />
                <button
                  onClick={() => router.back()}
                  className="w-full rounded-[4px] border border-red py-2 text-lg font-semibold text-red hover:bg-red-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-[4px] bg-primary py-2 text-lg font-semibold text-white hover:bg-kalbe-veryLight hover:text-primary"
                >
                  Update Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateMedicine;
