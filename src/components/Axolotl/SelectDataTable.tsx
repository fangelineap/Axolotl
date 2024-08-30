import { IconChevronDown } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

interface CustomProps {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SelectDataTable: React.FC<CustomProps> = ({
  title,
  options,
  value,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(value || "");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  useEffect(() => {
    setSelectedOption(value);
    setIsOptionSelected(!!value);
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedOption(newValue);
    setIsOptionSelected(!!newValue);
    onChange(newValue);
  };

  return (
    <div className="mt-2 w-full rounded font-normal">
      <div className="relative flex w-full cursor-pointer rounded bg-white focus:border-primary active:border-primary dark:bg-dark-2">
        <select
          title={title}
          value={selectedOption}
          onChange={handleSelectChange}
          className={`relative z-10 w-full cursor-pointer appearance-none rounded border border-gray-1 p-2 text-sm font-normal focus:border-primary focus:outline-none active:border-primary dark:border-dark-3 dark:bg-dark-2 ${
            isOptionSelected
              ? "text-dark dark:text-white"
              : "text-dark-secondary"
          }`}
        >
          <option value="" className="bg-white text-black">
            All
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-white text-black">
              {option}
            </option>
          ))}
        </select>

        <IconChevronDown
          className="pointer-events-none absolute left-auto right-1 top-1/2 z-99 -translate-y-1/2"
          stroke={3}
          size={16}
          style={{ color: "#9CA3AF" }}
        />
      </div>
    </div>
  );
};

export default SelectDataTable;
