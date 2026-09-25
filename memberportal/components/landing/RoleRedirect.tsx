"use client";

import { useEffect } from "react";
import { getCognitoRoleHomePath } from "@/lib/registrationService";

// proxy.ts redirects "/" to the member's zone server-side, but only while the
// access token cookie is still valid - it can't refresh an expired one. The
// browser can: fetchAuthSession() refreshes the tokens (and their cookies),
// so re-check here and follow the role once it's done. The guard stops a
// redirect loop if the server still rejects the session for some other
// reason and bounces the member straight back to "/".
const ATTEMPT_KEY = "rma_role_redirect_at";
const RETRY_AFTER_MS = 30_000;

export default function RoleRedirect() {
  useEffect(() => {
    let lastAttempt = 0;
    try {
      lastAttempt = Number(sessionStorage.getItem(ATTEMPT_KEY)) || 0;
    } catch {
      // Storage unavailable - fall through and attempt once.
    }
    if (Date.now() - lastAttempt < RETRY_AFTER_MS) return;

    getCognitoRoleHomePath()
      .then((homePath) => {
        if (!homePath) return;
        try {
          sessionStorage.setItem(ATTEMPT_KEY, String(Date.now()));
        } catch {
          // Ignore - the redirect still works without the guard.
        }
        window.location.replace(homePath);
      })
      .catch(() => {
        // No session - stay on the landing page.
      });
  }, []);

  return null;
}
