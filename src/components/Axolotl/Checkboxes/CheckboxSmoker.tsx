interface CheckboxSmokerProps {
  isSmoking: "Yes" | "No" | "";
  setIsSmoking: (isSmoking: "Yes" | "No" | "") => void;
}

const CheckboxSmoker = ({ isSmoking, setIsSmoking }: CheckboxSmokerProps) => {
  return (
    <div className="mb-3 flex w-full flex-col gap-2">
      <label className="font-medium text-dark dark:text-white">
        Are you a smoker? <span className="ml-1 text-red">*</span>
      </label>
      <div className="flex w-full items-center lg:w-1/2">
        {(["Yes", "No"] as const).map((option) => (
          <label
            key={option}
            htmlFor={`radioSmoker${option}`}
            className="flex cursor-pointer select-none items-center py-3 pr-3 text-body-sm font-medium text-dark dark:text-white"
          >
            <div className="relative">
              <input
                type="radio"
                name="is_smoking"
                id={`radioSmoker${option}`}
                value={option}
                checked={isSmoking === option}
                onChange={() => setIsSmoking(option)}
                className="sr-only"
              />
              <div
                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                  isSmoking === option ? "border-primary" : "border-gray-1"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                    isSmoking === option && "!bg-primary"
                  }`}
                />
              </div>
            </div>
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxSmoker;
