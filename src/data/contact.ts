import { resume } from "./resume";

export type ContactLink = {
  href: string;
  label: string;
  value: string;
};

export const email = "savina.dimitrov@gmail.com";

export const contactLinks: ContactLink[] = [
  {
    href: `mailto:${email}`,
    label: "email",
    value: email,
  },
  {
    href: "https://github.com/savinadd",
    label: "github",
    value: "github.com/savinadd",
  },
  {
    href: "https://www.linkedin.com/in/savinadimitrov/",
    label: "linkedin",
    value: "linkedin.com/in/savinadimitrov",
  },
  resume,
];
