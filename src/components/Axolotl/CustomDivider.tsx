import React from "react";

interface CustomDividerProps {
  color?: string;
  horizontal?: boolean;
}

function CustomDivider({
  color = "primary",
  horizontal = false
}: CustomDividerProps) {
  return (
    <div className="hidden lg:flex lg:items-center">
      <div
        className={
          horizontal
            ? `w-full border-t border-${color}`
            : `border-${color} h-full border-l`
        }
      />
    </div>
  );
}

export default CustomDivider;
