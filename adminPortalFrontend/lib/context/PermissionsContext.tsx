"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import useToken from "@/hooks/useToken";

interface PermissionsContextType {
  permissions: Record<string, any>; // maps moduleName -> { view: boolean, create: boolean... }
  roles: string[];
  loading: boolean;
  hasPermission: (moduleName: string, action?: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken: any = useToken();
  const [permissions, setPermissions] = useState<Record<string, any>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      if (!accessToken?.accessToken) {
        // Not logged in or token not ready
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/me/permissions`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken.accessToken}` },
        });
        if (response.data?.success && response.data?.data) {
          setPermissions(response.data.data.modules || {});
          setRoles(response.data.data.roles || []);
        }
      } catch (error) {
        console.error("Failed to fetch permissions", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [accessToken?.accessToken]);

  // hasPermission helper function
  const hasPermission = (
    moduleName: string,
    action: string = "view"
  ): boolean => {
    const modulePerms = permissions[moduleName];
    if (!modulePerms) return false;

    if (modulePerms.fullControl) return true; // Full control grants everything
    return !!modulePerms[action];
  };

  return (
    <PermissionsContext.Provider
      value={{ permissions, roles, loading, hasPermission }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}
