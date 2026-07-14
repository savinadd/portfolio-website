export type Project = {
  description: string;
  href?: string;
  name: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    description: "This site, including the terminal version and the regular website view.",
    href: "https://github.com/savinadd/portfolio-website",
    name: "Portfolio Website",
    stack: ["React", "TypeScript", "Vite"],
  },
  {
    description: "A C++ thesis project exploring compression algorithms for genomic sequences.",
    href: "https://github.com/savinadd/Algorithms-for-Genomic-Compression",
    name: "Computer Science Bachelor's Thesis: Algorithms for Genomic Compression",
    stack: ["C++"],
  },
  {
    description: "A healthcare app for appointments, prescriptions, profiles, and real-time chat.",
    href: "https://github.com/savinadd/Mediconnect",
    name: "Information Systems Bachelor's Thesis: Mediconnect",
    stack: ["React", "ExpressJS", "PostgreSQL", "WebSockets"],
  },
];
