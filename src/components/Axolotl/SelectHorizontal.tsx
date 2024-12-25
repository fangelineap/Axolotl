import React, { useEffect, useState } from "react";

interface SelectProps {
  label: string;
  placeholder: string;
  name: string;
  required: boolean;
  customClass?: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
}
const SelectHorizontal = ({
  label,
  placeholder,
  name,
  required,
  options,
  selectedOption,
  setSelectedOption,
  customClass
}: SelectProps) => {
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  useEffect(() => {
    setIsOptionSelected(selectedOption !== "");
  }, [selectedOption]);

  return (
    <div className="mb-3 flex items-center justify-between gap-5">
      <label className="block font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>
      <select
        name={name}
        value={selectedOption}
        onChange={(e) => {
          e.preventDefault();
          setSelectedOption(e.target.value);
        }}
        className={`${customClass} relative z-20 w-3/4 appearance-none rounded-[7px] border border-stroke bg-transparent px-3 py-2 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${
          isOptionSelected ? "text-dark dark:text-white" : ""
        }`}
      >
        <option value="" disabled className="text-dark-secondary">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-dark">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectHorizontal;
