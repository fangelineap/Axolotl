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
    <div
      className={
        horizontal
          ? `w-full border-t border-${color}`
          : `border-${color} border-l`
      }
    />
  );
}

export default CustomDivider;
