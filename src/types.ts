export interface Profile {
  name: string;
  role: string;
  bio: string;
  location: string;
  phone: string;
  avatarEmoji: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  email: string;
  yearsExperience: number;
  completedProjects: number;
  happyClients: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string; // Lucide icon identifier
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  category: "web" | "mobile" | "backend" | "all";
  language: string;
  description: string;
  fullDetails: string;
  icon: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
  architecture: string[];
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
}

export interface BlogPost {
  id: string;
  projectId: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  learning: string;
  readTime: string;
  icon: string;
  imageUrl: string;
  stack: string;
  liveUrl: string;
  githubUrl: string;
  highlights: string[];
}

function insightFromProject(
  projectId: string,
  fields: Omit<
    BlogPost,
    "id" | "projectId" | "icon" | "imageUrl" | "stack" | "liveUrl" | "githubUrl" | "highlights"
  >
): BlogPost {
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    throw new Error(`Project not found for insight: ${projectId}`);
  }
  return {
    id: `insight-${projectId}`,
    projectId,
    icon: project.icon,
    imageUrl: project.imageUrl,
    stack: project.language,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    highlights: project.architecture,
    ...fields,
  };
}

export const INITIAL_PROFILE: Profile = {
  name: "Myat Kaung Khant",
  role: "Junior Developer & Full Stack Developer",
  bio: "Junior full stack developer based in East London. I build responsive, high-performance web and mobile products with clean architecture and thoughtful user experience.",
  location: "London, East London",
  phone: "+44 7774414594",
  avatarEmoji: "⚡",
  githubUrl: "https://github.com/mkkbun",
  linkedinUrl: "https://linkedin.com/in/",
  twitterUrl: "https://twitter.com/",
  email: "myatkaungkhant022@gmail.com",
  yearsExperience: 2,
  completedProjects: 10,
  happyClients: 8,
};

