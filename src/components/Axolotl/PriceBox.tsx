import React from "react";

interface PriceBoxProps {
  disabled?: boolean;
  value: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceBox = ({ disabled = true, value, onChange }: PriceBoxProps) => {
  return (
    <div className="flex w-full items-center">
      <label className="rounded-l-md border border-r-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
        Rp.
      </label>
      <input
        aria-label="Price"
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-r-md border border-gray-1 bg-white px-2 py-2 font-normal text-dark outline-none transition ${
          disabled
            ? "disabled:cursor-default disabled:bg-gray disabled:text-dark-secondary"
            : "bg-white"
        }`}
      />
    </div>
  );
};

export default PriceBox;
