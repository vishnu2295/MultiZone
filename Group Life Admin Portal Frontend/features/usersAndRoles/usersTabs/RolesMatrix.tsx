"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { Add, Block, Edit, NorthEast } from "@mui/icons-material";
import SearchInput from "../../../components/ui/SearchInput";
import { Select } from "../../../components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import AddNewRoleDrawer from "./AddNewRoleDrawer";
import axios from "axios";
import useToken from "@/hooks/useToken";
import Loader from "@/components/ui/Loader";

export interface RolePermission {
  module: { id: string; name: string };
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  reject: boolean;
  fullControl: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions?: RolePermission[];
}

const STATUS_OPTIONS = ["All", "Active", "Inactive"];
const ITEMS_PER_PAGE = 6;

export default function RolesMatrix() {
  const [loading, setLoading] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [moduleList, setModuleList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [isActiveRole, setIsActiveRole] = useState(false);
  const [isDeactivateRole, setIsDeactivateRole] = useState(false);
  const [selectedRoleForToggle, setSelectedRoleForToggle] =
    useState<Role | null>(null);

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(
    null
  );
  const accessToken: any = useToken();
  const getRole = async () => {
    try {
      setLoading(true);
      const pageIndex = Math.max(0, currentPage - 1);

      // Build query params
      const params = new URLSearchParams({
        page: String(pageIndex),
        size: String(ITEMS_PER_PAGE),
      });
      if (selectedStatus === "Active") params.append("isActive", "true");
      else if (selectedStatus === "Inactive")
        params.append("isActive", "false");
      if (debouncedSearch.trim())
        params.append("search", debouncedSearch.trim());

      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/roles?${params.toString()}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken?.accessToken}`,
        },
      });
      const data = response?.data?.data;
      setRoles(data?.roles || []);
      const total = data?.total ?? data?.totalCount ?? 0;
      setTotalData(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1);
    } catch (error: any) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };
  const getModuleList = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/modules`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken?.accessToken}`,
        },
      });
      setModuleList(response?.data?.data || []);
    } catch (error: any) {
      console.error("Error fetching module list:", error);
    }
  };

  // ── Toggle active / inactive via API ────────────────────────────────────────
  const handleToggleActive = async (role: Role) => {
    try {
      setActiveLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/roles/${role.id}/toggle-active`;
      await axios.patch(
        url,
        { isActive: !role.isActive },
        { headers: { Authorization: `Bearer ${accessToken?.accessToken}` } }
      );
    } catch (error: any) {
      console.error("Error toggling role active status:", error);
    } finally {
      getRole();
      setActiveLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken?.accessToken) {
      getRole();
      getModuleList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken?.accessToken, currentPage, selectedStatus, debouncedSearch]);

  // Debounce search input (300 ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus]);

  const handleToggleStatus = (role: Role) => {
    setSelectedRoleForToggle(role);
    if (role.isActive) {
      setIsDeactivateRole(true);
    } else {
      setIsActiveRole(true);
    }
  };

  const roleColumns: Column<Role>[] = useMemo(
    () => [
      {
        header: "Role",
        accessorKey: "name",
        cell: (row) => (
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {row.name}
          </Typography>
        ),
      },
      {
        header: "Role Description",
        accessorKey: "description",
        width: "45%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 450,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.description}
          </Typography>
        ),
      },
      {
        header: "Actions",
        width: 280,
        cell: (row) => (
          <Stack direction="row" spacing={1}>
            <CustomButton
              variantType="secondary"
              sizeType="sm"
              startIcon={<Edit sx={{ fontSize: 14 }} />}
              onClick={() => {
                setSelectedRoleForEdit(row);
                setDrawerMode("edit");
                setIsAddRoleOpen(true);
              }}
            >
              Edit
            </CustomButton>

            <CustomButton
              variantType="outlined"
              sizeType="sm"
              customColor={row.isActive ? "error.main" : "status.activeText"}

              onClick={() => handleToggleStatus(row)}
              startIcon={
                row.isActive ? (
                  <Block sx={{ fontSize: 16 }} />
                ) : (
                  <NorthEast sx={{ fontSize: 16 }} />
                )
              }
            >
              {row.isActive ? "Deactivate Role" : "Activate Role"}
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
            Roles and Permissions Matrix
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
              }}
              placeholder="Search role"
            />

            {/* Status filter */}
            <Select
              value={selectedStatus}
              options={STATUS_OPTIONS.map((s) => ({
                label: s,
                value: s,
              }))}
              renderValue={(val) => (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Status :{" "}
                  <Box component="strong" sx={{ color: "text.primary" }}>
                    {val as string}
                  </Box>
                </Box>
              )}
              onChange={(val) => {
                setSelectedStatus(val);
              }}
              sx={{ minWidth: 140 }}
            />

            {/* Add Role */}
            <CustomButton
              startIcon={<Add />}
              onClick={() => {
                setSelectedRoleForEdit(null);
                setDrawerMode("add");
                setIsAddRoleOpen(true);
              }}
            >
              Add New Role
            </CustomButton>
          </Stack>
        </Stack>

        <CustomTable
          columns={roleColumns}
          data={roles}
          emptyMessage="No roles found matching the selected filters."
          colSpanCount={4}
          itemsPerPage={ITEMS_PER_PAGE}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalData={totalData}
        />
      </Paper>

      <AddNewRoleDrawer
        isOpen={isAddRoleOpen}
        onClose={() => {
          setIsAddRoleOpen(false);
          // optional: delay setting null so drawer animates out with data
          setTimeout(() => setSelectedRoleForEdit(null), 300);
        }}
        mode={drawerMode}
        role={selectedRoleForEdit}
        moduleList={moduleList}
        onSuccess={getRole}
      />

      <Modal
        isOpen={isActiveRole}
        onClose={() => {
          setIsActiveRole(false);
          setSelectedRoleForToggle(null);
        }}
        title={"Activate role"}
        width={"424px"}
        showButtons={true}
        submitText="Activate Role"
        onSubmit={async () => {
          if (selectedRoleForToggle) {
            await handleToggleActive(selectedRoleForToggle);
          }
          setIsActiveRole(false);
          setSelectedRoleForToggle(null);
        }}
      >
        {activeLoading ? (
          <Loader />
        ) : (
          <Box sx={{ paddingY: "10px", maxWidth: "390px" }}>
            <Typography sx={{ paddingY: "10px" }}>
              Are you sure you want to activate the “
              {selectedRoleForToggle?.name ?? "Role"}” role?
            </Typography>
            <Box
              sx={{
                padding: "10px",
                backgroundColor: "#F5F5F5",
              }}
            >
              <Typography>
                Upon doing this action, users assigned this role will be able to
                perform actions according to its permissions.
              </Typography>
            </Box>
          </Box>
        )}
      </Modal>

      <Modal
        isOpen={isDeactivateRole}
        onClose={() => {
          setIsDeactivateRole(false);
          setSelectedRoleForToggle(null);
        }}
        title={"Deactivate role"}
        width={"424px"}
        showButtons={true}
        submitText="Deactivate Role"
        onSubmit={async () => {
          if (selectedRoleForToggle) {
            await handleToggleActive(selectedRoleForToggle);
          }
          setIsDeactivateRole(false);
          setSelectedRoleForToggle(null);
        }}
      >
        {activeLoading ? (
          <Loader />
        ) : (
          <Box sx={{ paddingY: "10px", maxWidth: "390px" }}>
            <Typography sx={{ paddingY: "10px" }}>
              Are you sure you want to deactivate the “
              {selectedRoleForToggle?.name ?? "Role"}” role?
            </Typography>
            <Box
              sx={{
                padding: "10px",
                backgroundColor: "#F5F5F5",
              }}
            >
              <Typography>
                Upon doing this action, users assigned this role will not be
                able to perform actions according to its permissions.
              </Typography>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
}
