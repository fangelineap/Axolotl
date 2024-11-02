interface CheckboxBloodProps {
  blood: "A" | "B" | "AB" | "O" | "";
  setBlood: (blood: "A" | "B" | "AB" | "O" | "") => void;
}

const CheckboxBlood = ({ blood, setBlood }: CheckboxBloodProps) => {
  return (
    <div className="mb-3 flex w-full flex-col gap-2">
      <label className="font-medium text-dark dark:text-white">
        Blood Type <span className="ml-1 text-red">*</span>
      </label>
      <div className="flex w-full items-center lg:w-1/2">
        {(["A", "B", "AB", "O"] as const).map((type) => (
          <label
            key={type}
            htmlFor={`radioBlood${type}`}
            className="flex cursor-pointer select-none items-center py-3 pr-3 text-body-sm font-medium text-dark dark:text-white"
          >
            <div className="relative">
              <input
                type="radio"
                name="blood_type"
                id={`radioBlood${type}`}
                value={type}
                checked={blood === type}
                onChange={() => setBlood(type)}
                className="sr-only"
              />
              <div
                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                  blood === type ? "border-primary" : "border-gray-1"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full bg-transparent ${
                    blood === type && "!bg-primary"
                  }`}
                />
              </div>
            </div>
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxBlood;
