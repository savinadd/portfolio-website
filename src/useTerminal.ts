import { useMemo, useRef, useState } from "react";
import {
  commandNames,
  files,
  help,
  sections,
  type SectionName,
} from "./commands";

type Theme = "purple" | "blue" | "mono";
type ViewMode = "terminal" | "website";

export type TerminalOutput =
  | { id: number; kind: "command"; value: string }
  | { id: number; kind: "intro"; value: string }
  | { id: number; kind: "text"; value: string }
  | { id: number; kind: "section"; name: SectionName };

const themes: Theme[] = ["purple", "blue", "mono"];

const initialOutput: TerminalOutput[] = [
  { id: 0, kind: "intro", value: "welcome! i'm savina" },
  { id: 1, kind: "intro", value: 'type "help" to see available commands' },
];

function isTheme(value: string | undefined): value is Theme {
  return value !== undefined && themes.includes(value as Theme);
}

function isSectionName(value: string): value is SectionName {
  return value in sections;
}

export function useTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<TerminalOutput[]>(initialOutput);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [cwd, setCwd] = useState<keyof typeof files>("~");
  const [theme, setTheme] = useState<Theme>("purple");
  const [mode, setMode] = useState<ViewMode>("terminal");
  const nextOutputId = useRef(initialOutput.length);

  const prompt = useMemo(() => `savina@portfolio:${cwd}$`, [cwd]);

  function createText(value: string): TerminalOutput {
    return { id: nextOutputId.current++, kind: "text", value };
  }

  function createCommand(value: string): TerminalOutput {
    return { id: nextOutputId.current++, kind: "command", value };
  }

  function createSection(name: SectionName): TerminalOutput {
    return { id: nextOutputId.current++, kind: "section", name };
  }

  function resolveSection(value: string): SectionName | undefined {
    const normalized = value.replace(/\.txt$|\.log$|\.sh$|\//g, "");

    if (normalized === "notes") return "writing";
    if (normalized === "terminal-portfolio") return "work";
    if (isSectionName(normalized)) return normalized;
  }

  function changeDirectory(target = "~") {
    if (target === "~" || target === "..") {
      setCwd("~");
      return [];
    }

    const path = `~/${target.replace(/\/$/, "")}` as keyof typeof files;

    if (path in files) {
      setCwd(path);
      return [];
    }

    return [createText(`cd: no such directory: ${target}`)];
  }

  function run(value = input) {
    const raw = value.trim();
    setInput("");

    if (!raw) return;

    const [command = "", ...args] = raw.toLowerCase().split(/\s+/);

    if (command === "clear") {
      setOutput([]);
      return;
    }

    setHistory((current) => {
      const nextHistory = [...current, raw];
      setHistoryIndex(nextHistory.length);
      return nextHistory;
    });

    const nextOutput: TerminalOutput[] = [createCommand(`${prompt} ${raw}`)];

    if (isSectionName(command)) nextOutput.push(createSection(command));
    else if (command === "help") nextOutput.push(createText(help));
    else if (command === "ls") nextOutput.push(createText(files[cwd].join("  ")));
    else if (command === "pwd") nextOutput.push(createText(cwd.replace("~", "/home/savina")));
    else if (command === "cd") nextOutput.push(...changeDirectory(args[0]));
    else if (command === "cat" || command === "open") {
      const section = resolveSection(args[0] ?? "");
      nextOutput.push(section ? createSection(section) : createText(`${command}: nothing found`));
    } else if (command === "theme") {
      const nextTheme = args[0];

      if (isTheme(nextTheme)) setTheme(nextTheme);
      else nextOutput.push(createText(`themes: ${themes.join("  ")}`));
    } else if (command === "whoami") {
      nextOutput.push(createText("savina — developer, learner, and maker"));
    } else if (command === "website") {
      setMode("website");
    } else {
      nextOutput.push(createText(`command not found: ${command}`));
    }

    setOutput((current) => [...current, ...nextOutput]);
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
    cwd,
    handleKeyDown,
    input,
    mode,
    output,
    prompt,
    run,
    setInput,
    setMode,
    theme,
  };
}
