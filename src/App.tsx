import { Analytics } from "@vercel/analytics/react";
import { useEffect, useRef, type ReactNode } from "react";
import { helpItems, sections } from "./commands";
import { BugGame } from "./terminal/BugGame";
import { ListeningNote } from "./terminal/ListeningNote";
import { WeatherNote } from "./terminal/WeatherNote";
import { themes } from "./themes";
import { useTerminal } from "./useTerminal";
import { WebsiteView } from "./website/WebsiteView";

const quickCommands = ["about", "contact", "experience", "education", "website"];
const manatees = [
  { delay: "0s", size: "86px", top: "18%" },
  { delay: "7s", size: "64px", top: "42%" },
  { delay: "14s", size: "104px", top: "68%" },
  { delay: "22s", size: "72px", top: "28%" },
] as const;
const hackLines = [
  "ssh savina@portfolio",
  "authenticating signal...",
  "handshake accepted",
  "mounting /projects",
  "reading github graph",
  "indexing react + typescript traces",
  "checking cloud credentials",
  "sap experience node found",
  "ibm mainframe node found",
  "scanning education records",
  "decrypting thesis projects",
  "loading contact routes",
  "patching boring portfolio detector",
  "injecting green theme",
  "compiling first impression",
  "result: access granted",
];
type ThemeStyle = React.CSSProperties & { "--accent-color": string };

export default function App() {
  const terminal = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!terminal.overlay) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") terminal.closeOverlay();
    }

    const returnDelay = terminal.overlay === "hack" ? 14_000 : 4_500;
    const returnTimer = window.setTimeout(() => {
      terminal.setMode("terminal");
      terminal.closeOverlay();
    }, returnDelay);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(returnTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [terminal]);

  if (terminal.mode === "website") {
    return (
      <>
        <WebsiteView onTerminal={() => terminal.setMode("terminal")} />
        <Analytics />
      </>
    );
  }

  const themeStyle: ThemeStyle = {
    "--accent-color": themes[terminal.theme],
  };

  return (
    <>
      <div
        className={`page theme-${terminal.theme} effect-${terminal.effect}`}
        style={themeStyle}
        onClick={(event) => {
          if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) {
            return;
          }

          inputRef.current?.focus();
        }}
      >
        <main className="terminal">
          <div className="terminal-toolbar" aria-hidden="true">
            <span>~/portfolio</span>
          </div>

          <WeatherNote />
          <ListeningNote />

          <div id="output" aria-live="polite">
            {terminal.output.map((item) => {
              if (item.kind === "command") {
                return (
                  <p className="terminal-command" key={item.id}>
                    <span className="terminal-prompt">{item.prompt}</span>{" "}
                    <span>{item.input}</span>
                  </p>
                );
              }

              if (item.kind === "intro" || item.kind === "text") {
                return (
                  <p className="terminal-text" key={item.id}>
                    {item.value}
                  </p>
                );
              }

              if (item.kind === "help") {
                return (
                  <dl className="terminal-help" key={item.id}>
                    {helpItems.map((helpItem) => (
                      <div key={helpItem.command}>
                        <dt>{helpItem.command}</dt>
                        <dd>{helpItem.description}</dd>
                      </div>
                    ))}
                  </dl>
                );
              }

              const Section = sections[item.name];
              return (
                <div className="terminal-response" key={item.id}>
                  <Section />
                </div>
              );
            })}
          </div>

          <form
            className="terminal-form"
            onSubmit={(event) => {
              event.preventDefault();
              terminal.run();
            }}
          >
            <label htmlFor="input">{terminal.prompt}</label>
            <input
              ref={inputRef}
              id="input"
              className={terminal.input ? "" : "is-empty"}
              value={terminal.input}
              autoFocus
              autoComplete="off"
              autoCapitalize="none"
              inputMode="text"
              spellCheck="false"
              onChange={(event) => terminal.setInput(event.target.value)}
              onKeyDown={terminal.handleKeyDown}
            />
          </form>

          <nav className="quick-commands" aria-label="Quick commands">
            {quickCommands.map((command) => (
              <button key={command} type="button" onClick={() => terminal.run(command)}>
                {command}
              </button>
            ))}
          </nav>

          <footer className="terminal-status">
            try theme blue · tab autocomplete · ↑↓ history
          </footer>
        </main>

        <BugGame />

        {terminal.effect === "manatee" ? (
          <div className="manatee-layer" aria-hidden="true">
            {manatees.map((manatee) => (
              <img
                alt=""
                className="floating-manatee"
                key={`${manatee.top}-${manatee.delay}`}
                src="/manatee-logo.png"
                style={{
                  "--delay": manatee.delay,
                  "--size": manatee.size,
                  "--top": manatee.top,
                } as React.CSSProperties}
              />
            ))}
          </div>
        ) : null}

        {terminal.overlay === "hack" && (
          <TerminalOverlay label="hack mode" variant="hack">
            <div className="hack-window">
              <div className="hack-bar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="hack-screen">
                <div className="hack-output">
                  {hackLines.map((line, index) => (
                    <p
                      className="hack-line"
                      key={line}
                      style={{
                        "--characters": line.length,
                        "--delay": `${120 + index * 430}ms`,
                      } as React.CSSProperties}
                    >
                      {line}
                    </p>
                  ))}
                  <p className="hack-prompt">
                    root@portfolio:~$ <span aria-hidden="true" />
                  </p>
                  <p className="hack-recommendation">
                    hidden route unlocked: <strong>dead end reached</strong>
                    <span>returning to savina's lair</span>
                  </p>
                </div>
              </div>
            </div>
          </TerminalOverlay>
        )}

        {terminal.overlay === "not-found" && (
          <TerminalOverlay label="404 mode" variant="not-found">
            <p className="overlay-kicker">route missing</p>
            <h1>404</h1>
            <p className="overlay-copy">
              boring portfolio not found.
            </p>
          </TerminalOverlay>
        )}
      </div>
      <Analytics />
    </>
  );
}

function TerminalOverlay({
  children,
  label,
  variant,
}: {
  children: ReactNode;
  label: string;
  variant: "hack" | "not-found";
}) {
  return (
    <div
      className={`terminal-overlay terminal-overlay-${variant}`}
      aria-label={label}
      aria-modal="true"
      role="dialog"
    >
      <div className="terminal-overlay-content">
        {children}
        <p className="overlay-escape">press esc to return</p>
      </div>
    </div>
  );
}