export const PROJECTS: Project[] = [
  {
    id: "ai-patient-assistant",
    title: "UK AI Patient Assistant",
    category: "web",
    language: "React · Express · Gemini · Multi-Tenant Healthcare",
    description:
      "Engineered a full-stack AI patient assistant for UK clinics—dental, GP, and private—using React, Express, and Gemini. The platform delivers compliant receptionist chat with safety guardrails, voice support, multi-tenant configuration, and real-time intent telemetry for safe, scalable healthcare automation.",
    fullDetails:
      "Agency-grade SaaS for UK healthcare: embeddable patient web widgets, tenant-specific clinic profiles, service catalogues, and a live AI inspection console with intent telemetry (booking leads, medical warnings, CRM escalation). Powered by Gemini with UK compliance guardrails, GDPR-aware flows, and voice-enabled concierge chat.",
    icon: "🏥",
    imageUrl: "/projects/ai-patient-assistant.png",
    liveUrl: "https://ai-chatbot-patient-assistant.onrender.com/",
    githubUrl: "https://github.com/mkkbun/AI-Chatbot-Patient-Assistant",
    architecture: [
      "Multi-Tenant Clinic Profiles",
      "Gemini AI Receptionist Chat",
      "UK Compliance & Safety Guardrails",
      "Real-Time Intent Telemetry",
    ],
  },
  {
    id: "pos-inventory",
    title: "Apex POS & Inventory",
    category: "web",
    language: "React · TypeScript · Express · JWT · Tailwind",
    description:
      "A full-stack POS and inventory platform for multi-branch retail—real-time stock alerts, checkout, loyalty CRM, supplier purchase orders, and financial analytics. Built with React, TypeScript, and Express; secured with JWT roles; live on Render.",
    fullDetails:
      "Apex POS unifies retail operations in one interface: fast POS checkout with discounts, tax, and loyalty points; multi-branch inventory with transfers, adjustments, and low-stock alerts; supplier purchase orders; customer CRM; and financial analytics with optional Gemini AI insights. Role-based JWT auth (Admin, Manager, Cashier), real-time SSE notifications, and seeded demo data across 3 branches—deployed on Render.",
    icon: "🏪",
    imageUrl: "/projects/pos-inventory.png",
    liveUrl: "https://pos-inventory-app-bm8u.onrender.com/",
    githubUrl: "https://github.com/mkkbun/POS-Inventory-Management-System",
    architecture: [
      "Multi-Branch POS Checkout",
      "Real-Time Stock Alerts (SSE)",
      "JWT Role-Based Access Control",
      "Supplier POs & Financial Analytics",
    ],
  },
  {
    id: "edutrack",
    title: "EduTrack",
    category: "web",
    language: "React · TypeScript · Tailwind · Faculty Portal",
    description:
      "Academic attendance platform with dual teacher and student portals—KPI dashboards, course attendance rates, color-coded check-ins, ledgers, and CSV export.",
    fullDetails:
      "EduTrack gives faculty a command center for classes, rosters, bulk enrollment, and reports while students self check-in and track progress. Deployed on Google Cloud Run with seeded demo data for instant review.",
    icon: "🎓",
    imageUrl: "/projects/edutrack.png",
    liveUrl: "https://edutrack-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/EduTrack",
    architecture: ["Dual Teacher & Student Portals", "Live Attendance KPI Dashboard", "Course Rate Analytics", "CSV Export & Bulk Enroll"],
  },
  {
    id: "envault-cli",
    title: "Envault CLI",
    category: "backend",
    language: "TypeScript · Node.js · AES-256 · OS Keychain",
    description:
      "Secure secrets manager with a CLI and studio UI—encrypt env vars with AES-256-GCM, sync profiles across dev/staging/prod, and integrate with native OS keychains.",
    fullDetails:
      "Envault bundles a TypeScript CLI (CJS/ESM via tsup) with a vault dashboard for managing project secrets, PBKDF2-derived keys, and audited export/import flows protected by macOS Keychain and Linux Secret Service.",
    icon: "🔐",
    imageUrl: "/projects/envault-cli.png",
    liveUrl: "https://envault-cli-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/envault-cli",
    architecture: ["AES-256-GCM Vault Encryption", "Multi-Profile CLI Targets", "OS Keychain Integration", "PBKDF2 Key Derivation"],
  },
  {
    id: "saas-dashboard",
    title: "SaaS Management Portal",
    category: "web",
    language: "React · TypeScript · Charts · Multi-Tenant",
    description:
      "Multi-tenant SaaS admin console tracking MRR, active users, and churn with live telemetry charts and a real-time workspace activity audit stream.",
    fullDetails:
      "Production-style management portal with tenant switching, subscription status, historical metric rollups, and pulsing live audit events for billing, projects, and authentication.",
    icon: "📈",
    imageUrl: "/projects/saas-dashboard.png",
    liveUrl: "https://saas-dashboard-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/saas-dashboard",
    architecture: ["Tenant-Scoped Metrics", "Realtime Activity Feed", "MRR & Churn KPIs", "Responsive Dark UI"],
  },
  {
    id: "forge-ui",
    title: "Forge UI Design System",
    category: "web",
    language: "React · TypeScript · Tailwind · WCAG 2.1",
    description:
      "Accessible component library with 20+ primitives, live playground sandbox, global design tokens, and seven polished button variants.",
    fullDetails:
      "Forge UI documents polymorphic components with Storybook-style galleries, configurable border-radius tokens, and interactive hooks testing for theme and responsive breakpoints.",
    icon: "🧩",
    imageUrl: "/projects/forge-ui.png",
    liveUrl: "https://forge-ui-component-library-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/forge-ui-component-library",
    architecture: ["Atomic CSS Variables", "Component Playground", "WCAG 2.1 AA Patterns", "Theme Token Manager"],
  },
  {
    id: "collaboration-workspace",
    title: "Synapse Collaboration Workspace",
    category: "web",
    language: "React · Socket.io · Kanban · Real-Time",
    description:
      "Real-time Kanban workspace with drag-and-drop boards, teammate invites, and instant collaboration sync across product roadmap columns.",
    fullDetails:
      "Synapse Workspace ships collaborative boards from To Do through Shipped, label-driven work cards, and live status indicators powered by Socket.io room synchronization.",
    icon: "🔄",
    imageUrl: "/projects/collaboration-workspace.png",
    liveUrl: "https://real-time-collaboration-workspace-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/Real-Time-Collaboration-Workspace",
    architecture: ["Socket.io Room Sync", "Kanban Column Flow", "Label & Assignee Cards", "Invite Teammate Flow"],
  },
  {
    id: "analytics-dashboard",
    title: "Nexus Telemetry Analytics",
    category: "web",
    language: "React · Charts · Event Stream · TypeScript",
    description:
      "Unified analytics suite with live pageview feeds, conversion funnels, device breakdowns, and exportable event aggregates over custom date ranges.",
    fullDetails:
      "Nexus Telemetry surfaces gross pageviews, unique visitors, bounce rate, and session duration with area charts, donut device splits, and reloadable aggregate pipelines.",
    icon: "📊",
    imageUrl: "/projects/analytics-dashboard.png",
    liveUrl: "https://analytics-dashboard-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/analytics-dashboard",
    architecture: ["Live Realtime Feed", "Time-Range Aggregates", "Device Classification Charts", "Event Export Pipeline"],
  },
  {
    id: "ecommerce",
    title: "Nexus E-Commerce Platform",
    category: "web",
    language: "React · Full-Stack · Catalog · Checkout",
    description:
      "Premium dark-mode storefront with featured product grids, category navigation, price filters, and a conversion-focused shop-now experience.",
    fullDetails:
      "Full-stack commerce UI showcasing hero merchandising, wishlist-ready product cards, collection browsing, and modular catalog components built for scalable inventory.",
    icon: "🛒",
    imageUrl: "/projects/ecommerce.png",
    liveUrl: "https://full-stack-e-commerce-platform-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/Full-Stack-E-Commerce-Platform",
    architecture: ["Featured Product Grid", "Category Navigation", "Price Filter Controls", "Responsive Merch Hero"],
  },
  {
    id: "job-board-api",
    title: "Job Board API Workspace",
    category: "backend",
    language: "Fastify · Prisma · Redis · BullMQ · JWT",
    description:
      "Enterprise backend console with OpenAPI sandbox, Postgres explorer, BullMQ queue monitor, Jest tests, and sliding-window Redis rate limiting.",
    fullDetails:
      "Production-grade Fastify TypeScript API featuring modular CRUD, bcrypt auth, RS256 JWT sessions, Prisma on PostgreSQL, background email workers, and an interactive Swagger emulator.",
    icon: "⚙️",
    imageUrl: "/projects/job-board-api.png",
    liveUrl: "https://job-board-api-workspace-668971334330.europe-west2.run.app/",
    githubUrl: "https://github.com/mkkbun/Job-Board-API-Workspace",
    architecture: ["Fastify + OpenAPI Sandbox", "Prisma PostgreSQL Layer", "BullMQ Email Workers", "Redis Sliding Rate Limiter"],
  },
];

