/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { addAdminMedicine } from "@/app/(pages)/admin/manage/medicine/actions";
import { AdminMedicineTable } from "@/app/(pages)/admin/manage/medicine/table/data";
import EditLabel from "@/components/Axolotl/EditLabel";
import PriceBox from "@/components/Axolotl/PriceBox";
import SelectMedicineTypes from "@/components/Axolotl/SelectMedicineTypes";
import CustomDatePicker from "@/components/FormElements/DatePicker/CustomDatePicker";
import { createBrowserClient } from "@supabase/ssr";
import { IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { uuidv7 } from "uuidv7";

function AddMedicine() {
  const router = useRouter();
  const [medicinePhoto, setMedicinePhoto] = useState<string | File | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<AdminMedicineTable>({
    name: "",
    type: "",
    price: 0,
    exp_date: new Date().toISOString(),
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
    if (
      !medicinePhoto &&
      !form.get("name") &&
      !form.get("type") &&
      !form.get("price") &&
      !form.get("exp_date")
    ) {
      toast.error("Please insert a valid data.", {
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
    if (!form.get("name")) {
      toast.warning("Please enter the medicine name.", {
        position: "bottom-right",
      });
      return false;
    }
    if (!form.get("type")) {
      toast.warning("Please enter the medicine type.", {
        position: "bottom-right",
      });
      return false;
    }
    if (!form.get("exp_date")) {
      toast.warning("Please select the expiry date.", {
        position: "bottom-right",
      });
      return false;
    }
    if (new Date(form.get("exp_date")?.toString() || "") <= new Date()) {
      toast.warning("The expiry date cannot be in the past or today.", {
        position: "bottom-right",
      });
      return false;
    }
    if (
      !form.get("price") ||
      isNaN(parseFloat(form.get("price")?.toString() || "0"))
    ) {
      toast.warning("Please enter a valid price.", {
        position: "bottom-right",
      });
      return false;
    }
    if ((form.get("price")?.toString().length ?? 0) <= 2) {
      toast.warning(
        "Bro, this isn't a thrift store 🤡. Add some digits before we go broke 💸",
        {
          position: "bottom-right",
        },
      );
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
          position: "bottom-right",
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
    file: string,
  ) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: userData, error } = await supabase.auth.getSession();

    if (userData.session?.user) {
      const { data, error } = await supabase.storage
        .from(storage)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file. Please try again.");
        return undefined;
      }

      return data?.path;
    }
  }

  async function cancelUploadAdminToStorage(path: string) {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        medicinePhoto as unknown as string,
      );

      return fileName;
    } catch (error) {
      toast.error("Error uploading file. Please try again.", {
        position: "bottom-right",
      });
      return;
    }
  };

  const saveMedicine = async (form: FormData) => {
    if (validateForm(form) == false) return;

    const pathMedicine = await handleFileUpload(medicinePhoto as File);

    if (pathMedicine?.length === 0 && pathMedicine === undefined) {
      toast.error("Something went wrong. Please try again", {
        position: "bottom-right",
      });
      return;
    }

    // Update the medicine in the database
    const medicineData = {
      name: form.get("name")?.toString() || "",
      type: form.get("type")?.toString() || "",
      price: parseFloat(form.get("price")?.toString() || "0"),
      exp_date: new Date(
        form.get("exp_date")?.toString() || "",
      ).toLocaleString(),
      medicine_photo: pathMedicine as string,
    };

    const { data, error } = await addAdminMedicine(medicineData);

    if (error !== null && error !== undefined) {
      await cancelUploadAdminToStorage(pathMedicine as string);

      toast.error("Failed to save medicine. Uploaded photo has been deleted.", {
        position: "bottom-right",
      });

      return;
    }

    toast.success("A new medicine has been added successfully.", {
      position: "bottom-right",
    });

    setTimeout(() => {
      router.refresh();
      router.replace(`/admin/manage/medicine/`);
      router.refresh();
    }, 1500);
  };

  return (
    <div className="mx-20 h-auto w-auto">
      <ToastContainer />
      {/* Title */}
      <form action={saveMedicine}>
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
              <EditLabel
                name="uuid"
                label="Product ID"
                value="This will be auto-generated"
                type="text"
                disabled={true}
              />
              <EditLabel
                name="name"
                label="Name"
                placeholder="Medicine Name"
                type="text"
                onChange={handleInputChange}
                required={true}
              />
              <SelectMedicineTypes name="type" label="Type" required={true} />
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
                  onClick={() => router.replace("/admin/manage/medicine")}
                  className="w-full rounded-[4px] border border-red py-2 text-lg font-semibold text-red hover:bg-red-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-[4px] border border-primary bg-primary py-2 text-lg font-semibold text-white hover:bg-kalbe-ultraLight hover:text-primary"
                >
                  Add Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddMedicine;
