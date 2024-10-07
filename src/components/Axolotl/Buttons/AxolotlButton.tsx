import React from "react";

interface AxolotlButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  customClasses?: string;
  variant:
    | "primary"
    | "primaryOutlined"
    | "danger"
    | "dangerOutlined"
    | "secondary"
    | "secondaryOutlined"
    | "warning"
    | "warningOutlined";
  roundType?: "regular" | "medium" | "large" | "extra" | "full";
  fontThickness?: "regular" | "medium" | "bold";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  customWidth?: boolean;
}

const AxolotlButton = ({
  label,
  variant,
  customClasses,
  roundType = "medium",
  fontThickness = "regular",
  startIcon,
  endIcon,
  customWidth = false,
  ...props
}: AxolotlButtonProps) => {
  const baseStyles = {
    primary:
      "border-primary bg-primary text-white hover:bg-kalbe-ultraLight hover:text-primary",
    primaryOutlined:
      "border-primary bg-white text-primary hover:bg-kalbe-ultraLight",
    danger: "border-red bg-red hover:text-red hover:bg-red-hover text-white",
    dangerOutlined: "border-red bg-white text-red hover:bg-red-hover",
    secondary:
      "border-gray-cancel bg-gray-cancel text-white hover:bg-gray-cancel-hover hover:text-gray-cancel",
    secondaryOutlined:
      "border-gray-cancel bg-white text-gray-cancel hover:bg-gray-cancel-hover",
    warning:
      "border-yellow bg-yellow text-white hover:bg-yellow-light hover:text-yellow",
    warningOutlined: "border-yellow text-yellow hover:bg-yellow-light"
  };

  const roundStyles = {
    regular: "rounded",
    medium: "rounded-md",
    large: "rounded-lg",
    extra: "rounded-xl",
    full: "rounded-full"
  };

  const fontThicknessStyles = {
    regular: "",
    medium: "font-medium",
    bold: "font-bold"
  };

  const buttonClass = `${baseStyles[variant]} ${roundStyles[roundType]} ${fontThicknessStyles[fontThickness]} border ${customWidth ? "" : "w-full"} px-3 py-2 transition duration-150 ease-in-out ${endIcon || startIcon ? "flex items-center gap-2 justify-center" : ""} ${customClasses}`;

  return (
    <button className={buttonClass} {...props}>
      {startIcon}

      {label}

      {endIcon}
    </button>
  );
};

export default AxolotlButton;