type SkillBucket = "frontend" | "backend" | "data" | "ai";

const PROJECT_TECH: { match: RegExp; skill: string; bucket: SkillBucket }[] = [
  { match: /\breact\b/i, skill: "React", bucket: "frontend" },
  { match: /\btypescript\b/i, skill: "TypeScript", bucket: "frontend" },
  { match: /\btailwind\b/i, skill: "Tailwind CSS", bucket: "frontend" },
  { match: /\bnode\.?js\b/i, skill: "Node.js", bucket: "backend" },
  { match: /\bexpress\b/i, skill: "Express", bucket: "backend" },
  { match: /\bfastify\b/i, skill: "Fastify", bucket: "backend" },
  { match: /\bopenapi\b|swagger/i, skill: "OpenAPI", bucket: "backend" },
  { match: /\bjwt\b/i, skill: "JWT", bucket: "backend" },
  { match: /\bjest\b/i, skill: "Jest", bucket: "backend" },
  { match: /\bbcrypt\b/i, skill: "bcrypt", bucket: "backend" },
  { match: /\btsup\b/i, skill: "tsup", bucket: "backend" },
  { match: /\baes-256\b/i, skill: "AES-256-GCM", bucket: "backend" },
  { match: /\bpbkdf2\b/i, skill: "PBKDF2", bucket: "backend" },
  { match: /\bprisma\b/i, skill: "Prisma ORM", bucket: "data" },
  { match: /\bpostgres/i, skill: "PostgreSQL", bucket: "data" },
  { match: /\bredis\b/i, skill: "Redis", bucket: "data" },
  { match: /\bbullmq\b/i, skill: "BullMQ", bucket: "data" },
  { match: /\bgemini\b/i, skill: "Gemini", bucket: "ai" },
  { match: /\bsocket\.?io\b/i, skill: "Socket.io", bucket: "ai" },
  { match: /\bgoogle cloud run\b|cloud run/i, skill: "Google Cloud Run", bucket: "ai" },
  { match: /\bmulti-tenant\b/i, skill: "Multi-Tenant Architecture", bucket: "ai" },
];

