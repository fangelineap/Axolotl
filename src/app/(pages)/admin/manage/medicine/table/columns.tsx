import { createColumnHelper } from "@tanstack/react-table";
import { AdminMedicineTable } from "./data";

const columnHelper = createColumnHelper<AdminMedicineTable>();
export const columns = [
  columnHelper.accessor("uuid", {
    cell: (info) => info.getValue()?.toString(),
    id: "Medicine ID",
    header: "Medicine ID",
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue()?.toString(),
    id: "Medicine Name",
    header: "Medicine Name",
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("type", {
    cell: (info) => {
      const type = info.getValue();

      return (
        <div className="grid gap-5">
          {type === "Generic" ? (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-green-light-4 px-3 py-1">
                <p className="font-bold text-primary">{type}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="rounded-3xl bg-blue-light px-3 py-1">
                <p className="font-bold text-blue">{type}</p>
              </div>
            </div>
          )}
        </div>
      );
    },
    id: "Medicine Type",
    header: "Medicine Type",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "equals",
  }),
  columnHelper.accessor("price", {
    cell: (info) => {
      const price = info.getValue();
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);

      return <p>{formatted}</p>;
    },
    id: "Medicine Price",
    header: "Medicine Price",
    enableSorting: true,
    enableColumnFilter: true,
  }),
];
