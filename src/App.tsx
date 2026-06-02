import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Layout, 
  Server, 
  Database, 
  Sparkles, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Check, 
  ExternalLink, 
  Code, 
  Send, 
  Cpu, 
  Layers, 
  Sliders, 
  Globe, 
  Terminal, 
  ArrowRight,
  Download,
  BookOpen, 
  Briefcase, 
  MapPin, 
  Phone,
  Copy, 
  Settings, 
  Award, 
  X,
  Play,
  RotateCcw,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "./hooks/useTheme";
import PortfolioChat from "./components/PortfolioChat";
import { 
  INITIAL_PROFILE, 
  SKILL_CATEGORIES, 
  PROJECTS, 
  EXPERIENCES, 
  BLOG_POSTS,
  Profile,
  Project,
  BlogPost,
  projectsUsingSkill,
} from "./types";
import Interactive3DCanvas from "./components/Interactive3DCanvas";
import GlassScrollRail from "./components/GlassScrollRail";
import { sendContactMessage } from "./lib/contact";

// Interactive 3D Card Wrapper using Mouse Coordinates
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  key?: React.Key;
}

function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [glareRef, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Limits the multi-axis tilt angle to ~8 degrees
    const rx = -((y - yc) / yc) * 8;
    const ry = ((x - xc) / xc) * 8;
    
    setRotateX(rx);
    setRotateY(ry);
    setScale(1.02);

    // Calculate dynamic glare opacity and position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative cursor-pointer transition-all duration-200 flex flex-col ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glare Reflection overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareRef.x}% ${glareRef.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          opacity: glareRef.opacity,
          zIndex: 10,
        }}
      />
      
      {/* Secondary glow behind card */}
      <div className="absolute inset-0 -z-10 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-sky-500/5" />
      
      <div
        className="h-full w-full flex flex-col flex-1 min-h-0"
        style={{ transform: "translateZ(10px)" }}
      >
        {children}
      </div>
    </div>
  );
}

// Accent Color Presets
interface ColorPreset {
  id: string;
  name: string;
  glowColor: string; // Tailwind color or custom style
  btnClass: string;
  borderClass: string;
  badgeClass: string;
  textGrad: string;
  iconGlow: string;
  textColor: string;
  bgColor: string;
  bgHover: string;
  bgSoft: string;
  bgSoft10: string;
  borderSoft: string;
  borderSoft20: string;
  glowText: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "cyan",
    name: "Cyber Cyan",
    glowColor: "rgba(14, 165, 233, 0.15)",
    btnClass: "bg-sky-500/90 text-slate-950 hover:bg-sky-400 focus:ring-sky-400/50",
    borderClass: "border-sky-500/30 hover:border-sky-500/60",
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/22",
    textGrad: "from-sky-300 via-cyan-400 to-indigo-400",
    iconGlow: "text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]",
    textColor: "text-sky-400",
    bgColor: "bg-sky-400",
    bgHover: "hover:bg-sky-400",
    bgSoft: "bg-sky-500/5",
    bgSoft10: "bg-sky-500/10",
    borderSoft: "border-sky-500/10",
    borderSoft20: "border-sky-500/20",
    glowText: "glow-text-cyan",
  },
  {
    id: "violet",
    name: "Violet Flare",
    glowColor: "rgba(168, 85, 247, 0.15)",
    btnClass: "bg-purple-500/90 text-slate-50 hover:bg-purple-400 focus:ring-purple-400/50",
    borderClass: "border-purple-500/30 hover:border-purple-500/60",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/22",
    textGrad: "from-purple-300 via-fuchsia-400 to-pink-400",
    iconGlow: "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]",
    textColor: "text-purple-400",
    bgColor: "bg-purple-400",
    bgHover: "hover:bg-purple-400",
    bgSoft: "bg-purple-500/5",
    bgSoft10: "bg-purple-500/10",
    borderSoft: "border-purple-500/10",
    borderSoft20: "border-purple-500/20",
    glowText: "glow-text-violet",
  },
  {
    id: "emerald",
    name: "Neon Emerald",
    glowColor: "rgba(16, 185, 129, 0.15)",
    btnClass: "bg-emerald-500/90 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-400/50",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/22",
    textGrad: "from-emerald-300 via-teal-400 to-cyan-400",
    iconGlow: "text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-400",
    bgHover: "hover:bg-emerald-400",
    bgSoft: "bg-emerald-500/5",
    bgSoft10: "bg-emerald-500/10",
    borderSoft: "border-emerald-500/10",
    borderSoft20: "border-emerald-500/20",
    glowText: "glow-text-emerald",
  },
  {
    id: "amber",
    name: "Gold Rush",
    glowColor: "rgba(245, 158, 11, 0.15)",
    btnClass: "bg-amber-500/90 text-slate-950 hover:bg-amber-400 focus:ring-amber-400/50",
    borderClass: "border-amber-500/30 hover:border-amber-500/60",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/22",
    textGrad: "from-yellow-300 via-amber-400 to-orange-400",
    iconGlow: "text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    textColor: "text-amber-400",
    bgColor: "bg-amber-400",
    bgHover: "hover:bg-amber-400",
    bgSoft: "bg-amber-500/5",
    bgSoft10: "bg-amber-500/10",
    borderSoft: "border-amber-500/10",
    borderSoft20: "border-amber-500/20",
    glowText: "glow-text-amber",
  },
];

