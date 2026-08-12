import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET and
// APP_BASE_URL from the environment. See .env.example for the full list.
export const auth0 = new Auth0Client({
  authorizationParameters: {
    // Set AUTH0_AUDIENCE to the identifier of the API registered in Auth0 to
    // receive an access token for it. Without it Auth0 only issues an ID token.
    audience: process.env.AUTH0_AUDIENCE,
    // offline_access is what makes refresh tokens (and silent renewal) work.
    scope: "openid profile email offline_access",
  },
});
