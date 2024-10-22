import { createColumnHelper } from "@tanstack/react-table";
import { AdminOrderServiceLogsTable } from "./data";

/**
 * * Caregiver & Patient Name
 * @param row
 * @param source
 * @returns
 */
function userFullName(
  row: AdminOrderServiceLogsTable,
  source: "patient" | "caregiver"
) {
  return `${row[source].users.first_name} ${row[source].users.last_name}`.trim();
}

/**
 * * Status Display
 */
const statusDisplay: Record<
  "Canceled" | "Ongoing" | "Completed",
  { bgColor: string; textColor: string }
> = {
  Canceled: { bgColor: "bg-red-light", textColor: "text-red" },
  Ongoing: { bgColor: "bg-yellow-light", textColor: "text-yellow" },
  Completed: { bgColor: "bg-kalbe-ultraLight", textColor: "text-primary" }
};

const columnHelper = createColumnHelper<AdminOrderServiceLogsTable>();

export const columns = [
  columnHelper.accessor("id", {
    cell: (info) => {
      const order_id = info.getValue()?.toString();

      return (
        <div className="flex items-center justify-center text-center">
          <p>{order_id}</p>
        </div>
      );
    },
    id: "Order ID",
    header: "Order ID",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor((row) => userFullName(row, "caregiver"), {
    cell: (info) => info.getValue(),
    id: "Caregiver Name",
    header: "Caregiver Name",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor((row) => userFullName(row, "patient"), {
    cell: (info) => info.getValue(),
    id: "Patient Name",
    header: "Patient Name",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor((row) => `${row.appointment.service_type}`, {
    cell: (info) => info.getValue(),
    id: "Service Type",
    header: "Service Type",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const status = info.getValue() as "Canceled" | "Ongoing" | "Completed";
      const { bgColor, textColor } = statusDisplay[status];

      return (
        <div className={`flex items-center justify-center`}>
          <div className={`rounded-3xl px-3 py-1 ${bgColor}`}>
            <p className={`font-bold ${textColor}`}>{status}</p>
          </div>
        </div>
      );
    },
    id: "Status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: true
  })
];
