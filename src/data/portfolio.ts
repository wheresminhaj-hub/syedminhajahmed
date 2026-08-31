/**
 * ============================================================
 *  CENTRAL CONFIGURATION — edit these five values only.
 * ============================================================
 */
export const LINKS = {
  YOUR_GITHUB_URL: "https://github.com/",
  YOUR_LINKEDIN_URL: "https://www.linkedin.com/",
  YOUR_EMAIL: "hello@example.com",
  NUTRICODE_PROJECT_URL: "",
  NEXUS_HEPTA_PROJECT_URL: "",
} as const;

export const PERSON = {
  name: "Syed Minhaj Ahmed",
  shortMark: "SMA.",
  eyebrow: "Computer Science × Machine Learning",
  program: "Computer Science & Machine Learning",
  college: "Vaagdevi College of Engineering",
  year: "3rd Year",
  statement:
    "I ENGINEER DIGITAL INFRASTRUCTURE WHERE HIGH-PERFORMANCE LOGIC MEETS ELEGANT INTERFACES.",
  intro:
    "I don't just build applications — I design systems that think, scale, and feel effortless to use. From intelligent ML pipelines to polished user interfaces, every project is built to perform and communicate clearly.",
  positioning: [
    "AI/ML",
    "Systems Engineering",
    "High-Performance Logic",
    "Elegant Interfaces",
  ],
  focus: "AI / ML / Systems Engineering",
} as const;

export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export const ABOUT = {
  heading: "Engineering systems that perform as well as they communicate.",
  paragraphs: [
    "I'm Syed Minhaj Ahmed, a third-year Computer Science and Machine Learning student at Vaagdevi College of Engineering. I approach software as infrastructure: reliable backends, thoughtful interfaces, and intelligent logic working together as one system.",
    "Whether it's an AI-powered food analysis pipeline or a documentation copilot for academic accreditation, I focus on building products where performance, clarity, and usability are inseparable.",
  ],
  networkNodes: ["AI", "ML", "INFRASTRUCTURE", "ELEGANT UI"],
} as const;

export type Project = {
  id: string;
  index: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  overview: string;
  problem: string;
  solution: string;
  howItWorks: string[];
  workflow: string[];
  features: string[];
  concepts?: string[];
  useCases?: string[];
  tech: string[];
  url: string;
  disclaimer?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "nutricode",
    index: "01",
    label: "01 / NUTRICODE",
    title: "NutriCode",
    subtitle: "Understand what's inside your food.",
    description:
      "NutriCode is an intelligent food-product analysis application that scans the barcode of food products and helps users understand the ingredients, preservatives, additives, potential concerns, and dietary compatibility of the product.",
    overview:
      "An intelligent food-product analysis application built around a single interaction: scan a barcode, understand the product. NutriCode turns dense ingredient panels into structured, readable information.",
    problem:
      "Food labels are dense, inconsistent, and written for compliance rather than comprehension. Most people cannot tell which additives or preservatives are in a product, or whether it fits their dietary preferences.",
    solution:
      "NutriCode reads the product barcode, analyzes the available product information, and presents ingredients, additives, preservatives, potential concerns, health rating, and dietary compatibility in an understandable format — along with natural product alternatives.",
    howItWorks: ["SCAN", "ANALYZE", "UNDERSTAND", "CHOOSE"],
    workflow: [
      "The user scans a food-product barcode.",
      "NutriCode analyzes the available product information.",
      "Ingredients, additives and preservatives are broken down and flagged where relevant.",
      "Results are presented as understandable guidance, with dietary compatibility and alternatives.",
    ],
    features: [
      "Barcode scanning",
      "Food-product analysis",
      "Ingredient analysis",
      "Preservative detection",
      "Additive detection",
      "Identification of potentially concerning additives",
      "Identification of potentially concerning preservatives",
      "Health rating based on available product information",
      "Health-risk information",
      "Natural product alternatives",
      "Informed-choice support",
      "Dietary preferences",
      "Vegan compatibility",
      "Gluten-free compatibility",
      "Allergy-aware information",
    ],
    tech: [
      "AI / ML",
      "Computer Vision",
      "Barcode Scanning",
      "Data Analysis",
      "Health Technology",
    ],
    url: LINKS.NUTRICODE_PROJECT_URL,
    disclaimer:
      "NutriCode is an informational and decision-support tool and is not a medical diagnosis system. Results reflect potential concerns and associated health risks based on available product information. If you have specific health concerns, consult a qualified professional.",
  },
  {
    id: "nexus-hepta",
    index: "02",
    label: "02 / NEXUS HEPTA AI",
    title: "Nexus Hepta AI",
    subtitle: "AI documentation and accreditation copilot.",
    description:
      "Nexus Hepta AI is an AI-powered documentation and accreditation copilot designed for faculty and people who work with, classify, verify, and manage academic documentation.",
    overview:
      "A real AI product built for the people who work, classify, and verify. Nexus Hepta AI reduces manual documentation effort while maintaining high-standard classification, organization, verification, and provenance.",
    problem:
      "Academic and accreditation documentation is manual, repetitive, and scattered. Classification is inconsistent, verification is slow, and the trail of where a document came from is easily lost.",
    solution:
      "An AI copilot that collects documentation, classifies it to a high standard, supports verification, and maintains provenance — with intelligent search across connected documents.",
    howItWorks: ["COLLECT", "CLASSIFY", "VERIFY", "TRACE"],
    workflow: [
      "Documentation is collected from faculty, meetings, assignments and academic processes.",
      "AI classifies each document into a high-standard structure.",
      "Documents move through verification with reviewable state.",
      "Provenance chains keep every document traceable and searchable.",
    ],
    features: [
      "AI-assisted documentation",
      "Document organization",
      "Classification",
      "Verification",
      "Intelligent search",
      "Provenance",
      "Information management",
      "Reduced manual documentation effort",
      "Accreditation support",
    ],
    concepts: [
      "AI DOCUMENTATION",
      "ACCREDITATION COPILOT",
      "HIGH-STANDARD CLASSIFICATION",
      "VERIFICATION",
      "PROVENANCE",
      "INTELLIGENT SEARCH",
      "AUTOMATION",
    ],
    useCases: [
      "Faculty documentation",
      "Meeting documentation",
      "Assignment-related documentation",
      "Academic documentation",
    ],
    tech: [
      "Artificial Intelligence",
      "NLP",
      "Automation",
      "Documentation",
      "Classification",
      "Provenance",
      "Productivity",
    ],
    url: LINKS.NEXUS_HEPTA_PROJECT_URL,
  },
];

