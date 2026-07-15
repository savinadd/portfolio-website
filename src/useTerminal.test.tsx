import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { themeNames } from "./themes";
import { type TerminalOutput, useTerminal } from "./useTerminal";

type SectionOutput = Extract<TerminalOutput, { kind: "section" }>;

describe("useTerminal", () => {
  beforeEach(() => {
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders sections from direct commands", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("about"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "about",
    });
  });

  it("routes work to experience", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("work"));

    expect(result.current.output.at(-2)).toMatchObject({
      input: "work",
      kind: "command",
    });
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "experience",
    });
  });

  it("separates command echoes from responses", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("about"));

    expect(result.current.output.at(-2)).toMatchObject({
      input: "about",
      kind: "command",
      prompt: "savina@portfolio:~$",
    });
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "about",
    });
  });

  it("renders help as structured output", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("help"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "help",
    });
  });

  it("switches to website mode", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("website"));

    expect(result.current.mode).toBe("website");
  });

  it("suggests a likely command for invalid input", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("abot"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: 'command not found: abot\ndid you mean "about"?',
    });
  });

  it("supports simple command aliases", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("me"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "about",
    });
  });

  it("renders projects as its own section", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("projects"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "projects",
    });
  });

  it("opens the configured resume", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("resume"));

    expect(window.open).toHaveBeenCalledWith(
      "https://docs.google.com/document/d/1XQmUhwWa2FkSZRyMQfCfM11ZwFbwj0eLtaKhqCiejWQ/edit?usp=sharing",
      "_blank",
      "noopener,noreferrer",
    );
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: "opening resume",
    });
  });

  it("shows the email when clipboard is unavailable", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("copy email"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: "email: savina.dimitrov@gmail.com",
    });
  });

  it.each(["hi", "hello"])("responds to %s", (command) => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run(command));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: "hey!",
    });
  });

  it("runs a guided tour through the main sections", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("tour"));

    const sectionNames = result.current.output
      .filter((item): item is SectionOutput => item.kind === "section")
      .map((item) => item.name);

    expect(sectionNames.slice(-5)).toEqual([
      "about",
      "contact",
      "experience",
      "education",
      "projects",
    ]);
  });

  it.each([
    ["email", "email: savina.dimitrov@gmail.com"],
    ["github", "opening github: https://github.com/savinadd"],
    ["linkedin", "opening linkedin: https://www.linkedin.com/in/savinadimitrov/"],
  ])("handles the %s command", (command, value) => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run(command));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value,
    });
  });

  it("supports a random theme", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("theme random"));

    expect(themeNames).toContain(result.current.theme);
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: expect.stringMatching(/^theme: /),
    });
  });

  it("toggles the stars effect", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("stars"));

    expect(result.current.effect).toBe("stars");
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: "stars enabled",
    });

    act(() => result.current.run("stars"));

    expect(result.current.effect).toBe("none");
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: "stars disabled",
    });
  });

  it("enables manatee mode", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("manatee"));

    expect(result.current.effect).toBe("manatee");
    expect(result.current.theme).toBe("manatee");
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "text",
      value: "ocean mode enabled. manatees are drifting through. 'clear' to go back.",
    });
  });

  it("clears the terminal and resets visual effects", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("manatee"));
    act(() => result.current.run("clear"));

    expect(result.current.output).toEqual([]);
    expect(result.current.effect).toBe("none");
    expect(result.current.theme).toBe("purple");
  });

  it.each([
    ["hack", "hack"],
    ["404", "not-found"],
  ])("opens the %s overlay", (command, overlay) => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run(command));

    expect(result.current.overlay).toBe(overlay);
    expect(result.current.output.at(-1)).toMatchObject({
      input: command,
      kind: "command",
    });

    act(() => result.current.closeOverlay());

    expect(result.current.overlay).toBeNull();
  });

  it.each(["red", "orange", "yellow", "green", "blue", "indigo", "violet"])(
    "supports the %s theme",
    (theme) => {
      const { result } = renderHook(() => useTerminal());

      act(() => result.current.run(`theme ${theme}`));

      expect(result.current.theme).toBe(theme);
    },
  );
});
