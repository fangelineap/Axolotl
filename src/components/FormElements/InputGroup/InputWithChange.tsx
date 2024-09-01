import React from "react";

interface InputGroupProps {
  customClasses?: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroupWithChange: React.FC<InputGroupProps> = ({
  customClasses,
  label,
  type,
  placeholder,
  required,
  name,
  value,
  onChange, // Include onChange prop
}) => {
  return (
    <div className={customClasses}>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
        {required}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value} // Bind the input value
        onChange={onChange} // Attach the onChange event handler
        className="mt-1 block w-full rounded border border-stroke bg-transparent p-2  text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
      />
    </div>
  );
};

export default InputGroupWithChange;
