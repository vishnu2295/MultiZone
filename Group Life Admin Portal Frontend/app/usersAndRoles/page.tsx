"use client";

import UsersAndRoles from "@/features/usersAndRoles/UsersAndRolesPage";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Page() {
  return (
    <>
      <DashboardLayout>
        <UsersAndRoles />
      </DashboardLayout>
    </>
  );
}
