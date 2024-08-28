import { IconChevronDown } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

interface CustomProps {
  label: string;
  required: boolean;
  name: string;
  value?: string;
}

const SelectMedicineTypes: React.FC<CustomProps> = ({
  label,
  required,
  name,
  value,
}: CustomProps) => {
  const [selectedOption, setSelectedOption] = useState<string>(value || "");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const content = ["Generic", "Branded"];

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
    content.forEach((str) => {
      res.push(
        <>
          <option value={str} className="bg-white text-black">
            {str}
          </option>
          ,
        </>,
      );
    });

    return res;
  };

  return (
    <div className="mb-3 flex items-center justify-between gap-5">
      <label className="font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>

      <div className="relative flex w-[75%] cursor-pointer rounded-[7px] bg-white focus:border-primary active:border-primary dark:bg-dark-2">
        <select
          title={label}
          name={name}
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`relative z-10 w-full cursor-pointer appearance-none rounded-[7px] border-[1.5px] border-gray-1 bg-transparent bg-white  py-2 pl-5 pr-11.5 transition  focus:border-primary focus-visible:outline-none active:border-primary dark:border-dark-3 dark:bg-dark-2 ${
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
            Medicine Type
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

export default SelectMedicineTypes;
