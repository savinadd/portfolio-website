import { useEffect, useState } from "react";
import {
  type CurrentTrack,
  normalizeCurrentTrack,
} from "./spotify";

const spotifyEndpoint = import.meta.env.VITE_SPOTIFY_CURRENTLY_PLAYING_ENDPOINT;

export type CurrentTrackState =
  | { status: "loading" | "empty" | "error"; track?: never }
  | { status: "playing"; track: CurrentTrack };

export function useCurrentTrack(): CurrentTrackState {
  const [state, setState] = useState<CurrentTrackState>({
    status: spotifyEndpoint ? "loading" : "empty",
  });

  useEffect(() => {
    if (!spotifyEndpoint) return;

    let isMounted = true;

    async function loadCurrentTrack() {
      try {
        const response = await fetch(spotifyEndpoint);

        if (response.status === 204) {
          if (isMounted) setState({ status: "empty" });
          return;
        }

        if (!response.ok) throw new Error("spotify request failed");

        const track = normalizeCurrentTrack(await response.json());

        if (isMounted) {
          setState(track ? { status: "playing", track } : { status: "empty" });
        }
      } catch {
        if (isMounted) setState({ status: "error" });
      }
    }

    void loadCurrentTrack();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
