import React from "react";

interface EditLabelProps {
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditLabel = ({
  label,
  type,
  placeholder,
  value,
  disabled = true,
  onChange,
}: EditLabelProps) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-5">
      <label className="font-medium text-dark dark:text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-[75%] rounded-[7px] border-[1.5px] border-gray-1 bg-white px-5 py-2 text-dark outline-none transition ${
          disabled
            ? "disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary"
            : "bg-white"
        } font-normal dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
      />
    </div>
  );
};

export default EditLabel;
