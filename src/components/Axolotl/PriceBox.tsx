import React from "react";

interface PriceBoxProps {
  disabled?: boolean;
  value?: number | "";
  placeholder: string;
  name?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceBox = ({
  disabled = true,
  value = "",
  onChange,
  placeholder,
  name,
  required,
}: PriceBoxProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (!isNaN(Number(value)) || value === "") {
      if (onChange) {
        onChange(e);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">
        Price{" "}
        <span className="text-sm font-normal text-dark-secondary">/pcs</span>
        {required && <span className="ml-1 text-red">*</span>}
      </h1>
      <div className="flex w-full items-center">
        <label className="rounded-l-md border border-r-0 border-gray-1 bg-gray px-2 py-2 font-normal text-dark-secondary dark:text-white">
          Rp.
        </label>
        <input
          name={name}
          aria-label="Price"
          type="text"
          placeholder={placeholder}
          value={value === 0 ? "" : value?.toString()}
          onChange={handleInputChange}
          disabled={disabled}
          maxLength={8}
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

export default PriceBox;
