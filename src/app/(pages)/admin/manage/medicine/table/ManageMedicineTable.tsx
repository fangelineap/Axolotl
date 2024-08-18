"use client";

import { DataTable } from "@/components/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { AdminMedicineTable, data } from "./data";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";

function ManageMedicineTable() {
  const [tableData, setTableData] = useState<AdminMedicineTable[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await data();
      setTableData(fetchedData);
    };

    fetchData();
  }, []);

  return (
    <div className="mb-10">
      <DataTable
        data={tableData}
        columns={columns as ColumnDef<AdminMedicineTable>[]}
        showAction={(row: AdminMedicineTable) => (row)}
        deleteAction={(row: AdminMedicineTable) => (row)}
      />
    </div>
  );
}

export default ManageMedicineTable;
