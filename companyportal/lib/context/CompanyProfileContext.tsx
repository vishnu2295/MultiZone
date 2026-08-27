"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  mapEmployerProfiles,
  type ApiOrganizationProfileResponse,
  type EmployerProfileOption,
} from "@/content/site";
import apiService, { API_ROOT_BASE_URL } from "@/lib/api/apiService";
import { getEmployerCoidId } from "@/lib/auth/employerClaims";
import { SELECTED_ROLE_PLAYER_COOKIE } from "@/lib/auth/companyProfileCookie";

interface CompanyProfileContextValue {
  token: string | null;
  userName: string | null;
  userEmail: string | null;
  employerProfiles: EmployerProfileOption[];
  selectedEmployer: EmployerProfileOption | null;
  rolePlayerId: number | null;
  isLoading: boolean;
  selectProfile: (rolePlayerId: number) => void;
}

const CompanyProfileContext = createContext<CompanyProfileContextValue | null>(null);

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

/**
 * Single source of truth for "which employer profile is active" in the
 * company portal. The token authenticates the user and fetches the profile
 * once; every other coidId/rolePlayerId-scoped call in the app should read
 * rolePlayerId from here (via useCompanyProfile), not re-decode the token.
 */
export function CompanyProfileProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [employerProfiles, setEmployerProfiles] = useState<EmployerProfileOption[]>([]);
  const [selectedRolePlayerId, setSelectedRolePlayerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { token: accessToken, coidId } = await getEmployerCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiOrganizationProfileResponse>(
          `${API_ROOT_BASE_URL}/profile/organization/${coidId}`,
          { token: accessToken },
        );

        if (cancelled) return;

        setToken(accessToken);
        const { firstName, lastName, email } = response.userDetails;
        setUserName([firstName, lastName].filter(Boolean).join(" ").trim() || null);
        setUserEmail(email || null);

        const employers = mapEmployerProfiles(response);
        setEmployerProfiles(employers);

        const savedId = Number(readCookie(SELECTED_ROLE_PLAYER_COOKIE));
        const restored = employers.find((employer) => employer.rolePlayerId === savedId);
        setSelectedRolePlayerId((restored ?? employers[0])?.rolePlayerId ?? null);
      } catch (error) {
        console.error("Failed to load company profile:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectProfile = useCallback((rolePlayerId: number) => {
    setSelectedRolePlayerId(rolePlayerId);
    writeCookie(SELECTED_ROLE_PLAYER_COOKIE, String(rolePlayerId));
  }, []);

  const selectedEmployer =
    employerProfiles.find((employer) => employer.rolePlayerId === selectedRolePlayerId) ??
    employerProfiles[0] ??
    null;

  return (
    <CompanyProfileContext.Provider
      value={{
        token,
        userName,
        userEmail,
        employerProfiles,
        selectedEmployer,
        rolePlayerId: selectedEmployer?.rolePlayerId ?? null,
        isLoading,
        selectProfile,
      }}
    >
      {children}
    </CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile(): CompanyProfileContextValue {
  const context = useContext(CompanyProfileContext);
  if (!context) {
    throw new Error("useCompanyProfile must be used within a CompanyProfileProvider");
  }
  return context;
}
