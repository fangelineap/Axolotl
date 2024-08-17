// datatable.tsx
import { Pagination } from "@mui/material";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnFilter,
  ColumnSort,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomPagination from "../Pagination/Pagination";

interface DataTableProps<T extends { id?: number; uuid?: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  showAction?: (row: T) => void;
  deleteAction?: (rowData: T) => void;
}

export function DataTable<T extends { id?: number; uuid?: string }>({
  data,
  columns,
  showAction,
  deleteAction,
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const pathName = usePathname();

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-xl border border-gray-1 bg-white p-5">
      <div className="flex justify-between border-b border-gray-1 pb-4">
        <div className="flex w-80">
          <input
            type="text"
            placeholder="Search here..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 rounded-l-md border-y border-l border-y-gray-1 p-2 text-sm outline-none focus:border-primary focus:outline-none"
          />
          <button className="flex items-center justify-center rounded-r-md bg-primary p-2">
            <IconSearch className="text-white" />
          </button>
        </div>
        <div>
          {pathName === "/admin/manage/medicine" && (
            <button className="mr-5 rounded-md bg-primary p-2 text-white">
              Add Medicine
            </button>
          )}
          <label className="mr-2">Items per page:</label>
          <select
            title="Items per page"
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                pageIndex: 0, // Reset to first page on page size change
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
      <div>
        <table className="w-full text-left">
          <thead className="border-b border-gray-1">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 font-bold">
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col justify-center">
                        <div className="flex justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          <button
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === "asc" ? (
                                <IconChevronUp />
                              ) : (
                                <IconChevronDown />
                              )
                            ) : (
                              <IconSelector />
                            )}
                          </button>
                        </div>

                        {header.column.getCanFilter() ? (
                          <input
                            type="text"
                            placeholder={`Search ${header.column.id}`}
                            value={
                              (header.column.getFilterValue() as string) || "" // Use getFilterValue method from the column API
                            }
                            onChange={
                              (e) =>
                                header.column.setFilterValue(e.target.value) // Directly use setFilterValue method from the column API
                            }
                            className="mt-2 w-full rounded border border-gray-1 p-2 text-sm font-normal focus:border-primary focus:outline-none"
                          />
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-1 hover:bg-gray">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    <div
                      className="truncate"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
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
