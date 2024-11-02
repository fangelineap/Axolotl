import { IconChevronDown } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

interface CustomProps {
  label: string;
  required: boolean;
  name: string;
  placeholder: string;
  content: Array<string>;
  horizontal?: boolean;
  value?: string;
}

const SelectDropdown: React.FC<CustomProps> = ({
  label,
  required,
  placeholder,
  name,
  content,
  horizontal = false,
  value
}: CustomProps) => {
  const [selectedOption, setSelectedOption] = useState<string>(value || "");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const options = content;

  useEffect(() => {
    if (value) {
      setSelectedOption(value);
      setIsOptionSelected(true);
    }
  }, [value]); // Sync with parent prop changes

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const getContent = () => {
    let res: any = [];
    options.forEach((str) => {
      res.push(
        <>
          <option value={str} className="bg-white text-black">
            {str}
          </option>
          ,
        </>
      );
    });

    return res;
  };

  return (
    <div
      className={`mb-3 flex w-full flex-col gap-2 ${horizontal ? "md:flex-row md:items-center md:justify-between md:gap-5" : null}`}
    >
      <label className="font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>

      <div
        className={`relative flex w-full cursor-pointer rounded-md bg-white focus:border-primary active:border-primary dark:bg-dark-2 ${horizontal ? "md:w-3/4" : null}`}
      >
        <select
          title={label}
          name={name}
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`relative z-10 w-full cursor-pointer appearance-none rounded-md border-[1.5px] border-gray-1 bg-transparent bg-white py-2 pl-3 pr-11.5 transition focus:border-primary focus-visible:outline-none active:border-primary dark:border-dark-3 dark:bg-dark-2 ${
            isOptionSelected
              ? "text-dark dark:text-white"
              : "text-dark-secondary"
          }`}
        >
          <option
            value=""
            disabled={true}
            hidden={true}
            className="text-dark-secondary"
          >
            {placeholder}
          </option>
          {getContent()}
        </select>

        <IconChevronDown
          className="pointer-events-none absolute left-auto right-5 top-1/2 z-99 -translate-y-1/2"
          style={{ color: "#9CA3AF" }}
        />
      </div>
    </div>
  );
};

export default SelectDropdown;
