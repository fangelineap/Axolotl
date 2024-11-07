"use client";

import React, { forwardRef } from "react";
import { IconClock } from "@tabler/icons-react";

interface CustomTimeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Additional Props which are not included in the default InputHTMLAttributes
}

const CustomTimeInput = forwardRef<HTMLInputElement, CustomTimeInputProps>(
  (props, ref) => {
    const { value, onChange, onClick, placeholder, ...rest } = props;

    return (
      <div className="relative flex w-full cursor-pointer rounded-md bg-white focus:border-primary active:border-primary dark:bg-dark-2">
        <input
          {...rest}
          ref={ref}
          value={value}
          onChange={onChange}
          onClick={onClick}
          placeholder={placeholder}
          type="text"
          className="w-full cursor-pointer rounded-md border-[1.5px] border-gray-1 bg-white px-3 py-2 font-normal outline-none 
          transition focus:border-primary active:border-primary"
        />

        <IconClock
          className="pointer-events-none absolute right-5 top-1/2 z-10 -translate-y-1/2"
          style={{ color: "#9CA3AF" }}
          size={20}
        />
      </div>
    );
  }
);

CustomTimeInput.displayName = "CustomTimeInput";

export default CustomTimeInput;
