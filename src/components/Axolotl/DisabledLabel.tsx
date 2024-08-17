import React from "react";

interface DisabledLabelProps {
    label: string
    type: string
    placeholder : string
}

const DisabledLabel = ({ label, type, placeholder}: DisabledLabelProps) => {
  return (
    <div className="flex items-center justify-between gap-5 mb-3">
      <label className="font-medium text-dark dark:text-white">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        disabled
        className="w-[75%] rounded-[7px] border-[1.5px] border-stroke bg-white px-5 py-2 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark"
      />
    </div>
  );
};

export default DisabledLabel;
