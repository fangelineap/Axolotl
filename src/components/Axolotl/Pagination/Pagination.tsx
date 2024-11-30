import { Pagination } from "@mui/material";
import React from "react";

interface PaginationProps {
  pageCount: number; // Total number of pages
  currentPage: number; // Current page index (0-based)
  onPageChange: (pageIndex: number) => void; // Callback when the page is changed
}

function CustomPagination({
  pageCount,
  currentPage,
  onPageChange
}: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <Pagination
        count={pageCount}
        page={currentPage + 1} // Convert 0-based index to 1-based for MUI
        onChange={(e, value) => onPageChange(value - 1)} // Convert 1-based index back to 0-based
        showFirstButton
        showLastButton
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#000000", // Default color for all items
            fontSize: "18px",
            "&.Mui-selected": {
              backgroundColor: "transparent",
              color: "#1CBF90", // Color for the selected item
              fontWeight: "bold"
            },
            "&:hover:not(.Mui-selected)": {
              backgroundColor: "#E9ECEF" // Hover color for non-selected items
            }
          }
        }}
      />
      <span className="mr-2 text-sm text-black">
        Showing <b>{currentPage + 1}</b> of <b>{pageCount}</b> Pages
      </span>
    </div>
  );
}

export default CustomPagination;