export default function App() {
  const { colorMode, setColorMode, isDark } = useTheme();

  // Global States
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [preset, setPreset] = useState<ColorPreset>(COLOR_PRESETS[0]);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "web" | "mobile" | "backend">("all");
  
  // Custom interactive cursor position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  // Active terminal project
  const [terminalProject, setTerminalProject] = useState<Project | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [compilingIndex, setCompilingIndex] = useState(-1);
  const shellIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Typewriter Hooks
  const [typedWord, setTypedWord] = useState("Architect.");
  const typewriterTerms = useMemo(() => ["Full Stack Dev.", "Junior Developer.", "Web Engineer.", "Product Builder."], []);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(typewriterTerms[0].length);
  const [isDeleting, setIsDeleting] = useState(true);

  // Spotlight Skills Detail
  const [selectedSkill, setSelectedSkill] = useState<{name: string, exp: string} | null>(null);

  // Insights popup (project case study)
  const [selectedInsight, setSelectedInsight] = useState<BlogPost | null>(null);

  // Contact States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "info">("idle");
  const [formFeedback, setFormFeedback] = useState<string[]>([]);

  // Check device capabilities + Mouse track setup
  useEffect(() => {
    // Is client-side touch screen?
    const checkViewport = () => {
      setIsMobileDevice(window.matchMedia("(max-width: 1024px)").matches || 'ontouchstart' in window);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);

    // Track mouse coordinate offsets globally
    const trackMouseGlobal = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", trackMouseGlobal);

    return () => {
      window.removeEventListener("resize", checkViewport);
      window.removeEventListener("mousemove", trackMouseGlobal);
    };
  }, []);

  // Soft lag lagger custom cursor loop
  useEffect(() => {
    if (isMobileDevice) return;
    
    let animFrame: number;
    const updateCursor = () => {
      setMousePos(prev => {
        const ease = 0.12; // speed damping
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease
        };
      });
      animFrame = requestAnimationFrame(updateCursor);
    };
    animFrame = requestAnimationFrame(updateCursor);

    return () => cancelAnimationFrame(animFrame);
  }, [targetPos, isMobileDevice]);

  // Handle live typewriter intervals
  useEffect(() => {
    const currentText = typewriterTerms[wordIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
      // Pause at full status
      speed = 2200;
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % typewriterTerms.length);
      speed = 300;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => {
        const next = isDeleting ? prev - 1 : prev + 1;
        setTypedWord(currentText.slice(0, next));
        return next;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, typewriterTerms]);

  useEffect(() => {
    if (!selectedInsight) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedInsight(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedInsight]);

  // Simulated project compiler terminal
  const startTerminalSimulator = (proj: Project) => {
    if (shellIntervalRef.current) clearInterval(shellIntervalRef.current);
    setTerminalProject(proj);
    setCompilingIndex(0);
    
    const logsList = [
      `Initializing telemetry pipeline on port 3000...`,
      `[SUCCESS] Established secure handshake client layer.`,
      `Pulling dynamic schemas for schema module...`,
      `Connecting to database server proxy client [POSTGRESQL]...`,
      `Analyzing table index partitions on: "${proj.title.toLowerCase().replace(/ /g, "-")}"`,
      `Found Architecture nodes: ${proj.architecture.join(", ")}`,
      `Building bundles with esbuild Node formats --minify...`,
      `Updating local metrics: DB queries bound successfully (latency < 2ms).`,
      `✓ Dynamic portfolio virtualization simulation successfully running!`
    ];
    
    setTerminalLogs([logsList[0]]);

    let counter = 1;
    setCompilingIndex(counter);
    shellIntervalRef.current = setInterval(() => {
      if (counter < logsList.length) {
        setTerminalLogs(prev => [...prev, logsList[counter]]);
        counter++;
        setCompilingIndex(counter);
      } else {
        if (shellIntervalRef.current) clearInterval(shellIntervalRef.current);
      }
    }, 700);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setFormState("info");
    setFormFeedback(["✓ Success! E-mail copied to clipboard securely.",`Ready to accept proposals at: ${profile.email}`]);
    setTimeout(() => {
      setFormState("idle");
    }, 3500);
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormState("info");
      setFormFeedback(["Form requires essential parameters: Name, Mail, Msg.", "Please audit remaining input areas."]);
      return;
    }

    setFormState("sending");
    setFormFeedback([
      "Establishing secure link to mail server...",
      "Encrypting message payload (TLS)...",
      "Transmitting to inbox..."
    ]);

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        website: honeypot,
      });

      setFormFeedback((prev) => [
        ...prev,
        "Success! Message delivered to your inbox.",
        `✓ Delivered to ${profile.email}.`,
      ]);
      setFormState("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setHoneypot("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message.";
      setFormState("info");
      setFormFeedback([
        "Transmission failed.",
        errorMessage,
        `You can email directly: ${profile.email}`,
      ]);
    }
  };

  // Filter project lists
  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return PROJECTS;
    return PROJECTS.filter(p => p.category === activeTab);
  }, [activeTab]);

  const handleSpotlight = (tag: string) => {
    const usedIn = projectsUsingSkill(tag);
    const proficiencies: Record<string, string> = {
      React: "Shipped across EduTrack, SaaS Portal, Forge UI, Synapse, Analytics, E-Commerce, and the UK AI Patient Assistant.",
      TypeScript: "Used in Envault CLI, Job Board API, Forge UI, and multi-tenant dashboards with strict typing end to end.",
      "Tailwind CSS": "Primary styling on EduTrack, Forge UI, and this glassmorphic portfolio.",
      "Node.js": "Powers Express backends and the Envault CLI toolchain.",
      Express: "REST orchestration for the UK AI Patient Assistant—Gemini routes, tenant config, and compliance middleware.",
      Fastify: "High-throughput Job Board API with OpenAPI docs and Prisma data access.",
      OpenAPI: "Interactive Swagger sandbox on the Job Board API workspace.",
      JWT: "Session and role emulation in the Job Board API auth pipeline.",
      Jest: "Automated test tab in the Job Board API developer console.",
      bcrypt: "Password hashing in the Job Board API alongside Prisma user records.",
      tsup: "Bundles the Envault CLI for dual CJS/ESM distribution.",
      "AES-256-GCM": "Vault encryption core in Envault CLI for environment secrets.",
      PBKDF2: "Key derivation for Envault CLI master keys before envelope encryption.",
      "Prisma ORM": "Schema and migrations on Job Board API with relationship-heavy models.",
      PostgreSQL: "Primary datastore behind Prisma on the Job Board API.",
      Redis: "Rate limiting and BullMQ backing store on the Job Board API.",
      BullMQ: "Background email workers and queue monitor on the Job Board API.",
      Gemini: "LLM engine for UK clinic receptionist chat with health safety guardrails.",
      "Socket.io": "Real-time Kanban sync in Synapse Collaboration Workspace.",
      "Google Cloud Run": "Production deployment for EduTrack faculty/student portals.",
      "Multi-Tenant Architecture": "Tenant-scoped profiles in the AI Patient Assistant and SaaS Management Portal.",
    };
    const base =
      proficiencies[tag] ||
      "Used in shipped portfolio projects—see Selected Work for live demos.";
    const projectsLine =
      usedIn.length > 0 ? `\n\nFeatured in: ${usedIn.join(", ")}.` : "";
    setSelectedSkill({ name: tag, exp: base + projectsLine });
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-cyan-500/30 selection:text-app-heading overflow-x-hidden text-app bg-app transition-colors duration-300">
      
      {/* Dynamic Cursor for Desktop view */}
      {!isMobileDevice && (
        <>
          <div 
            className="fixed pointer-events-none z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 select-none pb-0"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: isHovered ? "24px" : "10px",
              height: isHovered ? "24px" : "10px",
              background: `radial-gradient(circle, #fff 0%, ${preset.id === "amber" ? "#f59e0b" : preset.id === "emerald" ? "#10b981" : preset.id === "violet" ? "#a855f7" : "#0ea5e9"} 100%)`,
              opacity: 0.9,
              boxShadow: `0 0 16px ${preset.id === "amber" ? "#f59e0b" : preset.id === "emerald" ? "#10b981" : preset.id === "violet" ? "#a855f7" : "#0ea5e9"}`
            }}
          />
          <div 
            className="fixed pointer-events-none z-[9998] rounded-full border border-app-strong -translate-x-1/2 -translate-y-1/2 transition-all duration-300 select-none"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: isHovered ? "56px" : "40px",
              height: isHovered ? "56px" : "40px",
              borderColor: preset.id === "amber" ? "rgba(245, 158, 11, 0.4)" : preset.id === "emerald" ? "rgba(16, 185, 129, 0.4)" : preset.id === "violet" ? "rgba(168, 85, 247, 0.4)" : "rgba(14, 165, 233, 0.4)",
              background: isHovered ? `${preset.glowColor}` : "transparent"
            }}
          />
        </>
      )}

      {/* Global Interactive Background Waves */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Radial blobs centered on tracked mouse coordinates */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full filter blur-[140px] opacity-[0.11] transition-transform duration-700 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background: `radial-gradient(circle, ${preset.id === "amber" ? "#f59e0b" : preset.id === "emerald" ? "#10b981" : preset.id === "violet" ? "#a855f7" : "#0ea5e9"} 0%, transparent 70%)`
          }}
        />
        {/* Elegant Dark theme specific blur-glow layers */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] theme-ambient-cyan rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] theme-ambient-purple rounded-full blur-[100px]" />
        
        <div className="absolute inset-0 app-grid" />
      </div>

      <PortfolioChat accentTextClass={preset.textColor} btnClass={preset.btnClass} />

      {/* Profile Live Builder / Dynamic Accent panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setCustomizerOpen(!customizerOpen);
            setIsHovered(false);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="p-3.5 rounded-full glass-panel flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group shadow-xl"
        >
          <Settings className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition-transform duration-500" />
        </button>

        <AnimatePresence>
          {customizerOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="absolute bottom-16 right-0 w-80 glass-panel border border-app rounded-2xl p-5 shadow-2xl z-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400" />
              
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-semibold tracking-wider uppercase font-mono text-app-heading">Control Panel</h4>
                </div>
                <button 
                  onClick={() => setCustomizerOpen(false)}
                  className="p-1 rounded-md hover:bg-app-surface-hover text-app-muted hover:text-app-heading transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block mb-2">Appearance</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setColorMode("light")}
                    className={`h-9 rounded-lg border text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      colorMode === "light"
                        ? "bg-app-surface-hover border-sky-400 text-app-heading shadow-md shadow-sky-500/10"
                        : "bg-app-input border-app-soft text-app-muted hover:border-app"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode("dark")}
                    className={`h-9 rounded-lg border text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      colorMode === "dark"
                        ? "bg-app-surface-hover border-sky-400 text-app-heading shadow-md shadow-sky-500/10"
                        : "bg-app-input border-app-soft text-app-muted hover:border-app"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
                </div>
              </div>

              {/* Accent Controller */}
              <div className="mb-4">
                <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block mb-2">Accent Aura Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPreset(p)}
                      className={`h-9 rounded-lg border text-xs font-mono font-bold capitalize transition-all flex flex-col justify-center items-center ${
                        preset.id === p.id 
                          ? "bg-app-surface-hover border-sky-400 text-app-heading shadow-md shadow-sky-500/10" 
                          : "bg-app-input border-app-soft text-app-muted hover:border-app-strong"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full mb-0.5 ${
                        p.id === 'cyan' ? 'bg-sky-400' : p.id === 'violet' ? 'bg-purple-400' : p.id === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Profile Editing fields */}
              <div className="space-y-3 pt-3 border-t border-app-soft">
                <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block">Modify Profile telemetry</label>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-mono text-app-subtle uppercase block">Developer Name</label>
                    <span className="text-[8px] font-mono text-amber-500/80 uppercase tracking-wider flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 inline" /> Read Only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={profile.name}
                    disabled
                    className="w-full bg-app-input border border-app-soft rounded-lg px-2.5 py-1.5 text-xs text-app-muted font-mono cursor-not-allowed opacity-60"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-mono text-app-subtle uppercase block">Developer Role</label>
                    <span className="text-[8px] font-mono text-amber-500/80 uppercase tracking-wider flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 inline" /> Read Only
                    </span>
                  </div>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full bg-app-input border border-app-soft rounded-lg px-2.5 py-1.5 text-xs text-app-muted font-mono cursor-not-allowed opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-app-subtle uppercase block mb-1">City Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-app-input border border-app rounded-lg px-2.5 py-1.5 text-[11px] text-app-heading font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-app-subtle uppercase block mb-1">Years Exp</label>
                    <input
                      type="number"
                      value={profile.yearsExperience}
                      onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-app-input border border-app rounded-lg px-2.5 py-1.5 text-[11px] text-app-heading font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfile(INITIAL_PROFILE);
                    setPreset(COLOR_PRESETS[0]);
                  }}
                  className="w-full py-2 bg-app-surface hover:bg-app-surface-hover border border-app rounded-lg text-app-secondary hover:text-app-heading font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> Reset telemetry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modular Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass-nav shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <a 
            href="#home"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-xl sm:text-2xl font-bold tracking-tighter brand-gradient italic shrink-0 whitespace-nowrap"
          >
            {profile.name.split(' ').map(n => n[0].toUpperCase()).join('') || 'JV'}.STUDIO
          </a>

          {/* Nav Items — centered column */}
          <ul className="hidden md:flex items-center justify-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-app-muted">
            {["projects", "experience", "insights", "skills"].map((sec) => (
              <li key={sec}>
                <a
                  href={`#${sec === "insights" ? "blog" : sec}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="hover:text-app-heading transition-colors"
                >
                  {sec}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setColorMode(isDark ? "light" : "dark")}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-10 h-10 rounded-full border border-app flex items-center justify-center bg-app-surface backdrop-blur-md hover:bg-app-surface-hover hover:border-app-strong transition-all"
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
            <a
              href="#contact"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-widest nav-contact-pill ${preset.bgHover} rounded-full transition-all duration-300 shrink-0`}
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative max-w-7xl mx-auto px-6 pt-36 pb-24 z-10 space-y-36">
        
        {/* HERO SECTION */}
        <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 xl:pt-16 items-center">
          
          {/* Hero left content info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Subtitle Badge */}
            <div className={`inline-block px-3 py-1 bg-app-surface backdrop-blur-md border border-app rounded-full text-[10px] uppercase tracking-widest ${preset.textColor} font-bold mb-2 w-fit`}>
              {profile.role || "Digital Architect"}
            </div>

            {/* Giant Title headings */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tighter text-app-heading uppercase text-left">
              CRAFTING<br />
              <span className="font-medium italic hero-accent-gradient">FUTURE</span><br />
              DYNAMICS.
            </h1>

            {/* Interactive console terminal word typing inline */}
            <div className="text-xl sm:text-2xl text-app-muted font-mono font-light mt-4">
              &gt; <span className="text-app-heading font-medium">{typedWord}</span>
              <span className="animate-[ping_0.9s_infinite] ml-1">_</span>
            </div>

            <p className="text-app-muted leading-relaxed max-w-lg text-[14px]">
              {profile.bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#projects"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`px-8 py-4 nav-contact-pill text-xs font-bold uppercase tracking-widest rounded-full ${preset.bgHover} transition-colors duration-300 font-mono flex items-center gap-2 cursor-pointer`}
              >
                View Cases <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="px-8 py-4 bg-app-surface border border-app backdrop-blur-md text-app-heading text-xs font-bold uppercase tracking-widest rounded-full hover:bg-app-surface-hover hover:border-app-strong transition-all font-mono"
              >
                Inquire Telemetry
              </a>

              <a
                href={profile.cvUrl}
                download={profile.cvFileName}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="px-8 py-4 bg-app-surface border border-app backdrop-blur-md text-app-heading text-xs font-bold uppercase tracking-widest rounded-full hover:bg-app-surface-hover hover:border-app-strong transition-all font-mono flex items-center gap-2"
              >
                Download CV <Download className="w-4 h-4" />
              </a>
            </div>

            {/* Stat Counters with responsive values */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-app">
              <div>
                <dt className="text-3xl font-extrabold font-mono text-app-heading flex items-center">
                  <span>{profile.yearsExperience}+</span>
                  <Award className={`w-4 h-4 ml-1 ${preset.textColor} opacity-60`} />
                </dt>
                <dd className="text-[10px] font-mono uppercase tracking-wider text-app-subtle mt-1">Years Eng.</dd>
              </div>
              <div>
                <dt className="text-3xl font-extrabold font-mono text-app-heading flex items-center">
                  <span>{profile.completedProjects}+</span>
                  <Code className="w-4 h-4 ml-1 text-purple-400 opacity-60" />
                </dt>
                <dd className="text-[10px] font-mono uppercase tracking-wider text-app-subtle mt-1">Core Modules</dd>
              </div>
              <div>
                <dt className="text-3xl font-extrabold font-mono text-app-heading flex items-center">
                  <span>{profile.happyClients}+</span>
                  <Globe className="w-4 h-4 ml-1 text-emerald-400 opacity-60" />
                </dt>
                <dd className="text-[10px] font-mono uppercase tracking-wider text-app-subtle mt-1">Happy Clients</dd>
              </div>
            </div>

          </div>

          {/* Hero right: Orbiting Interactive double stacked cards */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[460px] w-full px-4 sm:px-0">
            
            {/* Double card stack */}
            <div className="w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[390px] md:max-w-[400px] h-[460px] xs:h-[490px] sm:h-[510px] relative">
              {/* Back ambient card */}
              <div className={`absolute inset-0 bg-gradient-to-tr from-${preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : preset.id === "amber" ? "amber" : "sky"}-500/10 to-purple-500/10 rounded-[30px] sm:rounded-[40px] border border-app backdrop-blur-2xl shadow-2xl rotate-[-4deg] sm:rotate-[-6deg] z-0`} />
              
              {/* Front central card */}
              <div className="absolute inset-0 bg-app-surface rounded-[30px] sm:rounded-[40px] border border-app-strong backdrop-blur-3xl shadow-2xl flex flex-col p-5 sm:p-8 rotate-2 sm:rotate-3 z-10 overflow-hidden">
                <div className="w-full h-40 xs:h-44 sm:h-56 bg-app-card border border-app rounded-2xl mb-4 sm:mb-6 relative overflow-hidden shrink-0">
                  <Interactive3DCanvas colorPreset={preset} colorMode={colorMode} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-app-heading tracking-tight leading-tight">{profile.name}</h3>
                <p className="text-[10px] sm:text-xs text-app-muted mt-0.5 sm:mt-1 font-mono uppercase tracking-widest leading-none">{profile.role}</p>

                {/* Unified Spec tag buttons directly in the 3D layout */}
                <div className="flex flex-wrap gap-1 mt-3.5 mb-2">
                  {["TypeScript", "React 19", "Flutter", "T-SQL", "Prisma"].map((s) => (
                    <span 
                      key={s}
                      onClick={() => handleSpotlight(s)}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className={`text-[9px] font-mono bg-app-surface border border-app px-1.5 py-0.5 rounded-full text-app-secondary hover:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-400/40 hover:text-app-heading cursor-pointer transition-colors`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex justify-between items-end border-t border-app-soft pt-3">
                  <div className="flex -space-x-1.5">
                    {["TS", "REACT", "NODE"].map((tag, i) => (
                      <div key={tag} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-app-elevated flex items-center justify-center text-[8px] font-bold font-mono text-app-heading select-none ${
                        i === 0 ? (preset.id === "violet" ? "bg-purple-500" : preset.id === "emerald" ? "bg-emerald-500" : preset.id === "amber" ? "bg-amber-500" : "bg-sky-500") : i === 1 ? "bg-indigo-500" : "bg-purple-500"
                      }`}>
                        {tag}
                      </div>
                    ))}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-app-subtle uppercase tracking-[0.2em] font-mono">EST_2026</div>
                </div>
              </div>

              {/* Extra floating detail pill on the right - hidden on mobile, visible on tablets/desktops */}
              <div className="absolute -right-4 sm:-right-8 bottom-12 sm:bottom-16 w-36 sm:w-44 h-24 sm:h-28 bg-app-surface-hover border border-app-strong backdrop-blur-xl rounded-2xl z-20 shadow-xl p-3 sm:p-4 flex flex-col justify-between transform rotate-12 transition-all hover:scale-105 duration-300 hidden sm:flex">
                <div className="flex justify-between items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <div className="text-[8px] text-app-subtle uppercase tracking-widest font-mono">CYBER_LINK</div>
                </div>
                <div className={`text-xs sm:text-sm font-mono ${preset.textColor} tracking-widest font-bold`}>ACTIVE_04</div>
                <div className="h-1 w-full bg-app-surface-hover rounded-full overflow-hidden">
                  <div className={`h-full w-2/3 ${preset.bgColor}`} />
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* Skill Spotlight Modal component overlay if triggered */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-app-overlay backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-md glass-panel border border-app rounded-2xl p-6 shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <Cpu className={`w-5 h-5 ${preset.textColor}`} />
                    <h3 className="font-mono text-sm uppercase text-app-secondary tracking-wider">Index Telemetry Spotlight</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedSkill(null)}
                    className="p-1 rounded-md hover:bg-app-surface-hover text-app-muted hover:text-app-heading transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-app-input border border-app-soft rounded-xl p-4 font-mono">
                    <div className="text-app-heading font-bold text-lg mb-1">{selectedSkill.name}</div>
                    <div className={`text-[10px] ${preset.textColor} uppercase tracking-widest mb-3`}>Compiled dynamic info: OK</div>
                    <p className="text-xs text-app-muted leading-relaxed">
                      {selectedSkill.exp}
                    </p>
                  </div>

                  <div className={`${preset.bgSoft} ${preset.borderSoft} border rounded-xl p-3 text-[10px] font-mono ${preset.textColor}/80 leading-relaxed`}>
                    🌟 Direct proficiencies are automatically incorporated in Elevate Commerce and Orbit workspaces.
                  </div>
                  
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="w-full py-2 bg-app-surface hover:bg-app-surface-hover border border-app rounded-xl font-mono text-xs text-app-secondary hover:text-app-heading transition-colors"
                  >
                    Close telemetry scope
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROJECTS SECTION */}
        <section id="projects" className="space-y-12">
          {/* Section banner & Filter tabs */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-px ${preset.badgeClass.split(' ')[0]} bg-current`} />
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${preset.badgeClass.split(' ')[1]}`}>
                  01 // Telemetry Works
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-app-heading uppercase font-mono">
                Selected Work
              </h2>
              <p className="text-xs text-app-muted font-mono max-w-md">
                {PROJECTS.length} full-stack builds — live demos, open source, and production-style UIs.
              </p>
            </div>

            {/* Selector Categories */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-app-input border border-app rounded-xl self-start">
              {(["all", "web", "mobile", "backend"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsHovered(false);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab 
                      ? "bg-app-surface-hover text-app-heading shadow-sm" 
                      : "text-app-muted hover:text-app-secondary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal scroll layout of Projects */}
          <GlassScrollRail presetId={preset.id}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, index) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="h-full flex flex-col horizontal-scroll-card"
                >
                  <TiltCard className="h-full flex-1 min-h-0 project-card">
                    <article className="glass-panel border-app hover:border-app-strong h-full rounded-2xl overflow-hidden shadow-lg flex flex-col group">
                      
                      <div className="project-card-image border-b border-app-soft">
                        <img
                          src={p.imageUrl}
                          alt={`${p.title} preview`}
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                          <span className="text-lg drop-shadow-md" aria-hidden="true">{p.icon}</span>
                          <span className={`text-[9px] font-mono ${preset.bgSoft10} backdrop-blur-md border ${preset.borderSoft20} ${preset.textColor} px-2 py-0.5 rounded-md uppercase tracking-wider`}>
                            {p.category}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 z-10">
                          <span className="text-[9px] font-mono bg-app-overlay/80 backdrop-blur-md border border-app text-app-muted px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <p className={`text-[9px] font-mono ${preset.textColor} font-bold mb-1.5 uppercase tracking-wider leading-relaxed`}>
                          {p.language}
                        </p>
                        <h3 className={`text-base font-bold text-app-heading tracking-tight font-mono mb-2 ${preset.glowText} transition-colors`}>
                          {p.title}
                        </h3>
                        <p className="text-[11px] text-app-muted leading-relaxed font-mono mb-5 flex-1">
                          {p.description}
                        </p>

                        <div className="flex gap-2 mb-3">
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="project-link-btn project-link-btn--live"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="project-link-btn project-link-btn--github"
                          >
                            <Github className="w-3.5 h-3.5" /> GitHub
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => startTerminalSimulator(p)}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          className="w-full py-2 text-[9px] font-mono tracking-wider text-app-subtle hover:text-app-heading bg-app-surface hover:bg-app-surface-hover rounded-lg border border-app-soft transition-colors uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Terminal className={`w-3.5 h-3.5 ${preset.textColor}`} />
                          Inspect architecture
                        </button>
                      </div>
                    </article>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </GlassScrollRail>

          {/* Interactive Live API terminal logger */}
          <AnimatePresence>
            {terminalProject && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-8 border border-app rounded-2xl overflow-hidden glass-panel"
              >
                {/* Terminal Header status tags */}
                <div className="bg-app-input px-4 py-3 border-b border-app flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] font-mono text-app-muted ml-2">
                      terminal_telemetry://{terminalProject.id}.sh
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (shellIntervalRef.current) clearInterval(shellIntervalRef.current);
                      setTerminalProject(null);
                    }}
                    className="p-1 rounded hover:bg-app-surface-hover text-app-muted hover:text-app-heading transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated Screen logs */}
                <div className="p-4 bg-app-input font-mono text-xs text-app-secondary min-h-[190px] max-h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-app-subtle select-none">[{idx}]</span>
                      <span className={log.startsWith("[SUCCESS]") || log.startsWith("✓") ? "text-emerald-400" : log.startsWith("Initialize") ? preset.textColor : "text-app-secondary"}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {compilingIndex < 9 && (
                    <div className="flex items-center gap-1 text-app-subtle">
                      <span>_ compiling telemetry nodes...</span>
                      <span 
                        className="w-2 h-3.5 animate-[ping_0.8s_infinite]" 
                        style={{ backgroundColor: preset.id === 'amber' ? 'rgba(245,158,11,0.8)' : preset.id === 'emerald' ? 'rgba(16,185,129,0.8)' : preset.id === 'violet' ? 'rgba(168,85,247,0.8)' : 'rgba(14,165,233,0.8)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Tech schema detail visualizer chart */}
                <div className="bg-app-input p-4 border-t border-app-soft space-y-3">
                  <span className="text-[10px] font-mono text-app-muted uppercase tracking-widest block">System Deployment Schema Map</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                    {terminalProject.architecture.map((arch, index) => (
                      <div key={index} className={`bg-app-surface border border-app rounded-xl p-3 flex flex-col justify-between group hover:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500/20 hover:bg-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500/5 transition-colors`}>
                        <div>
                          <div className={`text-[8px] font-mono ${preset.textColor} font-bold uppercase mb-1`}>Node {index + 1}</div>
                          <div className="text-xs font-mono text-app-secondary line-clamp-2">{arch}</div>
                        </div>
                        <div className="text-[9px] font-mono text-app-subtle text-right mt-2">Telemetry OK</div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </section>

        {/* CAREER TIMELINE SECTION */}
        <section id="experience" className="space-y-12">
          {/* Section banner */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-px ${preset.badgeClass.split(' ')[0]} bg-current`} />
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${preset.badgeClass.split(' ')[1]}`}>
                02 // Career Path
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-app-heading uppercase font-mono">
              Professional Timeline
            </h2>
          </div>

          <div className="max-w-3xl ml-4 relative border-l border-app pl-8 space-y-12 py-3">
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="relative group">
                
                {/* Tracker glowing ring */}
                <div className={`absolute -left-[37px] top-1.5 w-4.5 h-4.5 rounded-full border border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-400/40 bg-app-elevated flex items-center justify-center transition-all group-hover:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-400 group-hover:scale-110 shadow-md`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${preset.bgColor} relative`}>
                    <span className={`absolute inset-0 rounded-full ${preset.bgColor} animate-ping group-hover:scale-150 duration-500`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`text-[10px] font-mono font-semibold tracking-wider ${preset.textColor} ${preset.bgSoft} border ${preset.borderSoft} px-2 py-0.5 rounded-md uppercase`}>
                    {exp.period}
                  </span>
                  
                  <h3 className="text-base font-extrabold text-app-heading tracking-tight pt-1">
                    {exp.role} 
                    <span className="font-light text-app-muted font-mono ml-1.5">&gt; {exp.company}</span>
                  </h3>
                  
                  <div className="flex items-center gap-1 text-[10px] font-mono text-app-subtle">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>

                  {exp.highlights?.length ? (
                    <ul className="text-app-muted text-xs sm:text-sm font-mono max-w-2xl leading-relaxed pt-2 space-y-2 list-disc pl-4 marker:text-app-subtle">
                      {exp.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-app-muted text-xs sm:text-sm font-mono max-w-2xl leading-relaxed pt-2">
                      {exp.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono bg-app-surface border border-app text-app-muted px-2.5 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* ARTICLES & INSIGHTS BLOG SECTION */}
        <section id="blog" className="space-y-12">
          {/* Section banner */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-px ${preset.badgeClass.split(' ')[0]} bg-current`} />
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${preset.badgeClass.split(' ')[1]}`}>
                03 // Written Notes
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-app-heading uppercase font-mono">
              Insights & Diagnostics
            </h2>
            <p className="text-xs text-app-muted font-mono max-w-xl">
              Featured case studies on four shipped builds—problem, approach, and lessons learned. All {PROJECTS.length} projects live in Selected Work above.
            </p>
          </div>

          <GlassScrollRail presetId={preset.id} scrollStep={420}>
            {BLOG_POSTS.map((post) => (
              <TiltCard key={post.id} className="h-full horizontal-scroll-card horizontal-scroll-card--wide">
                <article className={`glass-panel border-app hover:border-app-strong h-full rounded-2xl overflow-hidden flex flex-col group`}>
                  <div className="relative h-28 overflow-hidden border-b border-app-soft">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg-card)] via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 text-base" aria-hidden="true">{post.icon}</span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-[10px] font-mono text-app-subtle mb-2">
                      <span className={`${preset.textColor} ${preset.bgSoft} px-2 py-0.5 border ${preset.borderSoft} rounded-md uppercase tracking-wider`}>
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-app-heading uppercase tracking-tight leading-snug font-mono mb-2">
                      {post.title}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-app-muted line-clamp-2 leading-relaxed font-mono flex-1">
                      {post.summary}
                    </p>

                    <div className="border-t border-app-soft pt-3 mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-app-subtle">{post.date}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedInsight(post)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`text-[11px] sm:text-xs font-mono font-bold ${preset.textColor} hover:text-app-heading transition-colors flex items-center gap-1 uppercase cursor-pointer`}
                      >
                        Inspect Module_ <BookOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              </TiltCard>
            ))}
          </GlassScrollRail>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-px ${preset.badgeClass.split(' ')[0]} bg-current`} />
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${preset.badgeClass.split(' ')[1]}`}>
                04 // Specialized Tools
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-app-heading uppercase font-mono">
              Advanced Skill Modules
            </h2>
            <p className="text-app-muted text-xs sm:text-sm font-mono max-w-md">
              Tap any spec modules below to compile exact diagnostics.
            </p>
          </div>

          <div className="skill-modules-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILL_CATEGORIES.map((cat) => {
              const IconComp =
                cat.id === "frontend"
                  ? Layout
                  : cat.id === "backend"
                    ? Server
                    : cat.id === "data"
                      ? Database
                      : Sparkles;
              const hasScroll = cat.skills.length > 3;
              return (
                <TiltCard key={cat.id} className="h-full">
                  <div className="skill-module-card glass-panel border-app rounded-2xl p-6 sm:p-7 group">
                    <div className={`w-12 h-12 rounded-xl bg-app-surface border border-app flex items-center justify-center mb-5 shrink-0`}>
                      <IconComp className={`w-6 h-6 ${preset.textColor}`} />
                    </div>
                    <h3 className="font-mono text-app-heading font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 leading-snug shrink-0">
                      {cat.title}
                    </h3>
                    <div
                      className={`skill-module-list space-y-2 ${hasScroll ? "skill-module-list--scrollable" : ""}`}
                    >
                      {cat.skills.map((s) => (
                        <div
                          key={s}
                          onClick={() => handleSpotlight(s)}
                          className="skill-module-row flex items-center justify-between group/line hover:bg-app-surface px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="text-xs sm:text-[13px] font-mono font-semibold text-app-secondary group-hover/line:text-app-heading transition-colors">
                            {s}
                          </span>
                          <span className={`text-[10px] sm:text-[11px] font-mono font-semibold text-app-subtle group-hover/line:${preset.textColor} opacity-0 group-hover/line:opacity-100 transition-all uppercase tracking-wider`}>
                            Inspect
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-app-muted border-t border-app-soft pt-4 uppercase tracking-wider flex items-center justify-between shrink-0 mt-auto">
                      <span>
                        {cat.skills.length} modules
                        {hasScroll ? " · scroll" : ""}
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Shipped
                      </span>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* Project insight popup */}
        <AnimatePresence>
          {selectedInsight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-app-overlay backdrop-blur-md z-[60] flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedInsight(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 24 }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-panel border border-app rounded-2xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-40 sm:h-44 overflow-hidden rounded-t-2xl">
                  <img
                    src={selectedInsight.imageUrl}
                    alt={selectedInsight.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg-card)] via-[var(--app-bg-card)]/40 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setSelectedInsight(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-app-overlay/90 border border-app text-app-heading hover:bg-app-surface-hover transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-2xl mb-1 block" aria-hidden="true">{selectedInsight.icon}</span>
                    <h3 className="text-lg font-bold text-app-heading font-mono uppercase tracking-tight">
                      {selectedInsight.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                    <span className={`${preset.textColor} ${preset.bgSoft} border ${preset.borderSoft} px-2 py-0.5 rounded-md uppercase`}>
                      {selectedInsight.category}
                    </span>
                    <span className="text-app-subtle border border-app-soft px-2 py-0.5 rounded-md">
                      {selectedInsight.date}
                    </span>
                  </div>

                  <p className={`text-[10px] font-mono ${preset.textColor} uppercase tracking-wider`}>
                    {selectedInsight.stack}
                  </p>

                  <p className="text-xs text-app-muted font-mono leading-relaxed">
                    {selectedInsight.summary}
                  </p>

                  <div className="space-y-3 font-mono">
                    <div className="bg-app-input border border-app-soft rounded-xl p-4">
                      <div className={`text-[10px] ${preset.textColor} uppercase tracking-widest mb-2`}>
                        The problem
                      </div>
                      <p className="text-[11px] text-app-secondary leading-relaxed">
                        {selectedInsight.problem}
                      </p>
                    </div>
                    <div className="bg-app-input border border-app-soft rounded-xl p-4">
                      <div className={`text-[10px] ${preset.textColor} uppercase tracking-widest mb-2`}>
                        What I built
                      </div>
                      <p className="text-[11px] text-app-secondary leading-relaxed">
                        {selectedInsight.solution}
                      </p>
                    </div>
                    <div className="bg-app-input border border-app-soft rounded-xl p-4">
                      <div className={`text-[10px] ${preset.textColor} uppercase tracking-widest mb-2`}>
                        What I learned
                      </div>
                      <p className="text-[11px] text-app-secondary leading-relaxed">
                        {selectedInsight.learning}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-app-subtle uppercase tracking-wider mb-2">
                      Architecture nodes
                    </div>
                    <ul className="space-y-1.5">
                      {selectedInsight.highlights.map((item) => (
                        <li
                          key={item}
                          className="text-[10px] font-mono text-app-secondary flex items-start gap-2"
                        >
                          <span className={`${preset.textColor} mt-0.5`}>▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={selectedInsight.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link-btn project-link-btn--live flex-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                    <a
                      href={selectedInsight.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link-btn project-link-btn--github flex-1"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInsight(null)}
                    className="w-full py-2.5 bg-app-surface hover:bg-app-surface-hover border border-app rounded-xl font-mono text-xs text-app-secondary hover:text-app-heading transition-colors uppercase tracking-wider"
                  >
                    Close dossier
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECURE SUBMISSION CONTACT GATE */}
        <section id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-app-input rounded-3xl border border-app p-6 sm:p-10 relative overflow-hidden backdrop-blur-md">
          {/* Graphic reflection light */}
          <div className={`absolute top-0 right-0 w-80 h-80 ${preset.bgSoft} rounded-full blur-[100px] pointer-events-none`} />

          {/* Left panel headers */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className={`text-[10px] font-mono font-black ${preset.textColor} uppercase tracking-widest block`}>05 // Get In Touch</span>
              <h2 className="text-2xl sm:text-3xl font-black text-app-heading tracking-tight uppercase leading-snug">
                Let&apos;s Work Together
              </h2>
              <p className="text-app-muted text-xs sm:text-sm leading-relaxed font-mono">
                Open to junior full-stack roles, freelance projects, and collaborations. Based in East London—happy to discuss remote or hybrid opportunities.
              </p>
              <p className="text-[11px] text-app-subtle font-mono leading-relaxed border-l-2 border-app pl-3">
                I build production-style apps with React, TypeScript, Node, and PostgreSQL. Recent work includes EduTrack, Envault CLI, and a Fastify job-board backend—all live on Cloud Run.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-app">
              {/* Telemetry copyable email row */}
              <div 
                onClick={handleCopyEmail}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-3.5 group/row cursor-pointer hover:bg-app-surface p-2 rounded-xl transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl bg-app-surface border border-app flex items-center justify-center group-hover/row:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-400/40 group-hover/row:bg-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-400/5 transition-all`}>
                  <Mail className={`w-4.5 h-4.5 ${preset.textColor}`} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-app-subtle block uppercase tracking-wider">E-mail Pipeline</span>
                  <span className="text-xs font-mono text-app-secondary group-hover/row:text-app-heading transition-colors flex items-center gap-1.5">
                    {profile.email} <Copy className={`w-3 h-3 text-app-subtle group-hover/row:${preset.textColor}`} />
                  </span>
                </div>
              </div>

              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-3.5 group/row p-2 rounded-xl transition-colors hover:bg-app-surface"
              >
                <div className={`w-10 h-10 rounded-xl bg-app-surface border border-app flex items-center justify-center group-hover/row:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-400/40 transition-all`}>
                  <Phone className={`w-4.5 h-4.5 ${preset.textColor}`} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-app-subtle block uppercase tracking-wider">Voice Link</span>
                  <span className="text-xs font-mono text-app-secondary group-hover/row:text-app-heading transition-colors">
                    {profile.phone}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-2">
                <div className="w-10 h-10 rounded-xl bg-app-surface border border-app-strong flex items-center justify-center">
                  <MapPin className={`w-4.5 h-4.5 ${preset.textColor}`} />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-app-subtle block uppercase tracking-wider">Operational Port</span>
                  <span className="text-xs font-mono text-app-secondary">
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="p-2 bg-app-surface hover:bg-app-surface-hover border border-app rounded-xl text-app-muted hover:text-app-heading transition-colors"
                title="GitHub Core"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="p-2 bg-app-surface hover:bg-app-surface-hover border border-app rounded-xl text-app-muted hover:text-app-heading transition-colors"
                title="LinkedIn Node"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="p-2 bg-app-surface hover:bg-app-surface-hover border border-app rounded-xl text-app-muted hover:text-app-heading transition-colors"
                title="Twitter Link"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Panel form client */}
          <div className="lg:col-span-7">
            <form onSubmit={handleFormSubmission} className="space-y-4">
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="absolute opacity-0 pointer-events-none h-0 w-0"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Smith"
                    className={`w-full bg-app-input border border-app focus:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 rounded-xl px-4 py-3 text-xs text-app-heading placeholder:text-app-subtle focus:outline-none focus:ring-1 focus:ring-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 transition-all font-mono`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    required
                    placeholder="jane@company.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-app-input border border-app focus:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 rounded-xl px-4 py-3 text-xs text-app-heading placeholder:text-app-subtle focus:outline-none focus:ring-1 focus:ring-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 transition-all font-mono`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  value={subject}
                  placeholder="Junior Developer Role / Freelance Project"
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full bg-app-input border border-app focus:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 rounded-xl px-4 py-3 text-xs text-app-heading placeholder:text-app-subtle focus:outline-none focus:ring-1 focus:ring-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 transition-all font-mono`}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-app-muted uppercase tracking-wider block">Message</label>
                  <span className={`text-[9px] font-mono ${message.length > 500 ? "text-red-400" : "text-app-subtle"}`}>
                    {message.length} / 600 characters max
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={message}
                  maxLength={600}
                  required
                  placeholder="Hi Myat, I saw your EduTrack and Job Board API projects. I'd like to discuss a role or project..."
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full bg-app-input border border-app focus:border-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 rounded-xl px-4 py-3 text-xs text-app-heading placeholder:text-app-subtle focus:outline-none focus:ring-1 focus:ring-${preset.id === "cyan" ? "sky" : preset.id === "violet" ? "purple" : preset.id === "emerald" ? "emerald" : "amber"}-500 transition-all font-mono resize-none`}
                />
              </div>

              {/* Character length validator banner warns */}
              {message.length > 550 && (
                <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-mono p-3 rounded-lg uppercase tracking-wide">
                  ⚠️ Danger: Input payload approaching max buffer length of 600.
                </div>
              )}

              {/* Status prompt details */}
              <AnimatePresence>
                {formState !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-app-input border border-app rounded-xl p-4 font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-app-muted border-b border-app-soft pb-2 mb-2">
                      <span className="flex items-center gap-1">
                        <Terminal className={`w-3.5 h-3.5 ${preset.textColor}`} /> secure_uplink_stream
                      </span>
                      <button 
                        type="button"
                        onClick={() => setFormState("idle")}
                        className="text-[9px] text-app-subtle hover:text-app-heading uppercase"
                      >
                        [clear logs]
                      </button>
                    </div>
                    {formFeedback.map((fb, idx) => (
                      <div key={idx} className="text-[11px] text-app-secondary">
                        &gt; {fb}
                      </div>
                    ))}
                    {formState === "sending" && (
                      <div className={`text-[11px] ${preset.textColor} flex items-center gap-1.5 pt-1.5`}>
                        <span className={`w-1.5 h-3.5 ${preset.bgColor} inline-block animate-pulse`} />
                        <span>transmitting data packets...</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={formState === "sending"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`py-3.5 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 glow-btn ${preset.btnClass} ${formState === "sending" ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Send className="w-4 h-4" /> Deploy Handshake Packet
              </button>

            </form>
          </div>

        </section>

      </main>

      {/* Terminal Grid Footer overlay */}
      <footer className="border-t border-app-soft bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-app-subtle uppercase tracking-[0.2em] font-medium font-sans">
            © 2026 {profile.name.toUpperCase()} STUDIO. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-8 text-[10px] text-app-subtle uppercase tracking-[0.2em] font-medium font-sans">
            <span>MODULES x{profile.completedProjects}</span>
            <div className="w-1.5 h-1.5 bg-app-border rounded-full" />
            <span>COMMITS x1.2k</span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono tracking-wider text-app-subtle uppercase">
            <a href="#skills" className="hover:text-app-heading transition-colors">SPEC GRID</a>
            <div className="w-1 h-1 bg-app-border rounded-full" />
            <a href="#projects" className="hover:text-app-heading transition-colors">WORKSPACE</a>
            <div className="w-1 h-1 bg-app-border rounded-full" />
            <a href="#contact" className="hover:text-app-heading transition-colors">SATELLITE</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
