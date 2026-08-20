"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { CustomTabs } from "../../components/ui/CustomTabs";

import DebtorsDashboard from "./collectionTabs/DebtorsDashboard"; // Trigger re-parse
import DebitOrder from "./collectionTabs/DebitOrders";
import RefundPayments from "./collectionTabs/RefundPayments";
import PaymentAllocations from "./collectionTabs/PaymentAllocations";
import CreditNotes from "./collectionTabs/CreditNotes";
import BankStatementAnalysis from "./collectionTabs/BankStatementAnalysis";
import Reports from "./collectionTabs/Reports";

const TABS = [
  { label: "Debtors Dashboard", value: "tab1" },
  { label: "Debit Orders", value: "tab2" },
  { label: "Refund Payments", value: "tab3" },
  { label: "Payment Allocations", value: "tab4" },
  { label: "Credit Notes", value: "tab5" },
  { label: "Bank Statement Analysis", value: "tab6" },
  { label: "Reports", value: "tab7" },
];

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: { xs: 3, lg: 2 },
        pl: { xs: 3, lg: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Collections Administration
      </Typography>

      <CustomTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <Box>
        {activeTab === "tab1" && <DebtorsDashboard />}
        {activeTab === "tab2" && <DebitOrder />}
        {activeTab === "tab3" && <RefundPayments />}
        {activeTab === "tab4" && <PaymentAllocations />}
        {activeTab === "tab5" && <CreditNotes />}
        {activeTab === "tab6" && <BankStatementAnalysis />}
        {activeTab === "tab7" && <Reports />}
      </Box>
    </Box>
  );
}
