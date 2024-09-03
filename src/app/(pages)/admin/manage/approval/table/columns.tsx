import { createColumnHelper } from "@tanstack/react-table";
import { AdminApprovalTable } from "./data";

const columnHelper = createColumnHelper<AdminApprovalTable>();

export const columns = [
  columnHelper.accessor("caregiver_id", {
    cell: (info) => {
      const uuid = info.getValue()?.toString();
      const truncatedUuid = uuid ? `${uuid.slice(0, 16)}...` : "";
      return truncatedUuid;
    },
    id: "User ID",
    header: "User ID",
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor(
    (row) => {
      const created_at = row.created_at;
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
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
      enableColumnFilter: true,
    },
  ),
  columnHelper.accessor(
    (row) =>
      `${row.user?.first_name || ""} ${row.user?.last_name || ""}`.trim(),
    {
      cell: (info) => {
        const user_full_name = info.getValue();
        return user_full_name;
      },
      id: "Caregiver Name",
      header: "Caregiver Name",
      enableSorting: true,
      enableColumnFilter: true,
    },
  ),
  columnHelper.accessor("user.role", {
    cell: (info) => {
      const role = info.getValue();

      return (
        <div className="grid gap-5">
          {role === "Nurse" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-yellow-light px-3 py-1">
                <p className="font-bold text-yellow">{role}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-red-light px-3 py-1">
                <p className="font-bold text-red">{role}</p>
              </div>
            </div>
          )}
        </div>
      );
    },
    id: "Role",
    header: "Role",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "equals",
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const type = info.getValue();

      return (
        <div className="grid gap-5">
          {type === "Verified" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-green-light-4 px-3 py-1">
                <p className="font-bold text-primary">{type}</p>
              </div>
            </div>
          ) : type === "Unverified" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-blue-light px-3 py-1">
                <p className="font-bold text-blue">{type}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-red-light px-3 py-1">
                <p className="font-bold text-red">{type}</p>
              </div>
            </div>
          )}
        </div>
      );
    },
    id: "Status",
    header: "Status",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "equals",
  }),
];
