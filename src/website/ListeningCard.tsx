import {
  getProgressPercent,
  spotifyFallback,
} from "../integrations/spotify";
import { useCurrentTrack } from "../integrations/useCurrentTrack";

type ListeningCardProps = {
  variant?: "card" | "hero";
};

export function ListeningCard({ variant = "card" }: ListeningCardProps) {
  const state = useCurrentTrack();

  if (state.status !== "playing") {
    return (
      <div className={`website-listening-empty website-listening-empty-${variant}`}>
        <span className="website-listening-label">
          <span aria-hidden="true">♪</span> Music
        </span>
        <p>{state.status === "loading" ? "checking spotify..." : spotifyFallback}</p>
      </div>
    );
  }

  const progress = getProgressPercent(state.track);

  if (variant === "hero") {
    return (
      <article className="website-listening website-listening-hero">
        {state.track.albumArtUrl ? (
          <span className="website-album-disc">
            <img src={state.track.albumArtUrl} alt={`${state.track.album} album art`} />
          </span>
        ) : null}
        <div>
          <p className="website-listening-label">
            <span aria-hidden="true">♪</span> Now playing on Spotify
          </p>
          <p>
            {state.track.trackUrl ? (
              <a href={state.track.trackUrl} rel="noreferrer" target="_blank">
                {state.track.title}
              </a>
            ) : (
              <span>{state.track.title}</span>
            )}{" "}
            {state.track.artist ? `by ${state.track.artist}` : ""}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={`website-listening website-listening-${variant}`}>
      {state.track.albumArtUrl ? (
        <span className="website-album-disc">
          <img src={state.track.albumArtUrl} alt={`${state.track.album} album art`} />
        </span>
      ) : null}
      <div>
        <p className="website-listening-status">
          <span aria-hidden="true">♪</span> Now playing on Spotify
        </p>
        <h3>
          {state.track.trackUrl ? (
            <a href={state.track.trackUrl} rel="noreferrer" target="_blank">
              {state.track.title}
            </a>
          ) : (
            state.track.title
          )}
        </h3>
        <p>{state.track.artist}</p>
        {state.track.album ? <p className="website-muted">{state.track.album}</p> : null}
        <div
          className="website-listening-progress"
          aria-label={`Track progress ${progress}%`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}
