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
  category: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  readTime: string;
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
  completedProjects: 7,
  happyClients: 8,
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    icon: "Layout",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Framer Motion", "HTML5/CSS3"],
  },
  {
    id: "backend",
    title: "Backend & Systems",
    icon: "Server",
    skills: ["Node.js", "Express", "Prisma ORM", "GraphQL", "REST APIs", "WebSockets", "Docker"],
  },
  {
    id: "database",
    title: "Data Architecture",
    icon: "Database",
    skills: ["PostgreSQL", "SQL Server", "T-SQL", "Redis", "MongoDB", "Firestore"],
  },
  {
    id: "mobile",
    title: "Mobile Platforms",
    icon: "Smartphone",
    skills: ["Flutter", "Dart", "SwiftUI", "React Native", "Cross-Platform Optimization"],
  },
];

export const PROJECTS: Project[] = [
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

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-ts",
    category: "TypeScript",
    date: "May 24, 2026",
    title: "Level Up Your Type Guard Defenses in Modern React",
    summary: "Discover how smart narrowing, discriminating unions, and automated schema checks can make your client-side states bulletproof against edge cases.",
    content: "When developing complex single-page apps, runtime state bugs often slip through default typing setups. Leveraging discriminant custom properties allows React hooks to conditionally map states perfectly, preventing unexpected renders and missing dependencies.",
    readTime: "4 min read",
  },
  {
    id: "post-flutter",
    category: "Flutter Engine",
    date: "April 12, 2026",
    title: "Optimizing Canvas Draws & Frame Rates in Dart Profiles",
    summary: "Unlock 120 FPS on premium devices by identifying redraw spikes, managing state scopes, and profiling heavy GPU threads.",
    content: "Flutter paints interfaces with absolute pixel-precision. However, wrapping massive widget arrays inside a single parent build function triggers expensive re-layous. By isolating updates using small, local states, we achieve buttery-smooth 120Hz frame rates easily.",
    readTime: "6 min read",
  },
  {
    id: "post-db",
    category: "Databases",
    date: "March 15, 2026",
    title: "Why Prisma + Prepared Indexes Beat Standard SQL Queries",
    summary: "A breakdown of query-compiling routines, index scans, and connection pools, proving that a smart ORM is faster than manually written ad-hoc statements.",
    content: "Developers sometimes fear that abstract layers introduce operational lags. In reality, modern execution engines cache statements perfectly. When coupled with database indexing configured using Prisma schemas, transaction times outperform hand-crafted raw scripts.",
    readTime: "5 min read",
  },
];
