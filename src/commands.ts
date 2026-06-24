import type { ComponentType } from "react";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { WorkSection } from "./sections/WorkSection";
import { WritingSection } from "./sections/WritingSection";

export const sections = {
  about: AboutSection,
  contact: ContactSection,
  education: EducationSection,
  experience: ExperienceSection,
  work: WorkSection,
  writing: WritingSection,
} satisfies Record<string, ComponentType>;

export type SectionName = keyof typeof sections;

export const commandNames = [
  "help",
  "ls",
  "pwd",
  "cd",
  "cat",
  "open",
  ...Object.keys(sections),
  "theme",
  "whoami",
  "website",
  "clear",
];

export const help = `about       a little about me
work        selected work
experience  how i work
education   what i'm learning
writing     notes and ideas
contact     ways to reach me
ls / cd     explore like a filesystem
cat / open  read or open something
theme       purple, blue, or mono
website     switch to the normal website
clear       clear the terminal`;

export const files = {
  "~": ["about.txt", "work/", "experience.txt", "education.txt", "writing/", "contact.txt"],
  "~/work": ["terminal-portfolio/"],
  "~/writing": ["notes.txt"],
} satisfies Record<string, string[]>;
