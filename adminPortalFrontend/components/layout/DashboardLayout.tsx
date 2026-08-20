"use client";

import Box from "@mui/material/Box";
import DashboardHeader from "./DashboardHeader";
import { useSidebar } from "@/lib/context/SidebarContext";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBackButton?: boolean;
}
export default function DashboardLayout({
  children,
  showHeader = true,
  showBackButton = false,
}: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();
  return (
    <>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100vh",
          marginLeft: isCollapsed ? "72px" : "260px",
          background: "var(--background)",
          fontFamily: "'Inter', sans-serif",
          transition: "margin-left 0.3s ease",
          overflow: "hidden",
        }}
      >
        {showHeader && <DashboardHeader showBackButton={showBackButton} />}
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
