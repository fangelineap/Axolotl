import { createColumnHelper } from "@tanstack/react-table";
import { AdminUserTable } from "./data";

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
    enableColumnFilter: true,
  }),
  columnHelper.accessor(
    (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    {
      cell: (info) => {
        const user_full_name = info.getValue();
        return user_full_name;
      },
      id: "User Name",
      header: "User Name",
      enableSorting: true,
      enableColumnFilter: true,
    },
  ),
  columnHelper.accessor((row) => row.email, {
    id: "User Email",
    cell: (info) => {
      const formattedDate = info.getValue();
      return formattedDate;
    },
    header: "User Email",
    enableSorting: true,
    enableColumnFilter: true,
  }),

  columnHelper.accessor("role", {
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
          ) : role === "Midwife" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-blue-light px-3 py-1">
                <p className="font-bold text-blue">{role}</p>
              </div>
            </div>
          ) : role === "Admin" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-red-light px-3 py-1">
                <p className="font-bold text-red">{role}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-kalbe-ultraLight px-3 py-1">
                <p className="font-bold text-primary">{role}</p>
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
];
