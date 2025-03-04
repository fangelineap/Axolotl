import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import CustomTimeInput from "./CustomTimeInput";
import dayjs from "dayjs";

interface CustomTimePickerProps {
  placeholder: string;
  label: string;
  required?: boolean;
  name: string;
  horizontal?: boolean;
  value?: string;
}

const CustomTimePicker = ({
  placeholder,
  label,
  required,
  name,
  horizontal = false,
  value
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileTimePicker
            ampm={false}
            name={name}
            defaultValue={dayjs(new Date())}
            value={dayjs(value, "HH:mm")}
            slots={{
              textField: CustomTimeInput
            }}
            slotProps={{
              textField: {
                placeholder
              }
            }}
            orientation="landscape"
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default CustomTimePicker;