export function projectSkillBlob(project: Project): string {
  return [project.language, project.description, project.fullDetails, ...project.architecture].join(" ");
}

function buildSkillCategoriesFromProjects(projects: Project[]): SkillCategory[] {
  const buckets: Record<SkillBucket, Set<string>> = {
    frontend: new Set(),
    backend: new Set(),
    data: new Set(),
    ai: new Set(),
  };

  for (const project of projects) {
    const blob = projectSkillBlob(project);
    for (const { match, skill, bucket } of PROJECT_TECH) {
      if (match.test(blob)) buckets[bucket].add(skill);
    }
  }

  const sorted = (skills: string[]) => [...skills].sort((a, b) => a.localeCompare(b));

  return [
    { id: "frontend", title: "Frontend & UI", icon: "Layout", skills: sorted([...buckets.frontend]) },
    { id: "backend", title: "Backend & APIs", icon: "Server", skills: sorted([...buckets.backend]) },
    { id: "data", title: "Data & Queues", icon: "Database", skills: sorted([...buckets.data]) },
    { id: "ai", title: "AI & Real-Time", icon: "Sparkles", skills: sorted([...buckets.ai]) },
  ].filter((cat) => cat.skills.length > 0);
}

export const SKILL_CATEGORIES: SkillCategory[] = buildSkillCategoriesFromProjects(PROJECTS);

export function projectsUsingSkill(skill: string, projects: Project[] = PROJECTS): string[] {
  const entry = PROJECT_TECH.find((t) => t.skill === skill);
  if (!entry) return [];
  return projects.filter((p) => entry.match.test(projectSkillBlob(p))).map((p) => p.title);
}

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-senior",
    period: "2024 — PRESENT",
    role: "Senior Full-Stack Engineer",
    company: "Stripe-Alliance Labs",
    location: "San Francisco / Hybrid",
    description: "Lead developers on critical customer analytics screens. Modernized frontends to strict Tailwind + standard React states, speeding up page interactions by 45%. Oversaw container migrations, CI processes, and Prisma schema definitions.",
    tags: ["React Space", "TypeScript Core", "Next.js 15", "Prisma ORM", "SQL Indexing"],
  },
  {
    id: "exp-mid",
    period: "2022 — 2024",
    role: "Software Solutions Engineer",
    company: "Prismatek Digital",
    location: "Remote",
    description: "Shipped three core production releases written in Node/Express and Flutter. Created a modular UI component library, slashing team engineering delivery times for cross-platform layouts by half.",
    tags: ["Flutter Canvas", "Dart Language", "REST API Modules", "Express", "Tailwind CSS"],
  },
  {
    id: "exp-agency",
    period: "2020 — 2022",
    role: "Frontend Specialist & Developer",
    company: "Solis Agency",
    location: "San Francisco, CA",
    description: "Wired interactive interfaces for high-growth tech firms. Converted Figma mockups to pixel-perfect, accessibly-tested markup with smooth, layout-safe transitions.",
    tags: ["HTML5 Layout", "Vanilla JS", "Tailwind styling", "Responsive Design", "Git Control"],
  },
];

