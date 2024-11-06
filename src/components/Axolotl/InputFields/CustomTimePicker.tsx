import { IconClock } from "@tabler/icons-react";

interface CustomTimePickerProps {
  placeholder: string;
  label: string;
  required?: boolean;
  name: string;
  horizontal?: boolean;
}

const CustomTimePicker = ({
  placeholder,
  label,
  required,
  name,
  horizontal = false
}: CustomTimePickerProps) => {
  return (
    <div
      className={`mb-3 flex w-full flex-col gap-2 ${
        horizontal
          ? "md:flex-row md:items-center md:justify-between md:gap-5"
          : ""
      }`}
    >
      <label className="font-medium text-dark dark:text-white">
        {label} {required && <span className="ml-1 text-red">*</span>}
      </label>
      <div className={`relative w-full ${horizontal ? "md:w-3/4" : ""}`}>
        <input
          name={name}
          className={`form-datepicker w-full rounded-md border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal text-dark outline-none transition focus:border-primary active:border-primary`}
          placeholder={placeholder}
          required={required}
        />
        <IconClock
          className="pointer-events-none absolute left-auto right-5 top-1/2 z-99 -translate-y-1/2"
          style={{ color: "#9CA3AF" }}
        />
      </div>
    </div>
  );
};

export default CustomTimePicker;