export const SKILL_GROUPS = [
  {
    group: "Programming",
    items: [
      { name: "Python", note: "Primary language for ML experiments and scripting." },
      { name: "Java", note: "Object-oriented programming and application logic." },
      { name: "JavaScript", note: "Interactive interfaces and application behaviour." },
      { name: "HTML", note: "Semantic structure for web interfaces." },
      { name: "CSS", note: "Layout, responsive design and visual systems." },
    ],
  },
  {
    group: "AI / Machine Learning",
    items: [
      { name: "Artificial Intelligence", note: "Designing systems that reason over information." },
      { name: "Machine Learning", note: "Models, training data and evaluation." },
      { name: "Natural Language Processing", note: "Working with text, classification and meaning." },
      { name: "Computer Vision", note: "Extracting structure from images and scans." },
      { name: "Data Analysis", note: "Turning raw data into usable insight." },
    ],
  },
  {
    group: "Development",
    items: [
      { name: "Web Development", note: "Building responsive, usable web applications." },
      { name: "Application Development", note: "Taking ideas from concept to working apps." },
      { name: "APIs", note: "Connecting systems and services together." },
      { name: "Database Fundamentals", note: "Structuring and querying persistent data." },
    ],
  },
] as const;

export const EDUCATION = [
  {
    institution: "VAAGDEVI COLLEGE OF ENGINEERING",
    program: "Computer Science & Machine Learning",
    stage: "3rd Year",
    description:
      "Current academic journey focused on computer science, machine learning, software development, and practical problem solving.",
  },
] as const;

export const WHAT_I_BUILD = [
  {
    title: "DIGITAL INFRASTRUCTURE",
    text: "Engineering systems, not just apps — robust backends, smart pipelines, and connected experiences.",
  },
  {
    title: "HIGH-PERFORMANCE LOGIC",
    text: "Designing code that scales, reasons, and delivers results under real-world conditions.",
  },
  {
    title: "ELEGANT INTERFACES",
    text: "Crafting interfaces that make complex systems feel simple, fast, and human.",
  },
  {
    title: "INTELLIGENT SYSTEMS",
    text: "Combining AI/ML with solid engineering to build products that think and adapt.",
  },
] as const;

export const CONTACT = {
  heading: "Have a system worth building?",
  support: "Let's engineer it together.",
} as const;
