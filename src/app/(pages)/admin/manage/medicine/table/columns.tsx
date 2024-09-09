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
        <div className="flex items-center justify-center">
          {type === "Generic" ? (
            <div className="rounded-3xl bg-green-light-4 px-3 py-1">
              <p className="font-bold text-primary">{type}</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-blue-light px-3 py-1">
              <p className="font-bold text-blue">{type}</p>
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
  columnHelper.accessor(
    (row) => {
      const price = row.price;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);
    },
    {
      id: "Medicine Price",
      cell: (info) => {
        const formattedPrice = info.getValue();
        return <p>{formattedPrice}</p>;
      },
      header: "Medicine Price",
      enableSorting: true,
      enableColumnFilter: true,
    },
  ),
];
