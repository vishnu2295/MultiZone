"use client";

import { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { CustomTable, Column } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { StatusChip } from "@/components/ui/StatusChip";
import { ReviewApprovalDrawer } from "../components/ReviewApprovalDrawer";

const ITEMS_PER_PAGE = 5;

const MOCK_DATA = [
  {
    refId: "AMD-007",
    type: "Premium\nAmendment",
    brokerName: "Apex Brokerage\nPartners",
    company: "Meridian\nMinerals\n(Pty) Ltd",
    policyNumber: "GRP-2023-00\n412",
    createdBy: "T. Mokoena\n01-07-2026",
    mainMember: "Sandra Nkosi\nID No :\n8407125049\n083",
    status: "Awaiting Approval",
  },
  {
    refId: "AMD-006",
    type: "Benefit\nAmendment",
    brokerName: "Cape Risk\nSolutions",
    company: "Stellenbosch Wineries\nCo-operative",
    policyNumber: "GRP-2022-00\n287",
    createdBy: "L. Botha\n01-07-2026",
    mainMember: "Riaan du Plessis\nID No :\n7902145032\n081",
    status: "Awaiting Approval",
  },
  {
    refId: "AMD-005",
    type: "Contact\nAmendment",
    brokerName: "Swiss Brokerage\nPartners",
    company: "Highveld\nSteel Works\nLtd",
    policyNumber: "GRP-2021-00\n133",
    createdBy: "S. Sithole\n01-07-2026",
    mainMember: "Bongani Dlamini\nID No :\n8509205078\n092",
    status: "Approved",
  },
  {
    refId: "AMD-004",
    type: "Banking\nAmendment",
    brokerName: "Crane Brokerage\nPartners",
    company: "Stellenbosch Wineries\nCo-operative",
    policyNumber: "GRP-2022-00\n287",
    createdBy: "L. Botha\n01-07-2026",
    mainMember: "Riaan du Plessis\nID No :\n7902145032\n081",
    status: "Rejected",
  },
  {
    refId: "AMD-003",
    type: "Address\nAmendment",
    brokerName: "Johanantha\nBrokerage Partners",
    company: "Highveld\nSteel Works\nLtd",
    policyNumber: "GRP-2021-00\n133",
    createdBy: "S. Sithole\n01-07-2026",
    mainMember: "Bongani Dlamini\nID No :\n8509205078\n092",
    status: "Requested Info",
  },
];

export default function AmendmentsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewClick = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDrawerOpen(true);
  };

  const columns: Column<any>[] = [
    { header: "Ref ID", accessorKey: "refId" },
    {
      header: "Type",
      cell: (row) => <Box sx={{ whiteSpace: "pre-line" }}>{row.type}</Box>,
    },
    {
      header: "Broker Name",
      cell: (row) => (
        <Box component="strong" sx={{ whiteSpace: "pre-line" }}>
          {row.brokerName}
        </Box>
      ),
    },
    {
      header: "Company",
      cell: (row) => <Box sx={{ whiteSpace: "pre-line" }}>{row.company}</Box>,
    },
    {
      header: "Policy Number",
      cell: (row) => (
        <Box sx={{ whiteSpace: "pre-line" }}>{row.policyNumber}</Box>
      ),
    },
    {
      header: "Created By",
      cell: (row) => <Box sx={{ whiteSpace: "pre-line" }}>{row.createdBy}</Box>,
    },
    {
      header: "Main Member",
      cell: (row) => (
        <Box sx={{ whiteSpace: "pre-line", fontSize: 13 }}>
          {row.mainMember}
        </Box>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={() => handleViewClick(row)}
          sx={{
            borderColor: "divider",
            textTransform: "none",
            color: "text.primary",
            borderRadius: 1.5,
            px: 2,
            height: 32,
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: { xs: 3, lg: 2 },
          pl: { xs: 3, lg: 3 },
          boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
          border: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, fontSize: "16px" }}
          >
            Amendments Approval Queue
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by company, policy, broker and member"
              sx={{ width: 380, maxWidth: "100%" }}
            />
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { label: "All", value: "" },
                { label: "Awaiting Approval", value: "Awaiting Approval" },
                { label: "Approved", value: "Approved" },
                { label: "Requested Info", value: "Requested Info" },
                { label: "Rejected", value: "Rejected" },
              ]}
              renderValue={(val) => (
                <Box
                  component="span"
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  Status :{" "}
                  <Box component="strong" sx={{ color: "text.primary" }}>
                    {val || "All"}
                  </Box>
                </Box>
              )}
              sx={{ minWidth: 160 }}
            />
          </Box>
        </Box>

        <CustomTable
          columns={columns}
          data={MOCK_DATA}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={2}
          totalData={10}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </Paper>

      <ReviewApprovalDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedRowData}
      />
    </>
  );
}
