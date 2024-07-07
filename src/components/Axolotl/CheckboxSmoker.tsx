import { useState } from "react";

const CheckboxSmoker = () => {
  const [isChecked, setIsChecked] = useState<"Yes"|"No"|"">("");

  return (
    <div className="flex items-center w-full lg:w-1/2">
      <label
        htmlFor="checkboxLabelYes"
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white pr-3 py-3"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelYes"
            className="sr-only"
            onClick={() => {
              setIsChecked("Yes");
            }}
          />
          <div
            className={`box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              isChecked === "Yes" && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        Yes
      </label>
      <label
        htmlFor="checkboxLabelNo"
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white px-3 py-3"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelNo"
            className="sr-only"
            onClick={() => {
              setIsChecked("No");
            }}
          />
          <div
            className={`box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              isChecked === "No" && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        No
      </label>
    </div>
  );
};

export default CheckboxSmoker;
