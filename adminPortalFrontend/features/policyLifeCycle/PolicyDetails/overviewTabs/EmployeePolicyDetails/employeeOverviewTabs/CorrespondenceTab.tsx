import { Column, CustomTable } from "@/components/ui/CustomTable";
import { Typography, Box, Link } from "@mui/material";
import { useMemo, useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";

export interface Correspondence {
  id: string;
  type: string;
  recipient: string;
  channel: string;
  sentBy: string;
  dateSent: string;
  readOpenDate: string;
  status: string;
  failureReason: string;
  attachments: string;
}

const INITIAL_DATA: Correspondence[] = [
  {
    id: "1",
    type: "Welcome Letter",
    recipient: "contact1@company.co.za",
    channel: "Email",
    sentBy: "System Auto",
    dateSent: "23-04-2026",
    readOpenDate: "23-04-2026",
    status: "Failed",
    failureReason: "Bounced: Mailbox Unavailable (550)",
    attachments: "Welcome_Letter_EPOL-001.pdf",
  },
  {
    id: "2",
    type: "Cancellation Letter",
    recipient: "contact1@company.co.za",
    channel: "Email",
    sentBy: "System Auto",
    dateSent: "26-04-2026",
    readOpenDate: "26-04-2026",
    status: "Sent",
    failureReason: "N/A",
    attachments: "cancellation_letter-001.pdf",
  },
];

const ITEMS_PER_PAGE = 6;

export default function CorrespondenceTab() {
  const [data] = useState<Correspondence[]>(INITIAL_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE) || 1;

  const columns: Column<Correspondence>[] = useMemo(
    () => [
      {
        header: "Correspondence Type",
        accessorKey: "type",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {row.type}
          </Typography>
        ),
      },
      {
        header: "Recipient",
        accessorKey: "recipient",
        cell: (row) => (
          <Box sx={{ width: 120 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
              {row.recipient.split("@")[0]}@
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
              {row.recipient.split("@")[1]}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Channel",
        accessorKey: "channel",
      },
      {
        header: "Sent By",
        accessorKey: "sentBy",
        cell: (row) => (
          <Box>
            <Typography sx={{ fontSize: 14 }}>
              {row.sentBy.split(" ")[0]}
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              {row.sentBy.split(" ")[1]}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Date Sent",
        accessorKey: "dateSent",
      },
      {
        header: "Read/Open Date",
        accessorKey: "readOpenDate",
      },
      {
        header: "Status",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Failure Reason",
        accessorKey: "failureReason",
        cell: (row) => (
          <Box sx={{ maxWidth: 150 }}>
            <Typography sx={{ fontSize: 14 }}>{row.failureReason}</Typography>
          </Box>
        ),
      },
      {
        header: "Attachments",
        accessorKey: "attachments",
        cell: (row) => (
          <Link
            href="#"
            underline="always"
            sx={{ fontSize: 14, color: "text.secondary" }}
          >
            {row.attachments.split("_").join("_\n")}
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <CustomTable
      columns={columns}
      data={data}
      emptyMessage="No correspondence found."
      colSpanCount={9}
      itemsPerPage={ITEMS_PER_PAGE}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
}
