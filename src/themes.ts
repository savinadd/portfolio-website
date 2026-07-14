export const themes = {
  blue: "#72c6ff",
  green: "#81ff95",
  indigo: "#8ea2ff",
  mono: "#dedede",
  orange: "#ffb86c",
  purple: "#b8a4ff",
  red: "#ff7b7b",
  violet: "#d28cff",
  yellow: "#f8e86c",
} as const;

export type Theme = keyof typeof themes;

export const themeNames = Object.keys(themes) as Theme[];
