import type { ComponentType } from "react";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { NowSection } from "./sections/NowSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { WritingSection } from "./sections/WritingSection";

export type SectionId =
  | "about"
  | "contact"
  | "education"
  | "experience"
  | "now"
  | "projects"
  | "writing";

export type SectionDefinition = {
  component: ComponentType;
  description: string;
  file: string;
  id: SectionId;
  label: string;
};

export const sectionList = [
  {
    component: AboutSection,
    description: "a little about me",
    file: "about.txt",
    id: "about",
    label: "about",
  },
  {
    component: ContactSection,
    description: "ways to reach me",
    file: "contact.txt",
    id: "contact",
    label: "contact",
  },
  {
    component: ExperienceSection,
    description: "my professional experience",
    file: "experience.txt",
    id: "experience",
    label: "experience",
  },
  {
    component: EducationSection,
    description: "my degrees",
    file: "education.txt",
    id: "education",
    label: "education",
  },
  {
    component: ProjectsSection,
    description: "github projects",
    file: "projects/",
    id: "projects",
    label: "projects",
  },
  {
    component: NowSection,
    description: "what i'm focused on at the moment",
    file: "now.txt",
    id: "now",
    label: "now",
  },
  {
    component: WritingSection,
    description: "notes and ideas (soon!)",
    file: "writing/",
    id: "writing",
    label: "writing",
  },
] satisfies SectionDefinition[];

export const sections: Record<SectionId, ComponentType> = {
  about: AboutSection,
  contact: ContactSection,
  education: EducationSection,
  experience: ExperienceSection,
  now: NowSection,
  projects: ProjectsSection,
  writing: WritingSection,
};
