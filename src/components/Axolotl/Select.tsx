import React, { useState, useEffect } from "react";

interface SelectProps {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  customClass: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
}

const Select = ({
  label,
  name,
  placeholder,
  required,
  customClass,
  options,
  selectedOption,
  setSelectedOption
}: SelectProps) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  useEffect(() => {
    setIsOptionSelected(selectedOption !== "");
  }, [selectedOption]);

  return (
    <div className={customClass}>
      <label className="mb-3 block font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>
      <select
        name={name}
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
        }}
        className={`relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-3 py-2 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${
          isOptionSelected ? "text-black" : "text-dark-secondary"
        }`}
      >
        <option value="" disabled className="text-dark-secondary">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
