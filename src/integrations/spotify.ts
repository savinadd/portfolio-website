export type CurrentTrack = {
  album: string;
  albumArtUrl?: string;
  artist: string;
  durationMs?: number;
  isPlaying: boolean;
  progressMs?: number;
  title: string;
  trackUrl?: string;
};

type SpotifyImage = {
  url?: string;
};

type SpotifyArtist = {
  name?: string;
};

type SpotifyTrackItem = {
  album?: {
    images?: SpotifyImage[];
    name?: string;
  };
  artists?: SpotifyArtist[];
  duration_ms?: number;
  external_urls?: {
    spotify?: string;
  };
  name?: string;
};

type SpotifyCurrentlyPlaying = {
  is_playing?: boolean;
  item?: SpotifyTrackItem | null;
  progress_ms?: number;
};

type NormalizedCurrentlyPlaying = Partial<CurrentTrack>;

export const spotifyFallback =
  "Savina is currently listening to the lovely sound of production bugs.";

function withOptionalTrackFields(
  track: Omit<CurrentTrack, "albumArtUrl" | "durationMs" | "progressMs" | "trackUrl">,
  optional: {
    albumArtUrl?: string | undefined;
    durationMs?: number | undefined;
    progressMs?: number | undefined;
    trackUrl?: string | undefined;
  },
): CurrentTrack {
  return {
    ...track,
    ...(optional.albumArtUrl ? { albumArtUrl: optional.albumArtUrl } : {}),
    ...(optional.durationMs ? { durationMs: optional.durationMs } : {}),
    ...(optional.progressMs ? { progressMs: optional.progressMs } : {}),
    ...(optional.trackUrl ? { trackUrl: optional.trackUrl } : {}),
  };
}

export function normalizeCurrentTrack(data: unknown): CurrentTrack | null {
  if (!data || typeof data !== "object") return null;

  if ("title" in data) {
    const track = data as NormalizedCurrentlyPlaying;

    if (!track.title || track.isPlaying === false) return null;

    return withOptionalTrackFields({
      album: track.album ?? "",
      artist: track.artist ?? "",
      isPlaying: true,
      title: track.title,
    }, track);
  }

  const spotify = data as SpotifyCurrentlyPlaying;
  const item = spotify.item;

  if (!spotify.is_playing || !item?.name) return null;

  return withOptionalTrackFields({
    album: item.album?.name ?? "",
    artist: item.artists?.map((artist) => artist.name).filter(Boolean).join(", ") ?? "",
    isPlaying: true,
    title: item.name,
  }, {
    albumArtUrl: item.album?.images?.[0]?.url,
    durationMs: item.duration_ms,
    progressMs: spotify.progress_ms,
    trackUrl: item.external_urls?.spotify,
  });
}

export function getProgressPercent(track: CurrentTrack) {
  if (!track.durationMs || !track.progressMs) return 0;

  return Math.min(100, Math.round((track.progressMs / track.durationMs) * 100));
}
