import { Amplify } from "aws-amplify";
import type { ResourcesConfig } from "aws-amplify";

// Shared by both the browser (this file) and the server-side session reader
// so client and server can never end up pointed at different pools/clients.
export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
    },
  },
};

// ssr: true switches Amplify from localStorage-backed tokens (invisible to
// the server) to cookie-backed tokens, so proxy.ts and server components can
// read the same session the browser created. Import this module (for its
// side effect) before calling any function from "aws-amplify/auth" -
// registrationService.ts does this once at the top of the file.
Amplify.configure(amplifyConfig, { ssr: true });
