import { getAccessToken } from "@auth0/nextjs-auth0";

export function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
  return JSON.parse(json);
}

interface RmaId {
  coidId?: string;
  role?: string;
}

/** Access token plus the employer coidId pulled from the rma_ids claim. */
export async function getEmployerCoidId(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const token = await getAccessToken();
  const claims = decodeJwtPayload(token);
  const rmaIds = claims[
    process.env.NEXT_PUBLIC_AUTH0_IDENTIFIER as string
  ] as RmaId[] | undefined;

  return { token, coidId: rmaIds?.[0]?.coidId };
}
