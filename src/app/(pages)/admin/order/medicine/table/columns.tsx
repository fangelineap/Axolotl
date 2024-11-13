import { createColumnHelper } from "@tanstack/react-table";
import { AdminOrderMedicineLogsTable } from "./data";

/**
 * * Caregiver & Patient Name
 * @param row
 * @param source
 * @returns
 */
function userFullName(
  row: AdminOrderMedicineLogsTable,
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

/**
 * * Date Formatters
 */
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

const columnHelper = createColumnHelper<AdminOrderMedicineLogsTable>();

/**
 * * Default Sort Function; This function will sort the table starting from Ongoing, Completed, and Canceled
 * @param rowA
 * @param rowB
 * @param columnId
 * @returns
 */
const customStatusSort = (rowA: any, rowB: any, columnId: string) => {
  const order: { [key: string]: number } = {
    Ongoing: 0,
    Completed: 1,
    Canceled: 2
  };
  const statusA = rowA.getValue(columnId);
  const statusB = rowB.getValue(columnId);

  return order[statusA] - order[statusB];
};

export const columns = [
  columnHelper.accessor("appointment.appointment_date", {
    cell: (info) => {
      const created_at = info.getValue();
      const formattedDate = dateFormatter.format(new Date(created_at));

      return formattedDate;
    },
    id: "Appointment Date",
    header: "Appointment Date",
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
    enableColumnFilter: true,
    sortingFn: customStatusSort
  })
];
