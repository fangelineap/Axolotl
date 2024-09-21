import React from "react";

interface SelectProps {
  label: string;
  placeholder: string;
  name:string
  required: boolean;
  customClass?: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
  isOptionSelected: boolean;
}
const SelectHorizontal = ({
  label,
  placeholder,
  name,
  required,
  options,
  selectedOption,
  setSelectedOption,
  isOptionSelected,
}: SelectProps) => {
  return (
    <div className="flex items-center justify-between gap-5 mb-3">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>
      <select
      name={name}
        value={selectedOption}
        onChange={(e) => {
          setSelectedOption(e.target.value);
        }}
        className={`relative z-20 w-[75%] appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${
          isOptionSelected ? "text-dark dark:text-white" : ""
        }`}
      >
        <option value="" disabled className="text-dark-6">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-dark-6">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectHorizontal;
