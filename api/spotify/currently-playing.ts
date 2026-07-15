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

class SpotifyApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function getServerEnv() {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env ?? {};
}

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) return undefined;

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
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
  const clientId = cleanEnvValue(serverEnv.SPOTIFY_CLIENT_ID);
  const clientSecret = cleanEnvValue(serverEnv.SPOTIFY_CLIENT_SECRET);
  const refreshToken = cleanEnvValue(serverEnv.SPOTIFY_REFRESH_TOKEN);

  if (!clientId || !clientSecret || !refreshToken) {
    throw new SpotifyApiError(
      "Spotify environment variables are not configured",
      "missing_env",
      500,
    );
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
    throw new SpotifyApiError(
      payload.error_description ?? payload.error ?? "Spotify token refresh failed",
      payload.error ?? "token_refresh_failed",
      response.status,
    );
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
    if (error instanceof SpotifyApiError) {
      sendJson(
        response,
        error.status,
        {
          code: error.code,
          error: error.message,
        },
      );
      return;
    }

    sendJson(
      response,
      500,
      { error: error instanceof Error ? error.message : "Spotify request failed" },
    );
  }
}
