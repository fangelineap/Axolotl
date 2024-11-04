import { IconFileInvoice, IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface FileInputProps {
  onFileSelect: (file: File | null) => void;
  name: string;
  label: string;
  accept?: string[];
  isDropzone?: boolean;
  existingFile?: string | null;
  required?: boolean;
}

function FileInput({
  onFileSelect,
  name,
  label = "Upload File",
  accept = ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
  isDropzone = false,
  existingFile = null,
  required = false
}: FileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const acceptString = accept.join(", ");

  useEffect(() => {
    console.log("FileInput component rendered");
  }, []);

  const fileType: { [key: string]: string } = {
    "image/jpeg": "JPEG",
    "image/jpg": "JPG",
    "image/png": "PNG",
    "application/pdf": "PDF"
  };

  const allowedType = accept.map((type) => fileType[type] || type).join(", ");

  /**
   * * Validate File Type
   */
  const isValidFileType = (file: File) => accept.includes(file.type);

  /**
   * * Handling File Change
   * @param e
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      toast.warning(`Invalid file type. Allowed types: ${allowedType}`, {
        position: "bottom-right"
      });
      onFileSelect(null);
    }
  };

  /**
   * * Handle Drop Event
   * @param e
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      toast.warning(`Invalid file type. Allowed types: ${allowedType}`, {
        position: "bottom-right"
      });
      onFileSelect(null);
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

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-3 flex flex-col gap-2">
      <label className="font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>
      {isDropzone ? (
        <div
          className={`relative flex h-auto min-h-60 w-full cursor-pointer items-center justify-center rounded-lg border border-primary px-4 py-8 ${
            selectedFile || existingFile ? "bg-white" : "bg-kalbe-ultraLight"
          } ${isDragging ? "border-4 border-dashed" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={inputRef}
            accept={acceptString}
            className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
            onChange={handleFileChange}
            name={name}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          {selectedFile?.type.startsWith("image/") ? (
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded File"
              className="max-h-[25%] max-w-[90%] rounded-xl border border-primary object-contain"
              width={200}
              height={200}
            />
          ) : selectedFile?.type.startsWith("application/") ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <IconFileInvoice size={90} stroke={1} className="text-primary" />
              <p>{selectedFile.name}</p>
            </div>
          ) : existingFile ? (
            <Image
              src={existingFile}
              alt="Uploaded File"
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
                  <h1 className="font-medium">Drop files here to upload</h1>
                  <p className="text-dark-secondary">Allowed: {allowedType}</p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <input
          type="file"
          ref={inputRef}
          accept={acceptString}
          className="w-full cursor-pointer rounded-md border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-gray file:px-3 file:py-2 file:text-body-sm file:font-medium file:text-dark-secondary file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary"
          onChange={handleFileChange}
          name={name}
        />
      )}
    </div>
  );
}

export default FileInput;
