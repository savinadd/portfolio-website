import { sections } from "./commands";
import { useTerminal } from "./useTerminal";
import { WebsiteView } from "./WebsiteView";

const quickCommands = ["about", "work", "writing", "contact", "website"];

export default function App() {
  const terminal = useTerminal();

  if (terminal.mode === "website") {
    return <WebsiteView onTerminal={() => terminal.setMode("terminal")} />;
  }

  return (
    <div className={`page theme-${terminal.theme}`}>
      <main className="terminal">
        <div id="output" aria-live="polite">
          {terminal.output.map((item) => {
            if (item.kind === "command") {
              return (
                <p className="terminal-command" key={item.id}>
                  {item.value}
                </p>
              );
            }

            if (item.kind === "intro" || item.kind === "text") {
              return <p key={item.id}>{item.value}</p>;
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
            id="input"
            value={terminal.input}
            autoFocus
            autoComplete="off"
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
          {terminal.cwd} · {terminal.theme} · tab to autocomplete · ↑↓ for history
        </footer>
      </main>
    </div>
  );
}
