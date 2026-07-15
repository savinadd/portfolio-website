const tokenUrl = "https://accounts.spotify.com/api/token";
const currentlyPlayingUrl = "https://api.spotify.com/v1/me/player/currently-playing";

type ApiRequest = {
  method?: string;
};

type ApiResponse = {
  end: () => void;
  json: (body: unknown) => void;
  send: (body: string) => void;
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
};

function getServerEnv() {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env ?? {};
}

function encodeBasicAuth(value: string) {
  const globals = globalThis as typeof globalThis & {
    Buffer?: {
      from: (input: string, encoding?: string) => { toString: (encoding: string) => string };
    };
    btoa?: (input: string) => string;
  };

  if (globals.Buffer) return globals.Buffer.from(value, "utf8").toString("base64");
  if (globals.btoa) return globals.btoa(value);

  throw new Error("No base64 encoder is available");
}

function sendJson(response: ApiResponse, status: number, body: unknown) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json");
  response.status(status).json(body);
}

async function getAccessToken() {
  const serverEnv = getServerEnv();
  const clientId = serverEnv.SPOTIFY_CLIENT_ID;
  const clientSecret = serverEnv.SPOTIFY_CLIENT_SECRET;
  const refreshToken = serverEnv.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify environment variables are not configured");
  }

  const response = await fetch(tokenUrl, {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    headers: {
      Authorization: `Basic ${encodeBasicAuth(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description ?? payload.error ?? "Spotify token refresh failed");
  }

  return payload.access_token as string;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const accessToken = await getAccessToken();
    const spotifyResponse = await fetch(currentlyPlayingUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (spotifyResponse.status === 204) {
      response.status(204).end();
      return;
    }

    response.setHeader("Content-Type", "application/json");
    response.status(spotifyResponse.status).send(await spotifyResponse.text());
  } catch (error) {
    sendJson(
      response,
      500,
      { error: error instanceof Error ? error.message : "Spotify request failed" },
    );
  }
}
