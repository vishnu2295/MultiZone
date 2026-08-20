"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Auth0Provider,
  useUser as useAuth0User,
} from "@auth0/nextjs-auth0/client";

interface User {
  email: string;
  name?: string;
}
interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function UserContextBridge({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading } = useAuth0User();
  const [userOverride, setUser] = useState<User | null>(null);

  const derivedUser: User | null = useMemo(() => {
    if (!auth0User) return null;
    return {
      email: auth0User.email || "",
      name: auth0User.name || undefined,
    };
  }, [auth0User]);

  const user = userOverride ?? derivedUser;
  const loading = auth0Loading;

  useEffect(() => {
    if (auth0Loading || !derivedUser) return;
    localStorage.setItem("AP_USER_EMAIL", derivedUser.email);
    if (derivedUser.name)
      localStorage.setItem("userName", derivedUser.name || "");
  }, [derivedUser, auth0Loading]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider>
      <UserContextBridge>{children}</UserContextBridge>
    </Auth0Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
