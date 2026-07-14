const tokenUrl = "https://accounts.spotify.com/api/token";
const currentlyPlayingUrl = "https://api.spotify.com/v1/me/player/currently-playing";

function getServerEnv() {
  return (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env ?? {};
}

function encodeBasicAuth(value: string) {
  return globalThis.btoa(value);
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
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

async function getCurrentlyPlaying() {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(currentlyPlayingUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return new Response(null, {
        headers: { "Cache-Control": "no-store" },
        status: 204,
      });
    }

    return new Response(await response.text(), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
      status: response.status,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Spotify request failed" },
      { status: 500 },
    );
  }
}

export default {
  fetch(request: Request) {
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, { status: 405 });
    }

    return getCurrentlyPlaying();
  },
};
