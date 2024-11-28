import {
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconSearch,
  IconSelector,
  IconTrash
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFilter,
  ColumnSort,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AxolotlButton from "../Axolotl/Buttons/AxolotlButton";
import SelectDataTable from "../Axolotl/SelectDataTable";
import CustomPagination from "../Axolotl/Pagination/Pagination";
import { AdminApprovalTable } from "@/app/(pages)/admin/manage/approval/table/data";

interface DataTableProps<
  T extends {
    id?: number | string;
    uuid?: string;
    user_id?: string;
  }
> {
  data: T[];
  columns: ColumnDef<T>[];
  showAction?: (row: T) => void;
  deleteAction?: (rowData: T) => void;
  basePath?: string;
  initialSorting?: ColumnSort[];
  selectStatusOptions?: string[];
}

export function DataTable<
  T extends {
    id?: number | string;
    uuid?: string;
    user_id?: string;
  }
>({
  data,
  columns,
  showAction,
  deleteAction,
  basePath,
  initialSorting = [],
  selectStatusOptions
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<ColumnSort[]>(initialSorting);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const pathName = usePathname();
  const router = useRouter();

  const globalFilterFn: FilterFn<T> = (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId);

    // Convert column value to string and search it case-insensitively
    const searchValue = String(columnValue).toLowerCase();
    const filterText = String(filterValue).toLowerCase();

    return searchValue.includes(filterText);
  };

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center gap-3">
            {showAction && (
              <button
                onClick={() => {
                  showAction(row.original);

                  const assertApprovalTable =
                    row.original as unknown as AdminApprovalTable;

                  const idFieldMap: { [key: string]: keyof T | string } = {
                    "/admin/manage/medicine": "uuid",
                    "/admin/manage/user": "user_id"
                  };

                  let id: string | number | undefined;

                  if (pathName === "/admin/manage/approval") {
                    id = assertApprovalTable.users.user_id;
                  } else {
                    const idField = idFieldMap[pathName];
                    id =
                      (row.original[idField as keyof T] as
                        | string
                        | number
                        | undefined) || row.original.id;
                  }

                  const navigatePath = basePath
                    ? `${basePath}/${id}`
                    : `${pathName}/${id}`;

                  router.push(navigatePath);
                }}
                className="text-dark-secondary hover:text-blue"
              >
                <IconEye stroke={1.5} />
              </button>
            )}
            {deleteAction && (
              <button
                onClick={() => {
                  deleteAction(row.original);
                }}
                className="text-dark-secondary hover:text-red"
              >
                <IconTrash stroke={1.5} />
              </button>
            )}
          </div>
        ),
        enableSorting: false
      } as ColumnDef<T>
    ],
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    enableMultiSort: true,
    isMultiSortEvent: (_e) => true,
    maxMultiSortColCount: 2,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="rounded-lg border border-gray-1 bg-white p-5">
      <div className="flex flex-col justify-between border-b border-gray-1 pb-4 transition lg:flex-row">
        <div className="mb-4 flex w-full lg:mb-0 lg:w-80">
          <input
            type="text"
            placeholder="Search here..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 rounded-l-md border-y border-l border-y-gray-1 p-2 text-sm outline-none transition focus:border-primary focus:outline-none"
          />
          <button className="flex items-center justify-center rounded-r-md bg-primary p-2">
            <IconSearch className="text-white" />
          </button>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div className="w-fit">
            {pathName === "/admin/manage/medicine" && (
              <AxolotlButton
                label="Add Medicine"
                onClick={() => router.push(`${pathName}/add`)}
                variant="primary"
                fontThickness="medium"
              />
            )}
            {pathName === "/admin/manage/user" && (
              <AxolotlButton
                label="Create an Admin"
                onClick={() => router.push(`${pathName}/add`)}
                variant="primary"
                fontThickness="medium"
              />
            )}
          </div>
          <p className="w-fit">Items per page:</p>
          <select
            title="Items per page"
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                pageIndex: 0
              }))
            }
            className=" text-dark-secondary"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-1">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 font-bold">
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col justify-center">
                        <div
                          className={`flex ${header.column.getCanSort() ? "justify-between" : "justify-center"}`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          <button
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.column.getCanSort() ? (
                              header.column.getIsSorted() ? (
                                header.column.getIsSorted() === "asc" ? (
                                  <IconChevronUp />
                                ) : (
                                  <IconChevronDown />
                                )
                              ) : (
                                <IconSelector />
                              )
                            ) : null}
                          </button>
                        </div>

                        {header.column.getCanFilter() &&
                          (header.column.id === "Status" ? (
                            <SelectDataTable
                              title="Status"
                              options={
                                selectStatusOptions
                                  ? selectStatusOptions
                                  : ["Verified", "Unverified", "Rejected"]
                              }
                              value={
                                (header.column.getFilterValue() as string) || ""
                              }
                              onChange={(value) =>
                                header.column.setFilterValue(value)
                              }
                            />
                          ) : header.column.id === "Role" ? (
                            <SelectDataTable
                              title="Role"
                              options={["Admin", "Nurse", "Midwife", "Patient"]}
                              value={
                                (header.column.getFilterValue() as string) || ""
                              }
                              onChange={(value) =>
                                header.column.setFilterValue(value)
                              }
                            />
                          ) : header.column.id === "Medicine Type" ? (
                            <SelectDataTable
                              title="Medicine Type"
                              options={["Generic", "Branded"]}
                              value={
                                (header.column.getFilterValue() as string) || ""
                              }
                              onChange={(value) =>
                                header.column.setFilterValue(value)
                              }
                            />
                          ) : header.column.id === "Service Type" ? (
                            <SelectDataTable
                              title="Service Type"
                              options={[
                                "After Care",
                                "Neonatal Care",
                                "Elderly Care",
                                "Booster"
                              ]}
                              value={
                                (header.column.getFilterValue() as string) || ""
                              }
                              onChange={(value) =>
                                header.column.setFilterValue(value)
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder={`Search ${header.column.id}`}
                              value={
                                (header.column.getFilterValue() as string) || ""
                              }
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              className="mt-2 w-full rounded border border-gray-1 p-2 text-sm font-normal transition focus:border-primary focus:outline-none"
                            />
                          ))}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-1 hover:bg-gray"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      <div
                        className="truncate"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-4 py-10 text-center text-lg"
                >
                  There is no data to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CustomPagination
        pageCount={table.getPageCount()}
        currentPage={table.getState().pagination.pageIndex}
        onPageChange={(pageIndex) =>
          setPagination((prev) => ({ ...prev, pageIndex }))
        }
      />
    </div>
  );
}
