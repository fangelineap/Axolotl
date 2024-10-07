import React from "react";

interface DisabledPhoneNumberBoxProps {
  value?: number | string;
  placeholder: string;
  required?: boolean;
}

const DisabledPhoneNumberBox = ({
  value = "",
  placeholder,
  required
}: DisabledPhoneNumberBoxProps) => {
  return (
    <div className="mb-3 flex w-full flex-col gap-2">
      <label className="font-medium">
        Phone Number {required && <span className="ml-1 text-red">*</span>}
      </label>
      <div className="flex w-full items-center">
        <label className="rounded-l-md border border-r-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
          +62
        </label>
        <input
          aria-label="Phone Number"
          type="text"
          placeholder={placeholder}
          value={value === 0 ? "" : value?.toString()}
          disabled={true}
          className="w-full rounded-r-md border border-gray-1 bg-white px-2 py-2 font-normal text-dark outline-none transition disabled:cursor-default disabled:bg-gray
          disabled:text-dark-secondary"
        />
      </div>
    </div>
  );
};

export default DisabledPhoneNumberBox;
