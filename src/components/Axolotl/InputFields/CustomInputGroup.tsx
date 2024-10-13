import React from "react";

interface CustomInputGroupProps {
  label: string;
  type: string;
  name: string;
  horizontal: boolean;
  placeholder: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;

  // Additional Props
  isUnit?: boolean;
  unit?: string;
}

const CustomInputGroup = ({
  label,
  type,
  name,
  horizontal = false,
  placeholder,
  required,
  onChange,
  value,
  isUnit = false,
  unit
}: CustomInputGroupProps) => {
  if (isUnit) {
    return (
      <div
        className={`mb-3 flex w-full flex-col gap-2 ${horizontal ? "md:flex-row md:items-center md:justify-between md:gap-5" : null}`}
      >
        <label className="font-medium text-dark dark:text-white">
          {label} {required && <span className="ml-1 text-red">*</span>}
        </label>
        <div className="flex w-full items-center">
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${horizontal ? "md:w-3/4" : null} w-full rounded-md border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition
          focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
          />
          <label className="rounded-r-md border border-l-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
            {unit}
          </label>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-3 flex w-full flex-col gap-2 ${horizontal ? "md:flex-row md:items-center md:justify-between md:gap-5" : null}`}
    >
      <label className="font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${horizontal ? "md:w-3/4" : null} w-full rounded-md border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition 
        focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
      />
    </div>
  );
};

export default CustomInputGroup;
