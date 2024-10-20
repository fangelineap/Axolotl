import { createClient } from "@/lib/client";
import { CAREGIVER_LICENSES_TYPE } from "@/types/AxolotlMainType";
import { toast } from "react-toastify";
import { uuidv7 } from "uuidv7";

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
      return error as Error;
    }

    return true;
  } catch (error) {
    return error as Error;
  }
}

/**
 * * Helper function to upload a single file (CG License)
 * @param file
 * @param allowedTypes
 * @returns
 */
async function processUploadLicense(file: {
  key: string;
  fileValue: File | undefined;
  userValue: string;
  pathName: string;
  errorMsg: string;
}): Promise<string | null> {
  if (
    !file.fileValue ||
    (typeof file.userValue === "string" &&
      file.fileValue.name === file.userValue)
  ) {
    return file.userValue;
  }

  const fileName = await prepareFileBeforeUpload(
    file.key as CAREGIVER_LICENSES_TYPE,
    file.fileValue
  );

  if (!fileName) {
    toast.error(`Error uploading ${file.errorMsg}. Please try again`, {
      position: "bottom-right"
    });

    return null;
  }

  return fileName;
}

/**
 * * Function to upload multiple files (CG Licenses)
 * @param files
 * @param allowedTypes
 * @returns
 */
export async function uploadLicenses(
  files: Array<{
    key: string;
    fileValue: File | undefined;
    userValue: string;
    pathName: string;
    errorMsg: string;
  }>
): Promise<{ [key: string]: string | undefined } | null> {
  const paths: { [key: string]: string | undefined } = {};

  for (const file of files) {
    const path = await processUploadLicense(file);

    if (path === null) return null;

    paths[file.pathName] = path;
  }

  return paths;
}

/**
 * * Function to remove multiple files (CG Licenses)
 * @param files
 * @returns
 */
export async function removeLicenses(
  files: Array<{
    storage: string;
    fileValue: string | undefined;
  }>
): Promise<{ success: boolean }> {
  try {
    for (const file of files) {
      if (file.fileValue) {
        const response = await removeUploadedFileFromStorage(
          file.storage,
          file.fileValue
        );

        if (response instanceof Error) {
          console.error("Error while removing licenses:", response);

          return { success: false };
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error(
      "An unexpected error occurred while removing licenses:",
      error
    );

    return { success: false };
  }
}

/**
 * * Function to get public storage URL in server component
 * @param storage
 * @param path
 * @returns
 */
export async function getServerPublicStorageURL(storage: string, path: string) {
  const supabase = createClient();

  try {
    const { data } = supabase.storage.from(storage).getPublicUrl(path);

    if (!data) {
      console.error("Error fetching public storage URL");

      return null;
    }

    const publicURL = data.publicUrl;

    return publicURL;
  } catch (error) {
    console.error("An unexpected error occurred:", error);

    return null;
  }
}

/**
 * * Function to get public storage URL in client component
 * @param storage
 * @param path
 * @returns
 */
export function getClientPublicStorageURL(storage: string, path: string) {
  const loweredStorage = storage.toLowerCase();

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${loweredStorage}/${encodeURIComponent(path)}`;
}
