import { useEffect, useState } from "react";

const bugsCaughtKey = "savina-portfolio-bugs-caught";
const bugDelayMs = 120_000;
const bugMessageMs = 3_400;

function readBugsCaught() {
  const saved = window.localStorage.getItem(bugsCaughtKey);
  const parsed = saved ? Number.parseInt(saved, 10) : 0;

  return Number.isNaN(parsed) ? 0 : parsed;
}

export function BugGame() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [bugsCaught, setBugsCaught] = useState(readBugsCaught);
  const [spawnCount, setSpawnCount] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
      setMessage("");
    }, bugDelayMs);

    return () => window.clearTimeout(timer);
  }, [spawnCount]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => setMessage(""), bugMessageMs);

    return () => window.clearTimeout(timer);
  }, [message]);

  function catchBug() {
    const nextBugsCaught = bugsCaught + 1;

    window.localStorage.setItem(bugsCaughtKey, nextBugsCaught.toString());
    setBugsCaught(nextBugsCaught);
    setIsVisible(false);
    setMessage("you found a bug! thanks for reporting :)");
    setSpawnCount((current) => current + 1);
  }

  return (
    <div className="terminal-bug-layer" aria-live="polite">
      {isVisible ? (
        <button className="terminal-bug" type="button" onClick={catchBug}>
          <span className="terminal-bug-label">catch bug</span>
          <span className="terminal-ladybug" aria-hidden="true">
            <span className="terminal-ladybug-wing terminal-ladybug-wing-left" />
            <span className="terminal-ladybug-wing terminal-ladybug-wing-right" />
            <span className="terminal-ladybug-head" />
          </span>
        </button>
      ) : null}
      {message ? (
        <div className="terminal-bug-status">
          <p>{message}</p>
        </div>
      ) : null}
    </div>
  );
}
