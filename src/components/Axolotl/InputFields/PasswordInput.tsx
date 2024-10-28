"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

const PasswordInput = ({
  name,
  label,
  placeholder,
  required
}: PasswordInputProps) => {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div className="relative w-full">
      <label className="mb-2 block font-medium text-dark dark:text-white">
        {label}
        <span className="ml-1 text-red">*</span>
      </label>
      <input
        name={name}
        type={visible ? "password" : "text"}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border-[1.5px] border-gray-1 bg-white px-3 py-2 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />
      <button
        type="button"
        className="absolute inset-0 left-auto right-5 top-8 flex cursor-pointer items-center"
        onClick={(e) => {
          e.preventDefault();
          setVisible(!visible);
        }}
      >
        {visible ? (
          <IconEyeOff stroke={0.75} className="text-dark-secondary" />
        ) : (
          <IconEye stroke={0.75} className="text-dark-secondary" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
