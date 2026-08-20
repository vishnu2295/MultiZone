"use client";

import { Suspense } from "react";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { useSidebar } from "@/lib/context/SidebarContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();
  return (
    <>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100vh",
          marginLeft: isCollapsed ? "60px" : "240px",
          background: "var(--background)",
          fontFamily: "'Inter', sans-serif",
          transition: "margin-left 0.3s ease",
          overflow: "hidden",
        }}
      >
        <DashboardHeader />
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
