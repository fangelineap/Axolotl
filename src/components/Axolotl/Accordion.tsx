import React, { useState } from "react";

interface AccordionProps {
  type: string;
  symptoms: string[];
  selectedAll: string[];
  setSelectedAll: (selectedAll: any) => void;
  customClass?: string;
}

const Accordion = ({
  type,
  symptoms,
  selectedAll,
  setSelectedAll,
  customClass
}: AccordionProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative mb-3 ${open ? "border-primary" : "border-stroke"} rounded-md border-[1px]`}
    >
      <h6 className="mb-0">
        <button
          className="rounded-t-1 text-dark-500 group relative flex w-full cursor-pointer items-center justify-between border-b border-solid border-slate-100 p-4 text-left font-semibold text-slate-700 transition-all ease-in"
          data-collapse-target="animated-collapse-1"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <span>{type}</span>
          <svg
            data-accordion-icon=""
            className={`h-6 w-6 shrink-0 ${open ? "rotate-180 transition-transform duration-500" : "rotate-0 transition-transform duration-500"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <i className="fa fa-chevron-down absolute right-0 pt-1 text-base transition-transform group-open:rotate-180"></i>
        </button>
      </h6>
      <div
        data-collapse="animated-collapse-1"
        className={`transition delay-150 duration-1000 ease-in-out ${open ? "h-full" : "h-0 overflow-hidden"}`}
      >
        <div className="text-blue-gray-500/80 p-4 text-sm leading-normal">
          <div className="mb-5 flex justify-end">
            <input
              className="w-[40%] p-3 px-5"
              type="text"
              placeholder="Search symtoms.."
            />
          </div>
          <div className="grid grid-flow-col grid-rows-5 justify-start gap-3 gap-x-20">
            {symptoms.map((symptom) => (
              <div key={symptom}>
                <label
                  htmlFor={`checkbox-${symptom}`}
                  className="flex cursor-pointer select-none items-center text-body-sm font-medium"
                >
                  <div className={`relative`}>
                    <input
                      type="checkbox"
                      id={`checkbox-${symptom}`}
                      className={`${customClass} sr-only`}
                      onChange={(e) => {
                        e.preventDefault();
                        if (customClass === "") {
                          const index = selectedAll.indexOf(symptom);
                          if (index <= -1) {
                            setSelectedAll((prev: string[]) => [
                              ...prev,
                              symptom
                            ]);
                          } else {
                            setSelectedAll((prev: string[]) =>
                              prev.filter((item) => item !== symptom)
                            );
                          }
                        }
                      }}
                    />
                    <div
                      className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                        selectedAll.indexOf(symptom) !== -1
                          ? "border-primary bg-primary dark:bg-transparent"
                          : "border border-dark-5 dark:border-dark-6"
                      }`}
                    >
                      <span
                        className={`opacity-0 ${selectedAll.indexOf(symptom) !== -1 && "!opacity-100"}`}
                      >
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="#FFFFFF"
                            stroke="#FFFFFF"
                            strokeWidth="0.4"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  {symptom}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
