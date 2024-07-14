import { useState } from "react";

interface CheckboxBloodProps {
  blood: "A" | "B" | "AB" | "O" | "",
  setBlood: (blood: "A" | "B" | "AB" | "O" | "") => void
}

const CheckboxBlood = ({ blood, setBlood }: CheckboxBloodProps) => {

  return (
    <div className="flex items-center w-full lg:w-1/2">
      <label
        htmlFor="checkboxLabelA"
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white pr-3 py-3"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelA"
            className="sr-only"
            onClick={() => {
              setBlood("A");
            }}
          />
          <div
            className={`box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              blood === "A" && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        A
      </label>
      <label
        htmlFor="checkboxLabelB"
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white px-3 py-3"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelB"
            name="checkboxBlood"
            className="sr-only"
            onClick={() => {
              setBlood("B");
            }}
          />
          <div
            className={`box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              blood === "B" && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        B
      </label>
      <label
        htmlFor="checkboxLabelAB"
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white px-3 py-3"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelAB"
            className="sr-only"
            onClick={() => {
              setBlood("AB");
            }}
          />
          <div
            className={`box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              blood === "AB" && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        AB
      </label>
      <label
        htmlFor="checkboxLabelO"
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white px-3 py-3"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelO"
            className="sr-only"
            onClick={() => {
              setBlood("O");
            }}
          />
          <div
            className={`box mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              blood === "O" && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        O
      </label>
    </div>
  );
};

export default CheckboxBlood;
