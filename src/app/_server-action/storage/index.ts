// utils/fileUploadUtils.ts

import { createClient } from "@/lib/client";
import { uuidv7 } from "uuidv7";
import { toast } from "react-toastify";

/**
 * * Upload a file to Supabase storage.
 * @param storage
 * @param fileName
 * @param file
 * @returns
 */
export async function uploadFileToStorage(
  storage: string,
  fileName: string,
  file: File
): Promise<string | undefined> {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getSession();

  if (userData.session?.user) {
    const { data, error } = await supabase.storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      console.error("Error uploading file:", error.message);

      return undefined;
    }

    return data.path;
  }
}

/**
 * * Prepare a file before uploading to Supabase storage.
 * This function will generates filename and uploads the file
 * @param storage
 * @param file
 * @returns
 */
export async function prepareFileBeforeUpload(
  storage: string,
  file: File
): Promise<string | undefined> {
  try {
    const name = uuidv7();
    const extension = file.name.split(".").pop();
    const fileName = `${name}_${Date.now()}.${extension}`;

    const path = await uploadFileToStorage(storage, fileName, file);

    if (!path) {
      throw new Error("Failed to upload file");
    }

    return fileName;
  } catch (error) {
    toast.error("Error uploading file: " + error, {
      position: "bottom-right"
    });

    return undefined;
  }
}

/**
 * * Remove an uploaded file from Supabase storage.
 * @param storage
 * @param path
 * @returns
 */
export async function removeUploadedFileFromStorage(
  storage: string,
  path: string
): Promise<boolean | Error> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(storage).remove([path]);

    if (error) {
      return error;
    }

    return true;
  } catch (error) {
    return error as Error;
  }
}
