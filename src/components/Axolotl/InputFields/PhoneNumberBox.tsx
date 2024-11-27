"use client";

import React, { useState } from "react";

interface PhoneNumberBoxProps {
  value?: number | string;
  placeholder: string;
  name: string;
  required: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumberBox = ({
  value = "",
  onChange,
  placeholder,
  name,
  required
}: PhoneNumberBoxProps) => {
  const [internalValue, setInternalValue] = useState<string>(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    // Remove leading zeros
    if (value.startsWith("0") && value.length > 1) {
      value = value.slice(1);

      return; // Do not allow "0" as the first character
    }

    const isNumericOrEmpty = value === "" || !isNaN(Number(value));
    const isWithinMaxLength = value.length <= 13;

    if (!isNumericOrEmpty || !isWithinMaxLength) return;

    onChange ? onChange(e) : setInternalValue(value);
  };

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
          name={name}
          aria-label="Phone Number"
          type="text"
          placeholder={placeholder}
          value={onChange ? value : internalValue}
          onChange={handleInputChange}
          className="transitionbg-white w-full rounded-r-md border border-gray-1 bg-white px-2 py-2 font-normal text-dark outline-none focus:border-primary active:border-primary"
        />
      </div>
    </div>
  );
};

export default PhoneNumberBox;
