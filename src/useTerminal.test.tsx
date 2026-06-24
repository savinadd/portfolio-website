import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTerminal } from "./useTerminal";

describe("useTerminal", () => {
  it("renders sections from direct commands", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("about"));

    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "about",
    });
  });

  it("separates command echoes from responses", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("about"));

    expect(result.current.output.at(-2)).toMatchObject({
      kind: "command",
      value: "savina@portfolio:~$ about",
    });
    expect(result.current.output.at(-1)).toMatchObject({
      kind: "section",
      name: "about",
    });
  });

  it("navigates the virtual filesystem", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("cd work"));

    expect(result.current.cwd).toBe("~/work");
    expect(result.current.prompt).toBe("savina@portfolio:~/work$");
  });

  it("switches to website mode", () => {
    const { result } = renderHook(() => useTerminal());

    act(() => result.current.run("website"));

    expect(result.current.mode).toBe("website");
  });
});
