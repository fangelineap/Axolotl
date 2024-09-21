import React from "react";

interface DisabledLabelProps {
  label: string;
  type: string;
  horizontal: boolean;
  placeholder?: string;
  value?: string;
  isUnit?: boolean;
  unitName?: string;
  isHeightWeight?: boolean;
  height?: string;
  weight?: string;
}

const DisabledLabel = ({
  label,
  type,
  horizontal = false,
  placeholder,
  value,
  isHeightWeight = false,
  isUnit = false,
  unitName,
  height,
  weight
}: DisabledLabelProps) => {
  if (isUnit) {
    return (
      <div
        className={`mb-3 flex ${horizontal ? "items-center justify-between gap-5" : "w-full flex-col gap-2"}`}
      >
        <label className="font-medium text-dark dark:text-white">{label}</label>
        <div className="flex w-full items-center">
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            disabled
            className={`${horizontal ? "w-[75%]" : "w-full"} rounded-l-[5px] border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
          />
          <label className="rounded-r-md border border-l-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
            {unitName}
          </label>
        </div>
      </div>
    );
  }

  if (isHeightWeight) {
    return (
      <div
        className={`mb-3 flex ${horizontal ? "items-center justify-between gap-5" : "w-full flex-col gap-2"}`}
      >
        <label className="font-medium text-dark dark:text-white">{label}</label>
        <div className="flex w-full items-center gap-2">
          <div className="flex w-full items-center">
            <input
              type={type}
              placeholder={placeholder}
              value={height}
              disabled
              className={`${horizontal ? "w-[75%]" : "w-full"} rounded-l-[5px] border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
            />
            <label className="rounded-r-md border border-l-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
              cm
            </label>
          </div>
          <div className="flex w-full items-center">
            <input
              type={type}
              placeholder={placeholder}
              value={weight}
              disabled
              className={`${horizontal ? "w-[75%]" : "w-full"} rounded-l-[5px] border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
            />
            <label className="rounded-r-md border border-l-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
              kg
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-3 flex ${horizontal ? "items-center justify-between gap-5" : "w-full flex-col gap-2"}`}
    >
      <label className="font-medium text-dark dark:text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled
        className={`${horizontal ? "w-[75%]" : "w-full"} rounded-[5px] border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark`}
      />
    </div>
  );
};

export default DisabledLabel;
