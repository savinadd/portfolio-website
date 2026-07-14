export type Job = {
  bullets: string[];
  company: string;
  summary: string;
  period: string;
  role: string;
};

export const jobs: Job[] = [
  {
    bullets: [
      "building enterprise AI support solutions leveraging Retrieval-Augmented Generation (RAG) pipelines on SAP AI Core within SAP Business Technology Platform (BTP), enabling scalable knowledge retrieval across internal engineering documentation",
      "enhancing document grounding workflows including embedding generation, indexing, retrieval, and ranking, increasing retrieval relevance and improving reliability of AI-generated responses",
      "provisioning and maintaining cloud-native infrastructure within Kyma and Kubernetes environments on SAP BTP, supporting scalable deployment and platform stability"
    ],
    company: "SAP",
    period: "Nov 2025 - Present",
    role: "Cloud AI Developer II",
    summary: "Working on AI and cloud tooling for internal engineering teams.",
  },
  {
    bullets: [
      "delivered a business-critical XSLT transformation tool for converting local e-invoicing formats into UBL standards, streamlining document-processing workflows for 40+ engineers",
      "contributed to frontend and backend application functionality using SAP UI5, TypeScript, and Java within enterprise cloud environments",
      "executed scalability and performance validation using JMeter to verify application reliability under production-level workloads"
    ],
    company: "SAP",
    period: "June 2024 - Oct 2025",
    role: "Cloud Developer Intern",
    summary: "Built and tested enterprise cloud features across frontend and backend work.",
  },
  {
    bullets: [
      "modernizing the native z/OS IPCS system for z/OS dump debugging used by 300+ System Z engineers",
      "built z/OS command-processing formatters and visualization features that increased adoption among international engineering teams",
    ],
    company: "IBM",
    period: "June 2023 - Dec 2023",
    role: "z/OS Tools Developer",
    summary: "Worked on tooling for mainframe debugging and command processing.",
  },
];
