import { createColumnHelper } from "@tanstack/react-table";
import { AdminUserTable } from "./data";

/**
 * * Role Display
 */
const roleDisplay: Record<
  "Nurse" | "Midwife" | "Admin" | "Patient" | "default",
  { bgColor: string; textColor: string }
> = {
  Nurse: { bgColor: "bg-yellow-light", textColor: "text-yellow" },
  Midwife: { bgColor: "bg-blue-light", textColor: "text-blue" },
  Admin: { bgColor: "bg-red-light", textColor: "text-red" },
  Patient: { bgColor: "bg-kalbe-ultraLight", textColor: "text-primary" },
  default: { bgColor: "bg-gray", textColor: "text-gray-cancel" }
};

const columnHelper = createColumnHelper<AdminUserTable>();

export const columns = [
  columnHelper.accessor("user_id", {
    cell: (info) => {
      const uuid = info.getValue()?.toString();
      const truncatedUuid = uuid ? `${uuid.slice(0, 16)}...` : "";

      return truncatedUuid;
    },
    id: "User ID",
    header: "User ID",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor(
    (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    {
      cell: (info) => info.getValue(),
      id: "User Name",
      header: "User Name",
      enableSorting: true,
      enableColumnFilter: true
    }
  ),
  columnHelper.accessor((row) => row.email, {
    id: "User Email",
    cell: (info) => {
      const formattedDate = info.getValue();

      return formattedDate;
    },
    header: "User Email",
    enableSorting: true,
    enableColumnFilter: true
  }),

  columnHelper.accessor("role", {
    cell: (info) => {
      const role = info.getValue() as
        | "Nurse"
        | "Midwife"
        | "Admin"
        | "Patient"
        | "default";
      const { bgColor, textColor } = roleDisplay[role] || roleDisplay.default;

      return (
        <div className={`flex items-center justify-center`}>
          <div className={`rounded-3xl px-3 py-1 ${bgColor}`}>
            <p className={`font-bold ${textColor}`}>
              {role === "default" ? "N/A" : role}
            </p>
          </div>
        </div>
      );
    },
    id: "Role",
    header: "Role",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "equals"
  })
];
