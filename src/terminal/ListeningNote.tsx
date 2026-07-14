import { spotifyErrorFallback, spotifyFallback } from "../integrations/spotify";
import { useCurrentTrack } from "../integrations/useCurrentTrack";

export function ListeningNote() {
  const state = useCurrentTrack();

  if (state.status !== "playing") {
    return (
      <p className="terminal-listening-note">
        <span className="terminal-listening-label">
          <span className="terminal-meta-icon" aria-hidden="true">♪</span> music
        </span>{" "}
        {state.status === "loading"
          ? "checking spotify..."
          : state.status === "error"
            ? spotifyErrorFallback
            : spotifyFallback}
      </p>
    );
  }

  return (
    <p className="terminal-listening-note">
      <span className="terminal-listening-label">
        <span className="terminal-meta-icon" aria-hidden="true">♪</span> music
      </span>{" "}
      savina is currently listening to:{" "}
      {state.track.trackUrl ? (
        <a href={state.track.trackUrl} rel="noreferrer" target="_blank">
          {state.track.title}
        </a>
      ) : (
        state.track.title
      )}{" "}
      {state.track.artist ? `by ${state.track.artist}` : ""}
    </p>
  );
}
