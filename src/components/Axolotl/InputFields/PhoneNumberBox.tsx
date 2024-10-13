import React from "react";

interface PhoneNumberBoxProps {
  disabled?: boolean;
  value?: number | string;
  placeholder: string;
  name?: string;
  required?: boolean;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumberBox = ({
  disabled = false,
  value = "",
  onChange,
  placeholder,
  name,
  required,
  id
}: PhoneNumberBoxProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    /* Validation */
    const isNumericOrEmpty = value === "" || !isNaN(Number(value));
    const isNotLeadingZero = !(value.length === 1 && value[0] === "0");
    const isWithinMaxLength = value.length <= 12;

    if (!isNumericOrEmpty || !isNotLeadingZero || !isWithinMaxLength) return;

    if (onChange) onChange(e);
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
          id={id}
          placeholder={placeholder}
          value={value === 0 ? "" : value?.toString()}
          onChange={handleInputChange}
          disabled={disabled}
          className={`w-full rounded-r-md border border-gray-1 bg-white px-2 py-2 font-normal text-dark outline-none transition ${
            disabled
              ? "disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary"
              : "bg-white"
          }`}
        />
      </div>
    </div>
  );
};

export default PhoneNumberBox;
