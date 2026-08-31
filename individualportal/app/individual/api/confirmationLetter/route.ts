import https from "node:https";
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { PENSIONER_API_BASE_URL } from "@/content/pensionServices";

interface UpstreamResponse {
  status: number;
  headers: import("node:http").IncomingHttpHeaders;
  data: Buffer;
}

/**
 * The confirmationLetter endpoint only accepts GET, but reads its params from
 * a JSON body rather than the query string (confirmed: POST -> 405, GET with
 * a body -> 200 in Postman). Browsers refuse to send a body on a GET fetch()
 * (the Fetch spec throws on it), so this proxies the request through a raw
 * Node `https` call — which has no such restriction — instead.
 */
function fetchWithGetBody(url: URL, headers: Record<string, string>, body: string) {
  return new Promise<UpstreamResponse>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "GET",
        headers: { ...headers, "Content-Length": Buffer.byteLength(body) },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 500,
            headers: res.headers,
            data: Buffer.concat(chunks),
          });
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

export async function POST(request: NextRequest) {
  const rolePlayerId = request.nextUrl.searchParams.get("rolePlayerId");
  if (!rolePlayerId) {
    return NextResponse.json({ error: "Missing rolePlayerId" }, { status: 400 });
  }

  const body = await request.text();

  try {
    const { token } = await auth0.getAccessToken();
    const url = new URL(
      `${PENSIONER_API_BASE_URL}/pensioner/confirmationLetter?rolePlayerId=${rolePlayerId}`,
    );

    const upstream = await fetchWithGetBody(
      url,
      { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
    );

    if (upstream.status < 200 || upstream.status >= 300) {
      return NextResponse.json(
        { error: `Upstream request failed with status ${upstream.status}` },
        { status: upstream.status },
      );
    }

    // The upstream endpoint returns { fileName, contentType, base64Content }
    // JSON (same shape as commutation/documents), not a raw file — pass that
    // JSON straight through so the client can decode it the same way.
    return new NextResponse(upstream.data.toString("utf-8"), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch pension confirmation letter:", error);
    return NextResponse.json(
      { error: "Failed to fetch pension confirmation letter" },
      { status: 500 },
    );
  }
}
