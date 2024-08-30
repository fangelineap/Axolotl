import { createColumnHelper } from "@tanstack/react-table";
import { AdminApprovalTable } from "./data";
import { USER } from "@/types/axolotl";

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
  columnHelper.accessor("created_at", {
    cell: (info) => {
      const created_at = info.getValue();
      const formatDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(created_at));

      return <p>{formatDate}</p>;
    },
    id: "Created At",
    header: "Created At",
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor((row) => row.user, {
    cell: (info) => {
      const user = info.getValue() as USER | undefined;

      if (user && (user.first_name || user.last_name)) {
        return `${user.first_name} ${user.last_name}`;
      }

      return "";
    },
    id: "Caregiver Name",
    header: "Caregiver Name",
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("user.role", {
    cell: (info) => {
      const role = info.getValue();

      return (
        <div className="grid gap-5">
          {role === "Nurse" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-yellow-light-4 px-3 py-1">
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
