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
  { delay: "0s", direction: "right", duration: "38s", midY: "12vh", size: "86px", top: "14%", endY: "-7vh" },
  { delay: "0.8s", direction: "left", duration: "44s", midY: "-10vh", size: "58px", top: "48%", endY: "8vh" },
  { delay: "1.9s", direction: "right", duration: "41s", midY: "-16vh", size: "74px", top: "72%", endY: "-4vh" },
  { delay: "3.1s", direction: "left", duration: "49s", midY: "14vh", size: "112px", top: "24%", endY: "-10vh" },
  { delay: "4.4s", direction: "right", duration: "35s", midY: "8vh", size: "52px", top: "58%", endY: "13vh" },
  { delay: "5.6s", direction: "left", duration: "42s", midY: "-18vh", size: "78px", top: "84%", endY: "-6vh" },
  { delay: "6.9s", direction: "right", duration: "46s", midY: "18vh", size: "66px", top: "32%", endY: "-12vh" },
  { delay: "8.2s", direction: "left", duration: "39s", midY: "6vh", size: "96px", top: "64%", endY: "10vh" },
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
                className={`floating-manatee floating-manatee-${manatee.direction}`}
                key={`${manatee.top}-${manatee.delay}`}
                src="/manatee-logo.png"
                style={{
                  "--delay": manatee.delay,
                  "--duration": manatee.duration,
                  "--end-y": manatee.endY,
                  "--mid-y": manatee.midY,
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
