import { Amplify } from "aws-amplify";

// Configures the Amplify Auth client for Cognito. Import this module (for
// its side effect) before calling any function from "aws-amplify/auth" -
// registrationService.ts does this once at the top of the file.
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
    },
  },
});
