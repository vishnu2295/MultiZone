"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import apiService, { API_ROOT_BASE_URL } from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";
import type { ApiProfileResponse } from "@/content/site";

interface ProfileContextValue {
  profile: ApiProfileResponse | null;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  isLoading: true,
});

/**
 * Fetches `/profile/individual/{coidId}` once per page load and shares the
 * response with every consumer below it (Greeting, ProfileMenuCard, Navbar,
 * QuickActions, ...) instead of each one calling the endpoint separately.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ApiProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiProfileResponse>(
          `${API_ROOT_BASE_URL}/profile/individual/${coidId}`,
          { token },
        );

        if (!cancelled) setProfile(response);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}

/** True once the profile has loaded and the user has a pensioner record. */
export function hasPensionerRecord(profile: ApiProfileResponse | null): boolean {
  return Boolean(profile?.pensionerDetails);
}
