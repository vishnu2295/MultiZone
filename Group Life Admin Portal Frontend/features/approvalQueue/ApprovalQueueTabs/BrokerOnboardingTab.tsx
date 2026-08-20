"use client";

import { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { CustomTable, Column } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { StatusChip } from "@/components/ui/StatusChip";
import { BrokerOnboardingDrawer } from "../components/BrokerOnboardingDrawer";

const ITEMS_PER_PAGE = 5;

const BROKER_MOCK_DATA = [
  {
    fspNumber: "FSP-10101",
    brokerName: "Apex Brokerage\nPartners",
    brokerCode: "1231234123",
    contactDetails: "John Doe\n+27 737-342-3232",
    createdBy: "Sandra Nkosi\nID No : 8407125049083",
    ficaRiskStatus: "Low",
    status: "Awaiting Approval",
  },
  {
    fspNumber: "FSP-40404",
    brokerName: "Monarch\nBrokerage Partners",
    brokerCode: "2342134231",
    contactDetails: "John Doe\n+27 737-342-3232",
    createdBy: "Riaan du Plessis\nID No : 7902145032081",
    ficaRiskStatus: "Low",
    status: "Awaiting Approval",
  },
  {
    fspNumber: "FSP-40404",
    brokerName: "Swiss Brokerage\nPartners",
    brokerCode: "2342314231",
    contactDetails: "John Doe\n+27 737-342-3232",
    createdBy: "Sandra Nkosi\nID No : 8407125049083",
    ficaRiskStatus: "Low",
    status: "Approved",
  },
  {
    fspNumber: "FSP-40404",
    brokerName: "Crane Brokerage\nPartners",
    brokerCode: "3215423214",
    contactDetails: "John Doe\n+27 737-342-3232",
    createdBy: "Riaan du Plessis\nID No : 7902145032081",
    ficaRiskStatus: "High",
    status: "Rejected",
  },
  {
    fspNumber: "FSP-40404",
    brokerName: "Johanantha\nBrokerage Partners",
    brokerCode: "878243442",
    contactDetails: "John Doe\n+27 737-342-3232",
    createdBy: "Sandra Nkosi\nID No : 8407125049083",
    ficaRiskStatus: "Medium",
    status: "Requested Info",
  },
];

export default function BrokerOnboardingTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewClick = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDrawerOpen(true);
  };

  const brokerColumns: Column<any>[] = [
    { header: "FSP Number", accessorKey: "fspNumber" },
    {
      header: "Broker Name",
      cell: (row) => (
        <Box component="strong" sx={{ whiteSpace: "pre-line" }}>
          {row.brokerName}
        </Box>
      ),
    },
    { header: "Broker Code", accessorKey: "brokerCode" },
    {
      header: "Contact Details",
      cell: (row) => (
        <Box sx={{ whiteSpace: "pre-line" }}>{row.contactDetails}</Box>
      ),
    },
    {
      header: "Created By",
      cell: (row) => <Box sx={{ whiteSpace: "pre-line" }}>{row.createdBy}</Box>,
    },
    {
      header: "FICA Risk Status",
      cell: (row) => <StatusChip status={row.ficaRiskStatus} />,
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
            Broker Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by FSP Number, Broker Name, or Broker Code"
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
          columns={brokerColumns}
          data={BROKER_MOCK_DATA}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={2}
          totalData={10}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </Paper>

      <BrokerOnboardingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedRowData}
      />
    </>
  );
}