/** Featured case studies — 4 selected projects (not the full PROJECTS grid) */
export const BLOG_POSTS: BlogPost[] = [
  insightFromProject("edutrack", {
    category: "Case Study · Full Stack",
    date: "Featured · 2026",
    title: "Building EduTrack: From Attendance Logs to a Faculty Command Center",
    summary:
      "Dual teacher/student portals with live KPIs, per-course attendance bars, and a color-coded check-in feed—deployed on Google Cloud Run.",
    problem:
      "Teachers often rely on spreadsheets for attendance and trends. There is no single place to monitor classes, today’s check-ins, and course-level presence rates.",
    solution:
      "I built EduTrack with an overview dashboard, attendance ledger, bulk CSV enrollment, reports & trends, and a student desk for self check-in. Demo accounts let reviewers explore every flow in minutes.",
    learning:
      "Designing role-based navigation for two audiences, keeping KPI cards scannable, and shipping a polished UI with seeded data so the product feels real on first visit.",
    readTime: "5 min read",
  }),
  insightFromProject("job-board-api", {
    category: "Case Study · Backend",
    date: "Featured · 2026",
    title: "Job Board API: Fastify, Prisma, and a Production-Style Dev Console",
    summary:
      "An enterprise-style backend workspace with OpenAPI testing, Postgres explorer, BullMQ queues, and Redis rate limiting in one UI.",
    problem:
      "Backend portfolios often stop at a README. Recruiters cannot see how auth, queues, or rate limits behave without running everything locally.",
    solution:
      "I created an interactive console: Swagger sandbox with JWT role emulator, PostgreSQL explorer, BullMQ monitor, Jest testing tab, and sliding-window Redis rate limiter—wired to a modular Fastify + Prisma API.",
    learning:
      "Splitting routes by domain, documenting APIs with OpenAPI, and presenting backend systems through a UI that tells a clear engineering story.",
    readTime: "6 min read",
  }),
  insightFromProject("envault-cli", {
    category: "Case Study · DevTools",
    date: "Featured · 2026",
    title: "Envault: Encrypting Secrets Without Slowing Developers Down",
    summary:
      "A CLI and studio for AES-256-GCM vaults, dev/staging/prod profiles, and native OS keychain integration.",
    problem:
      "Plain `.env` files are easy to leak. Teams still need fast workflows across environments without committing secrets to git.",
    solution:
      "Envault combines a terminal CLI (`init`, `add`, `list`, `export`) with a visual vault UI, PBKDF2-derived keys, encrypted registry entries, and macOS Keychain / Linux Secret Service fallback.",
    learning:
      "Balancing security (AES-256-GCM, key derivation) with developer experience—short commands, clear profiles, and a dashboard for non-CLI users.",
    readTime: "4 min read",
  }),
  insightFromProject("collaboration-workspace", {
    category: "Case Study · Real-Time",
    date: "Featured · 2026",
    title: "Synapse: Kanban Boards That Stay in Sync",
    summary:
      "Real-time collaboration with Socket.io rooms, Kanban columns, labeled work cards, and teammate invites.",
    problem:
      "Remote teams need shared boards that update instantly—not refresh-to-see-what-changed workflows.",
    solution:
      "Synapse Workspace ships Kanban from To Do through Shipped, searchable cards, label tags, invite-by-email, and a live “Collaboration Synced OK” status powered by Socket.io room sync.",
    learning:
      "Room-based events, optimistic UI updates, and structuring real-time features so the board stays readable under concurrent edits.",
    readTime: "5 min read",
  }),
];
