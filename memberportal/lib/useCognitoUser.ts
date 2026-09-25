"use client";

import { useCallback, useEffect, useState } from "react";
import "@/lib/amplifyConfig";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

/**
 * Tracks whether a Cognito session exists, client-side, and keeps it in sync
 * with sign-in/sign-out events fired anywhere in the app (Amplify's Hub
 * 'auth' channel) - so UI like the navbar updates without a full reload.
 */
export function useCognitoUser(): { signedIn: boolean; loading: boolean } {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    try {
      const { tokens } = await fetchAuthSession();
      console.log("[Cognito] Access token (memberportal):", tokens?.accessToken?.toString());
      setSignedIn(Boolean(tokens?.accessToken));
    } catch {
      setSignedIn(false);
    }
  }, []);

  useEffect(() => {
    check();
    return Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "signedOut") {
        check();
      }
    });
  }, [check]);

  return { signedIn: signedIn ?? false, loading: signedIn === null };
}

export async function cognitoLogout(): Promise<void> {
  await signOut({ global: true });
}
