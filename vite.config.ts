import react from "@vitejs/plugin-react";
import { Buffer } from "node:buffer";
import { cwd, env } from "node:process";
import { defineConfig, loadEnv, type Plugin } from "vite";

function spotifyCurrentlyPlayingPlugin(mode: string): Plugin {
  const env = loadEnv(mode, cwd(), "");
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN;

  async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
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

  return {
    name: "spotify-currently-playing",
    configureServer(server) {
      server.middlewares.use("/api/spotify/currently-playing", async (_request, response) => {
        if (!clientId || !clientSecret || !refreshToken) {
          response.statusCode = 503;
          response.end(JSON.stringify({ error: "Spotify environment variables are not configured" }));
          return;
        }

        try {
          const accessToken = await getAccessToken();
          const spotifyResponse = await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (spotifyResponse.status === 204) {
            response.statusCode = 204;
            response.end();
            return;
          }

          response.statusCode = spotifyResponse.status;
          response.setHeader("Content-Type", "application/json");
          response.end(await spotifyResponse.text());
        } catch (error) {
          response.statusCode = 500;
          response.end(JSON.stringify({
            error: error instanceof Error ? error.message : "Spotify request failed",
          }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: env.GITHUB_PAGES === "true" ? "/portfolio-website/" : "/",
  plugins: [react(), spotifyCurrentlyPlayingPlugin(mode)],
  test: {
    environment: "jsdom",
  },
}));
