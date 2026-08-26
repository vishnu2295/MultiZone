"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import { Add, Block, Edit, NorthEast } from "@mui/icons-material";
import SearchInput from "../../../components/ui/SearchInput";
import { Select } from "../../../components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import CustomInput from "../../../components/ui/CustomInput";
import { CustomButton } from "../../../components/ui/CustomButton";
import { FormField } from "../../../components/ui/FormField";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import axios from "axios";
import useToken from "@/hooks/useToken";

interface User {
  user_id: string;
  name: string;
  role: string;
  email: string;
  blocked: boolean;
  email_verified: boolean;
  app_metadata: any;
}

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM = {
  fullName: "",
  role: "",
  email: "",
  password: "",
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setroles] = useState<any>([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isActiveUser, setIsActiveUser] = useState(false);
  const [isDeactivateUser, setIsDeactivateUser] = useState(false);
  const [selectedUserForToggle, setSelectedUserForToggle] =
    useState<User | null>(null);
  // ── Filter / Search ──────────────────────────────────────────────────────
  const accessToken: any = useToken();
  const getRole = useCallback(async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users/roles`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken?.accessToken}`,
        },
      });

      console.log("GET ROLES:", response.data.data);
      setroles(response?.data?.data?.roles || []);
    } catch (error: any) {
      console.log("ERROR:", error);
      console.log("MESSAGE:", error.message);
      console.log("RESPONSE:sss", error.response);
    }
  }, [accessToken]);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const pageIndex = Math.max(0, currentPage - 1);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/users?page=${pageIndex}&size=${ITEMS_PER_PAGE}`;
      if (searchQuery) url += `&keyword=${encodeURIComponent(searchQuery)}`;
      if (selectedStatus) {
        url += `&status=${selectedStatus === "Active" ? "false" : "true"}`;
      }
      if (selectedRole) {
        url += `&roleId=${encodeURIComponent(selectedRole)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken?.accessToken}`,
        },
      });
      const total = response?.data?.data?.total || 0;
      setTotalData(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1);
      setUsers(response?.data?.data?.users || []);
      setLoading(false);
    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  }, [accessToken, currentPage, searchQuery, selectedStatus, selectedRole]);

  useEffect(() => {
    if (accessToken?.accessToken) {
      getRole();

      getAllUsers();
    }
  }, [accessToken?.accessToken, getRole, getAllUsers]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleToggleStatus = (user: User) => {
    setSelectedUserForToggle(user);
    if (!user.blocked) {
      setIsDeactivateUser(true);
    } else {
      setIsActiveUser(true);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);

    // Extract roleId from app_metadata if available
    const userRoleId = user.app_metadata?.roles?.[0]?.roleId || user.role || "";

    setFormData({
      fullName: user.name || "",
      role: userRoleId,
      email: user.email || "",
      password: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      if (editingUser) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${editingUser.user_id}`;
        const selectedRoleObj = roles.find((r: any) => r.id === formData.role);
        const payload = {
          name: formData.fullName,
          email: formData.email,
          ...(selectedRoleObj
            ? {
                app_metadata: {
                  roles: [
                    {
                      roleId: selectedRoleObj.id,
                      roleName: selectedRoleObj.name,
                    },
                  ],
                },
              }
            : {}),
        };
        await axios.patch(url, payload, {
          headers: { Authorization: `Bearer ${accessToken?.accessToken}` },
        });

        if (formData.role) {
          const roleUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/roles/${editingUser.user_id}`;
          await axios.post(
            roleUrl,
            { roles: [formData.role] },
            {
              headers: { Authorization: `Bearer ${accessToken?.accessToken}` },
            }
          );
        }

        // Optimistically update local state to avoid Auth0 indexing delays
        setUsers((prev) =>
          prev.map((u) => {
            if (u.user_id === editingUser.user_id) {
              return {
                ...u,
                name: formData.fullName,
                email: formData.email,
                ...(selectedRoleObj
                  ? {
                      app_metadata: {
                        ...u.app_metadata,
                        roles: [
                          {
                            roleId: selectedRoleObj.id,
                            roleName: selectedRoleObj.name,
                          },
                        ],
                      },
                    }
                  : {}),
              };
            }
            return u;
          })
        );
      } else {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/`;
        const selectedRoleObj = roles.find((r: any) => r.id === formData.role);
        const isPasswordProvided = !!formData.password?.trim();
        const payload: any = {
          name: formData.fullName,
          email: formData.email,
          connection: isPasswordProvided
            ? "Username-Password-Authentication"
            : "email",
          roles: selectedRoleObj
            ? [{ roleId: selectedRoleObj.id, roleName: selectedRoleObj.name }]
            : [],
        };

        if (isPasswordProvided) {
          payload.password = formData.password.trim();
        }
        await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${accessToken?.accessToken}` },
        });

        getAllUsers();
      }
    } catch (error: any) {
      console.error("ERROR submitting user:", error);
    }

    setIsModalOpen(false);
  };
  const userColumns: Column<User>[] = useMemo(
    () => [
      {
        header: "Full Name",
        accessorKey: "name",
        cell: (row) => (
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            {row.name}
          </Typography>
        ),
      },
      {
        header: "email verified",
        accessorKey: "email_verified",
        cell: (row) => (
          <StatusChip status={row.email_verified ? "Verified" : "Unverified"} />
        ),
      },

      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Status",
        cell: (row) => (
          <StatusChip status={row.blocked ? "Inactive" : "Active"} />
        ),
      },
      {
        header: "Actions",
        width: 280,
        cell: (row) => (
          <Stack direction="row" spacing={1}>
            <CustomButton
              variantType="outlined"
              sizeType="sm"
              startIcon={<Edit sx={{ fontSize: 14 }} />}
              onClick={() => openEditModal(row)}
            >
              Edit
            </CustomButton>

            <CustomButton
              variantType="outlined"
              customColor={!row.blocked ? "error.main" : "status.activeText"}
              sizeType="sm"
              onClick={() => handleToggleStatus(row)}
              startIcon={
                !row.blocked ? (
                  <Block sx={{ fontSize: 16 }} />
                ) : (
                  <NorthEast sx={{ fontSize: 16 }} />
                )
              }
            >
              {!row.blocked ? "Deactivate User" : "Activate User"}
            </CustomButton>
          </Stack>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          mt: 1,
          borderRadius: 3,
          p: { xs: 2.5, lg: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
          border: "none",
        }}
      >
        {/* Card header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            gap: 2,
            justifyContent: "space-between",
            alignItems: { md: "center" },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, flexShrink: 0 }}
          >
            User Management
          </Typography>

          {/* Filters row */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              gap: 1.5,
              flexWrap: { xs: "wrap", lg: "nowrap" },
              alignItems: { md: "center" },
            }}
          >
            {/* Search */}
            <SearchInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search name, role, phone number etc"
              sx={{ width: 380, maxWidth: "100%" }}
            />

            {/* Status filter */}
            <Select
              value={selectedStatus}
              options={STATUS_OPTIONS}
              renderValue={(val) => (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Status:{" "}
                  <Box component="strong" sx={{ color: "text.primary" }}>
                    {STATUS_OPTIONS.find((o) => o.value === val)?.label ??
                      "All"}
                  </Box>
                </Box>
              )}
              onChange={(val) => {
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
              sx={{ minWidth: 140 }}
            />

            {/* Role filter */}
            <Select
              value={selectedRole}
              options={[
                { label: "All Roles", value: "" },
                ...roles.map((r: any) => ({
                  label: r.name,
                  value: r.id,
                })),
              ]}
              renderValue={(val: any) => (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Role:{" "}
                  <Box
                    component="strong"
                    sx={{
                      color: "text.primary",
                      fontSize: "10px",
                    }}
                  >
                    {val
                      ? (roles.find((r: any) => r.id === val)?.name ?? val)
                      : "All"}
                  </Box>
                </Box>
              )}
              onChange={(val) => {
                setSelectedRole(val);
              }}
              sx={{ minWidth: 200 }}
            />

            {/* Add user */}
            <CustomButton startIcon={<Add />} onClick={openAddModal}>
              Add New User
            </CustomButton>
          </Stack>
        </Stack>

        {/* Table */}
        <CustomTable
          columns={userColumns}
          data={users}
          loading={loading}
          emptyMessage="No users found matching the selected filters."
          colSpanCount={6}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalData={totalData}
        />
      </Paper>

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User Details" : "Add New User"}
        showButtons={true}
        submitText={editingUser ? "Save Changes" : "Create User"}
        onSubmit={handleSubmit}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
        >
          {/* Full Name */}
          <FormField label="Full Name">
            <CustomInput
              placeholder="e.g. John Doe"
              value={formData.fullName || ""}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              error={formErrors.fullName}
            />
          </FormField>

          {/* Role */}
          <FormField label="Select Role">
            <Select
              value={formData.role}
              options={roles.map((r: any) => ({
                label: r.name,
                value: r.id,
              }))}
              onChange={(val) => setFormData({ ...formData, role: val })}
              sx={{ width: "100%", height: "44px" }}
            />
          </FormField>

          {/* Email */}
          <FormField label="Email Address">
            <CustomInput
              placeholder="e.g. john@rma.co.za"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={formErrors.email}
            />
          </FormField>

          {/* Password */}
          {editingUser === null && (
            <FormField label="Password">
              <CustomInput
                placeholder="Enter password"
                type="password"
                value={formData.password || ""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={formErrors.password}
              />
            </FormField>
          )}

          {/* Hidden submit button to support Enter key submission */}
          <button type="submit" style={{ display: "none" }} />
        </Box>
      </Modal>

      <Modal
        isOpen={isActiveUser}
        onClose={() => {
          setIsActiveUser(false);
          setSelectedUserForToggle(null);
        }}
        title={"Activate user"}
        width={"424px"}
        showButtons={true}
        submitText="Activate User"
        onSubmit={async () => {
          if (selectedUserForToggle) {
            try {
              const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUserForToggle.user_id}`;
              await axios.patch(
                url,
                { blocked: false },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken?.accessToken}`,
                  },
                }
              );
              setUsers((prev) =>
                prev.map((u) =>
                  u.user_id === selectedUserForToggle.user_id
                    ? { ...u, blocked: false }
                    : u
                )
              );
            } catch (error) {
              console.error("Error activating user", error);
            }
          }
          setIsActiveUser(false);
          setSelectedUserForToggle(null);
        }}
      >
        <Box sx={{ paddingY: "10px", maxWidth: "390px" }}>
          <Typography sx={{ paddingY: "10px" }}>
            Are you sure you want to activate “
            {selectedUserForToggle?.name ?? "User"}” back to the system?
          </Typography>
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#F5F5F5",
            }}
          >
            <Typography>
              Upon doing this action, the user will be able to login into the
              system and perform any actions further.
            </Typography>
          </Box>
        </Box>
      </Modal>

      <Modal
        isOpen={isDeactivateUser}
        onClose={() => {
          setIsDeactivateUser(false);
          setSelectedUserForToggle(null);
        }}
        title={"Deactivate user"}
        width={"424px"}
        showButtons={true}
        submitText="Deactivate User"
        onSubmit={async () => {
          if (selectedUserForToggle) {
            try {
              const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUserForToggle.user_id}`;
              await axios.delete(url, {
                headers: {
                  Authorization: `Bearer ${accessToken?.accessToken}`,
                },
              });
              setUsers((prev) =>
                prev.map((u) =>
                  u.user_id === selectedUserForToggle.user_id
                    ? { ...u, blocked: true }
                    : u
                )
              );
            } catch (error) {
              console.error("Error deactivating user", error);
            }
          }
          setIsDeactivateUser(false);
          setSelectedUserForToggle(null);
        }}
      >
        <Box sx={{ paddingY: "10px", maxWidth: "390px" }}>
          <Typography sx={{ paddingY: "10px" }}>
            Are you sure you want to deactivate “
            {selectedUserForToggle?.name ?? "User"}” from the system?
          </Typography>
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#F5F5F5",
            }}
          >
            <Typography>
              Upon doing this action, the user will not be able to login into
              the system and perform any actions further
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
