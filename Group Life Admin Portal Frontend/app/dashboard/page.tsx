"use client";

import AdminDashboard from "@/features/dashboard/AdminDashboard";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Dashboard() {
  return (
    <>
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </>
  );
}
