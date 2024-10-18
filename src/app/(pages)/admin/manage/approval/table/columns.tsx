import { createColumnHelper } from "@tanstack/react-table";
import { AdminApprovalTable } from "./data";

/**
 * * Role Display
 */
const roleDisplay: Record<
  "Nurse" | "Midwife",
  { bgColor: string; textColor: string }
> = {
  Nurse: { bgColor: "bg-yellow-light", textColor: "text-yellow" },
  Midwife: { bgColor: "bg-blue-light", textColor: "text-blue" }
};

const columnHelper = createColumnHelper<AdminApprovalTable>();

/**
 * * Default Sort Function; This function will sort the table starting from Unverified, Verified, and Rejected
 * @param rowA
 * @param rowB
 * @param columnId
 * @returns
 */
const customStatusSort = (rowA: any, rowB: any, columnId: string) => {
  const order: { [key: string]: number } = {
    Unverified: 0,
    Verified: 1,
    Rejected: 2
  };
  const statusA = rowA.getValue(columnId);
  const statusB = rowB.getValue(columnId);

  return order[statusA] - order[statusB];
};

export const columns = [
  columnHelper.accessor("users.user_id", {
    cell: (info) => {
      const uuid = info.getValue()?.toString();
      const truncatedUuid = uuid ? `${uuid.slice(0, 16)}...` : "";

      return truncatedUuid;
    },
    id: "Caregiver ID",
    header: "Caregiver ID",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor(
    (row) => {
      const created_at = row.created_at;

      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }).format(new Date(created_at));
    },
    {
      id: "Created At",
      cell: (info) => {
        const formattedDate = info.getValue();

        return formattedDate;
      },
      header: "Created At",
      enableSorting: true,
      enableColumnFilter: true
    }
  ),
  columnHelper.accessor(
    (row) =>
      `${row.users?.first_name || ""} ${row.users?.last_name || ""}`.trim(),
    {
      cell: (info) => {
        const user_full_name = info.getValue();

        return user_full_name;
      },
      id: "Caregiver Name",
      header: "Caregiver Name",
      enableSorting: true,
      enableColumnFilter: true
    }
  ),
  columnHelper.accessor("users.role", {
    cell: (info) => {
      const role = info.getValue() as "Midwife" | "Nurse";
      const { bgColor, textColor } = roleDisplay[role];

      return (
        <div className={`flex items-center justify-center`}>
          <div className={`rounded-3xl px-3 py-1 ${bgColor}`}>
            <p className={`font-bold ${textColor}`}>{role}</p>
          </div>
        </div>
      );
    },
    id: "Role",
    header: "Role",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "equals"
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const type = info.getValue();

      return (
        <div className="flex items-center justify-center">
          {type === "Verified" ? (
            <div className="rounded-3xl bg-kalbe-ultraLight px-3 py-1">
              <p className="font-bold text-primary">{type}</p>
            </div>
          ) : type === "Unverified" ? (
            <div className="rounded-3xl bg-blue-light px-3 py-1">
              <p className="font-bold text-blue">{type}</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-red-light px-3 py-1">
              <p className="font-bold text-red">{type}</p>
            </div>
          )}
        </div>
      );
    },
    id: "Status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: customStatusSort,
    filterFn: "equals"
  })
];
