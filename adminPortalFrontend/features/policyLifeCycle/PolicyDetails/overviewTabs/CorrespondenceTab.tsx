import { Column, CustomTable } from "@/components/ui/CustomTable";
import { Typography } from "@mui/material";
import { useMemo } from "react";

export interface Correspondence {
  id: string;
  document: string;
  date: string;
  referenceNo: string;
}

const INITIAL_CORRESPONDENCE: Correspondence[] = [
  {
    id: "1",
    document: "Policy Schedule",
    date: "05-06-2026",
    referenceNo: "SCH-2024-0412-06",
  },
  {
    id: "2",
    document: "Invoice",
    date: "05-05-2026",
    referenceNo: "INV-2024-0891",
  },
  {
    id: "3",
    document: "Amendment Letter",
    date: "05-04-2026",
    referenceNo: "AMD-2024-0027",
  },
  {
    id: "4",
    document: "Policy Schedule",
    date: "05-03-2026",
    referenceNo: "SCH-2023-0412-01",
  },
];

export default function CorrespondenceTab() {
  const columns: Column<Correspondence>[] = useMemo(
    () => [
      {
        header: "Document",
        accessorKey: "document",
        width: "60%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.document}
          </Typography>
        ),
      },
      {
        header: "Date",
        accessorKey: "date",
        width: "20%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.date}
          </Typography>
        ),
      },
      {
        header: "Reference No",
        accessorKey: "referenceNo",
        width: "20%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.referenceNo}
          </Typography>
        ),
      },
    ],
    []
  );

  return (
    <CustomTable
      columns={columns}
      data={INITIAL_CORRESPONDENCE}
      emptyMessage="No correspondence found."
    />
  );
}
