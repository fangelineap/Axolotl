import React, { useState } from "react";

interface InputGroupWithCurrencyProps {
  customClasses?: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroupWithCurrency: React.FC<InputGroupWithCurrencyProps> = ({
  customClasses,
  label,
  placeholder,
  required,
  name,
  value,
  onChange
}) => {
  const [inputValue, setInputValue] = useState<string>(value || "");

  // Function to handle input change and format currency
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    const formattedValue = new Intl.NumberFormat("id-ID").format(
      parseInt(rawValue) || 0
    ); // Format the value to Indonesian currency format
    setInputValue(formattedValue);

    if (onChange) {
      e.target.value = formattedValue; // Set formatted value to event target
      onChange(e);
    }
  };

  return (
    <div className={customClasses}>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required}
      </label>
      <div className="relative mt-1 flex items-center">
        {/* Prefix "Rp." */}
        <span className="text-dark-seconday absolute left-3">Rp.</span>
        <input
          name={name}
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputValue}
          onChange={handleInputChange}
          className="block w-full rounded border border-stroke bg-transparent px-3 py-2 pl-12 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          style={{ paddingLeft: "2.5rem" }} // Additional padding to accommodate prefix
        />
      </div>
    </div>
  );
};

export default InputGroupWithCurrency;
