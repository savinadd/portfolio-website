import { sectionList, sections, type SectionId } from "./content";
import { themeNames } from "./themes";

export { sections };

export type SectionName = SectionId;

export type HelpItem = {
  command: string;
  description: string;
};

export const commandNames = [
  "help",
  "hi",
  "hello",
  "tour",
  "copy",
  "email",
  "github",
  "linkedin",
  "work",
  ...Object.keys(sections),
  "resume",
  "theme",
  "stars",
  "hack",
  "404",
  "whoami",
  "website",
  "clear",
];

export const helpItems: HelpItem[] = [
  ...sectionList.map((section) => ({
    command: section.id,
    description: section.description,
  })),
  { command: "hi / hello", description: "say hi" },
  { command: "tour", description: "guided walkthrough" },
  { command: "work / experience", description: "work history" },
  { command: "email", description: "show my email address" },
  { command: "github", description: "open github" },
  { command: "linkedin", description: "open linkedin" },
  { command: "copy email", description: "copy my email address" },
  { command: "resume", description: "open my resume" },
  { command: "theme", description: `${themeNames.join(", ")}, random` },
  { command: "website", description: "switch to the normal website" },
  { command: "clear", description: "clear the terminal" },
];
