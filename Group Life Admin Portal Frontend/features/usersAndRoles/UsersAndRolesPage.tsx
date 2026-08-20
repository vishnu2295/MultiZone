"use client";

import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import UserManagement from "./usersTabs/UserManagement";
import RolesMatrix from "./usersTabs/RolesMatrix";

export default function UsersAndRoles() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0, // prevents flex overflow on narrow screens
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: "73px",
            p: { xs: 3, lg: 2 },
            pl: { xs: 3, lg: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Users and Roles
          </Typography>

          <Box>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                value="users"
                label="User Management"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
              />
              <Tab
                value="roles"
                label="Roles and Permissions Matrix"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
              />
            </Tabs>
          </Box>

          {activeTab === "users" ? <UserManagement /> : <RolesMatrix />}
        </Box>
      </Box>
    </Box>
  );
}
