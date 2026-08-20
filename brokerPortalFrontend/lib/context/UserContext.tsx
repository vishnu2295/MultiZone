"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProvider as Auth0UserProvider, useUser as useAuth0User } from "@auth0/nextjs-auth0/client";
import { getRepresentativeId, getBrokerId } from "@/lib/auth";

interface User {
  email: string;
  brokerId: string;
  representativeId: string;
  name?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Internal wrapper to bridge Auth0 user to our local User context
 */
function UserContextBridge({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading } = useAuth0User();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth0Loading) return;

    if (auth0User) {
      // Map Auth0 profile to our User interface
      const userData: User = {
        email: auth0User.email || "",
        brokerId: (auth0User.rmaAppAppMetadata as any)?.brokerId || (auth0User.rmaAppBrokerId as string) || "",
        representativeId: (auth0User.rmaAppAppMetadata as any)?.representativeId || (auth0User.rmaAppRepresentativeId as string) || "",
        name: auth0User.name || auth0User.nickname || undefined,
      };

      setUser(userData);
      
      // Sync with localStorage for legacy components
      localStorage.setItem("userEmail", userData.email);
      if (userData.brokerId) localStorage.setItem("bp_broker_id", userData.brokerId);
      if (userData.representativeId) localStorage.setItem("bp_representative_id", userData.representativeId);
      if (userData.name) localStorage.setItem("userName", userData.name || "");
      
      setLoading(false);
    } else {
      // Fallback: If no Auth0 session, check URL/localStorage (Legacy logic)
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email") || localStorage.getItem("userEmail");
      const brokerId = params.get("brokerId") || getBrokerId() || localStorage.getItem("bp_broker_id");
      const representativeId = params.get("representativeId") || getRepresentativeId() || localStorage.getItem("bp_representative_id");
      const name = params.get("name") || localStorage.getItem("userName");

      if (email) {
        setUser({
          email,
          brokerId: brokerId || "",
          representativeId: representativeId || "",
          name: name || undefined,
        });
      }
      setLoading(false);
    }
  }, [auth0User, auth0Loading]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0UserProvider>
      <UserContextBridge>
        {children}
      </UserContextBridge>
    </Auth0UserProvider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
