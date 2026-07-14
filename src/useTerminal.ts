import { useRef, useState } from "react";
import {
  commandNames,
  sections,
  type SectionName,
} from "./commands";
import { contactLinks, email, resume } from "./profile";
import { themeNames, themes, type Theme } from "./themes";

type ViewMode = "terminal" | "website";
type TerminalEffect = "none" | "stars";
type TerminalOverlay = "hack" | "not-found" | null;

export type TerminalOutput =
  | { id: number; input: string; kind: "command"; prompt: string }
  | { id: number; kind: "help" }
  | { id: number; kind: "intro"; value: string }
  | { id: number; kind: "text"; value: string }
  | { id: number; kind: "section"; name: SectionName };

const aliases: Record<string, string> = {
  blog: "writing",
  me: "about",
  site: "website",
  work: "experience",
} satisfies Record<string, string>;

const initialOutput: TerminalOutput[] = [
  { id: 0, kind: "intro", value: "welcome! i'm savina" },
  { id: 1, kind: "intro", value: 'type "help" to see available commands' },
];

function isTheme(value: string | undefined): value is Theme {
  return value !== undefined && value in themes;
}

function isSectionName(value: string): value is SectionName {
  return value in sections;
}

function getContactLink(label: string) {
  return contactLinks.find((link) => link.label === label);
}

function openUrl(url: string) {
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    return;
  }
}

function distance(first: string, second: string) {
  const matrix = Array.from({ length: first.length + 1 }, (_, index) => [index]);

  for (let index = 0; index <= second.length; index += 1) {
    matrix[0]![index] = index;
  }

  for (let row = 1; row <= first.length; row += 1) {
    for (let column = 1; column <= second.length; column += 1) {
      const cost = first[row - 1] === second[column - 1] ? 0 : 1;

      matrix[row]![column] = Math.min(
        matrix[row - 1]![column]! + 1,
        matrix[row]![column - 1]! + 1,
        matrix[row - 1]![column - 1]! + cost,
      );
    }
  }

  return matrix[first.length]![second.length]!;
}

function suggestCommand(command: string) {
  const [suggestion, score] = commandNames
    .map((name) => [name, distance(command, name)] as const)
    .sort(([, left], [, right]) => left - right)[0] ?? ["", Infinity];

  return score <= 3 ? suggestion : undefined;
}

export function useTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<TerminalOutput[]>(initialOutput);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [effect, setEffect] = useState<TerminalEffect>("none");
  const [theme, setTheme] = useState<Theme>("purple");
  const [mode, setMode] = useState<ViewMode>("terminal");
  const [overlay, setOverlay] = useState<TerminalOverlay>(null);
  const nextOutputId = useRef(initialOutput.length);

  const prompt = "savina@portfolio:~$";

  function createText(value: string): TerminalOutput {
    return { id: nextOutputId.current++, kind: "text", value };
  }

  function createCommand(promptValue: string, inputValue: string): TerminalOutput {
    return {
      id: nextOutputId.current++,
      input: inputValue,
      kind: "command",
      prompt: promptValue,
    };
  }

  function createHelp(): TerminalOutput {
    return { id: nextOutputId.current++, kind: "help" };
  }

  function createSection(name: SectionName): TerminalOutput {
    return { id: nextOutputId.current++, kind: "section", name };
  }

  function createTour() {
    const tourStops: SectionName[] = [
      "about",
      "contact",
      "experience",
      "education",
      "projects",
    ];

    return [
      createText(`tour: ${tourStops.join(" -> ")}`),
      ...tourStops.map((stop) => createSection(stop)),
    ];
  }

  function run(value = input) {
    const raw = value.trim();
    setInput("");

    if (!raw) return;

    const [rawCommand = "", ...args] = raw.toLowerCase().split(/\s+/);
    const command = aliases[rawCommand] ?? rawCommand;

    if (command === "clear") {
      setOutput([]);
      return;
    }

    setHistory((current) => {
      const nextHistory = [...current, raw];
      setHistoryIndex(nextHistory.length);
      return nextHistory;
    });

    const nextOutput: TerminalOutput[] = [createCommand(prompt, raw)];

    if (isSectionName(command)) nextOutput.push(createSection(command));
    else if (command === "hi" || command === "hello") nextOutput.push(createText("hey!"));
    else if (command === "tour") nextOutput.push(...createTour());
    else if (command === "help") nextOutput.push(createHelp());
    else if (command === "copy" && args[0] === "email") {
      if (!email) {
        nextOutput.push(createText("email is not configured yet"));
      } else if (!navigator.clipboard) {
        nextOutput.push(createText(`email: ${email}`));
      } else {
        void navigator.clipboard.writeText(email);
        nextOutput.push(createText("copied email"));
      }
    } else if (command === "email") {
      nextOutput.push(
        createText(email ? `email: ${email}` : "email is not configured yet"),
      );
    } else if (command === "github" || command === "linkedin") {
      const link = getContactLink(command);

      if (link) {
        openUrl(link.href);
        nextOutput.push(createText(`opening ${command}: ${link.href}`));
      } else {
        nextOutput.push(createText(`${command} is not configured yet`));
      }
    } else if (command === "resume") {
      if (!resume.href) {
        nextOutput.push(createText("resume is not configured yet"));
      } else {
        openUrl(resume.href);
        nextOutput.push(createText("opening resume"));
      }
    } else if (command === "theme") {
      const nextTheme = args[0];

      if (nextTheme === "random") {
        const choices = themeNames.filter((themeName) => themeName !== theme);
        const randomTheme = choices[Math.floor(Math.random() * choices.length)] ?? theme;
        setTheme(randomTheme);
        nextOutput.push(createText(`theme: ${randomTheme}`));
      } else if (isTheme(nextTheme)) setTheme(nextTheme);
      else nextOutput.push(createText(`themes: ${themeNames.join("  ")}`));
    } else if (command === "stars") {
      const nextEffect = effect === "stars" ? "none" : "stars";
      setEffect(nextEffect);
      nextOutput.push(
        createText(nextEffect === "stars" ? "stars enabled" : "stars disabled"),
      );
    } else if (command === "hack") {
      setOverlay("hack");
    } else if (command === "404") {
      setOverlay("not-found");
    } else if (command === "whoami") {
      nextOutput.push(createText("savina — developer, learner, and maker"));
    } else if (command === "website") {
      setMode("website");
    } else {
      const suggestion = suggestCommand(command);
      const message = suggestion
        ? `command not found: ${command}\ndid you mean "${suggestion}"?`
        : `command not found: ${command}\ntype "help" to see available commands`;

      nextOutput.push(createText(message));
    }

    setOutput((current) => [...current, ...nextOutput]);
  }

  function closeOverlay() {
    setOverlay(null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp" && historyIndex > 0) {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
    } else if (event.key === "Tab") {
      event.preventDefault();
      const matches = commandNames.filter((name) => name.startsWith(input));

      if (matches.length === 1) setInput(matches[0] ?? "");
      else if (matches.length > 1) {
        setOutput((current) => [...current, createText(matches.join("  "))]);
      }
    }
  }

  return {
    closeOverlay,
    effect,
    handleKeyDown,
    input,
    mode,
    output,
    overlay,
    prompt,
    run,
    setInput,
    setMode,
    theme,
  };
}
