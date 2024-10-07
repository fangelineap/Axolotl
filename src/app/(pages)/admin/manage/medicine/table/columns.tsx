import { createColumnHelper } from "@tanstack/react-table";
import { AdminMedicineTable } from "./data";

/**
 * * Type Display
 */
const typeDisplay: Record<
  "Generic" | "Branded",
  { bgColor: string; textColor: string }
> = {
  Branded: { bgColor: "bg-blue-light", textColor: "text-blue" },
  Generic: { bgColor: "bg-kalbe-ultraLight", textColor: "text-primary" }
};

const columnHelper = createColumnHelper<AdminMedicineTable>();

export const columns = [
  columnHelper.accessor("uuid", {
    cell: (info) => {
      const uuid = info.getValue()?.toString();
      const truncatedUuid = uuid ? `${uuid.slice(0, 16)}...` : "";

      return truncatedUuid;
    },
    id: "Medicine ID",
    header: "Medicine ID",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue()?.toString(),
    id: "Medicine Name",
    header: "Medicine Name",
    enableSorting: true,
    enableColumnFilter: true
  }),
  columnHelper.accessor("type", {
    cell: (info) => {
      const type = info.getValue() as "Generic" | "Branded";
      const { bgColor, textColor } = typeDisplay[type];

      return (
        <div className={`flex items-center justify-center`}>
          <div className={`rounded-3xl px-3 py-1 ${bgColor}`}>
            <p className={`font-bold ${textColor}`}>{type}</p>
          </div>
        </div>
      );
    },
    id: "Medicine Type",
    header: "Medicine Type",
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: "equals"
  }),
  columnHelper.accessor(
    (row) => {
      const price = row.price;

      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
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
      enableColumnFilter: true
    }
  )
];
