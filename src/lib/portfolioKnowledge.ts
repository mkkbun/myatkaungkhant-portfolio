import {
  INITIAL_PROFILE,
  PROJECTS,
  SKILL_CATEGORIES,
  EXPERIENCES,
  BLOG_POSTS,
} from "../types";

export function buildPortfolioContext(): string {
  const skills = SKILL_CATEGORIES.map(
    (c) => `${c.title}: ${c.skills.join(", ")}`
  ).join("\n");

  const projects = PROJECTS.map(
    (p) =>
      `- ${p.title} (${p.category}): ${p.description} Stack: ${p.language}. Live: ${p.liveUrl} GitHub: ${p.githubUrl}`
  ).join("\n");

  const experience = EXPERIENCES.map((e) => {
    const body = e.highlights?.length
      ? e.highlights.map((h) => `  • ${h}`).join("\n")
      : e.description;
    return `- ${e.period} | ${e.role} @ ${e.company} (${e.location}):\n${body}`;
  }).join("\n\n");

  const featured = BLOG_POSTS.map((b) => `- ${b.title}: ${b.summary}`).join("\n");

  return `
Name: ${INITIAL_PROFILE.name}
Role: ${INITIAL_PROFILE.role}
Location: ${INITIAL_PROFILE.location}
Email: ${INITIAL_PROFILE.email}
Phone: ${INITIAL_PROFILE.phone}
Bio: ${INITIAL_PROFILE.bio}
GitHub: ${INITIAL_PROFILE.githubUrl}
LinkedIn: ${INITIAL_PROFILE.linkedinUrl}
CV download: ${INITIAL_PROFILE.cvUrl}
Years of experience: ${INITIAL_PROFILE.yearsExperience}
Projects completed: ${INITIAL_PROFILE.completedProjects}
Case studies: ${INITIAL_PROFILE.caseStudies}
Availability: ${INITIAL_PROFILE.availability}
Right to work: ${INITIAL_PROFILE.rightToWork}

Skills:
${skills}

Projects:
${projects}

Featured case studies:
${featured}

Experience:
${experience}
`.trim();
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

export function answerPortfolioQuestion(raw: string): string {
  const q = raw.trim().toLowerCase();
  if (!q) {
    return "Ask me anything about Myat's skills, projects, experience, or how to get in touch.";
  }

  const p = INITIAL_PROFILE;

  if (includesAny(q, ["who are you", "who is myat", "about you", "about myat", "introduce"])) {
    return `${p.name} is a ${p.role} based in ${p.location}. ${p.bio}`;
  }

  if (includesAny(q, ["name", "called"])) {
    return `His name is ${p.name}.`;
  }

  if (includesAny(q, ["role", "job title", "position", "developer type"])) {
    return `He is a ${p.role}.`;
  }

  if (includesAny(q, ["where", "location", "based", "live", "london"])) {
    return `He is based in ${p.location}.`;
  }

  if (includesAny(q, ["email", "mail", "e-mail"])) {
    return `You can email him at ${p.email}.`;
  }

  if (includesAny(q, ["phone", "call", "number", "mobile", "contact number"])) {
    return `His phone number is ${p.phone}.`;
  }

  if (includesAny(q, ["open to work", "available", "looking for", "hiring", "job hunt", "employed"])) {
    return `${p.availability}. ${p.rightToWork}. Reach out at ${p.email} or use the contact form.`;
  }

  if (
    includesAny(q, [
      "contact",
      "reach",
      "hire",
      "message",
      "get in touch",
      "collaborate",
      "work together",
    ])
  ) {
    return `To contact ${p.name}: email ${p.email}, phone ${p.phone}, or use the contact form on this portfolio. He is open to junior full-stack roles, freelance work, and collaborations (remote or hybrid).`;
  }

  if (includesAny(q, ["github", "git hub", "repo"])) {
    return `GitHub profile: ${p.githubUrl}. Each project card also has its own repository link.`;
  }

  if (includesAny(q, ["linkedin", "linked in"])) {
    return `LinkedIn profile: ${p.linkedinUrl}`;
  }

  if (includesAny(q, ["cv", "resume", "curriculum"])) {
    return `You can download his CV from the hero section ("Download CV") or directly at ${p.cvUrl}.`;
  }

  if (includesAny(q, ["skill", "stack", "technology", "tech", "know", "framework"])) {
    const lines = SKILL_CATEGORIES.map(
      (c) => `• ${c.title}: ${c.skills.slice(0, 6).join(", ")}${c.skills.length > 6 ? "…" : ""}`
    );
    return `Key skills:\n${lines.join("\n")}`;
  }

  if (includesAny(q, ["experience", "work history", "job", "career", "worked", "company"])) {
    if (EXPERIENCES.length === 0) {
      return "Experience details are listed in the Experience section of this portfolio.";
    }
    return EXPERIENCES.map(
      (e) => `• ${e.period}: ${e.role} at ${e.company} (${e.location})`
    ).join("\n");
  }

  if (includesAny(q, ["featured", "case study", "insight", "blog", "article"])) {
    return BLOG_POSTS.map((b) => `• ${b.title} — ${b.summary}`).join("\n\n");
  }

  if (includesAny(q, ["how many project", "number of project", "projects count"])) {
    return `He has ${PROJECTS.length} projects showcased (${p.completedProjects}+ in profile stats).`;
  }

  if (includesAny(q, ["project", "portfolio", "built", "app", "demo", "live"])) {
    const matched = PROJECTS.filter(
      (proj) =>
        q.includes(proj.id.replace(/-/g, " ")) ||
        q.includes(proj.title.toLowerCase()) ||
        proj.title.toLowerCase().split(" ").some((word) => word.length > 3 && q.includes(word))
    );

    if (matched.length === 1) {
      const proj = matched[0];
      return `${proj.title}: ${proj.description}\n\nStack: ${proj.language}\nLive demo: ${proj.liveUrl}\nGitHub: ${proj.githubUrl}`;
    }

    if (matched.length > 1) {
      return matched.map((proj) => `• ${proj.title} — ${proj.liveUrl}`).join("\n");
    }

    return `Projects (${PROJECTS.length}):\n${PROJECTS.map((proj) => `• ${proj.title} — ${proj.description.slice(0, 90)}…`).join("\n")}\n\nAsk about a specific project by name (e.g. EduTrack, Envault).`;
  }

  if (includesAny(q, ["pos", "apex", "inventory", "retail", "checkout"])) {
    const proj = PROJECTS.find((x) => x.id === "pos-inventory");
    return proj
      ? `${proj.title}: ${proj.description}\nLive: ${proj.liveUrl}\nGitHub: ${proj.githubUrl}`
      : "See Apex POS & Inventory in his projects.";
  }

  if (includesAny(q, ["edutrack", "edu track"])) {
    const proj = PROJECTS.find((x) => x.id === "edutrack");
    return proj
      ? `${proj.title}: ${proj.description}\nLive: ${proj.liveUrl}`
      : "EduTrack is an academic attendance platform in his portfolio.";
  }

  if (includesAny(q, ["envault", "secret", "cli"])) {
    const proj = PROJECTS.find((x) => x.id === "envault-cli");
    return proj ? `${proj.title}: ${proj.description}\nLive: ${proj.liveUrl}` : "See Envault CLI in projects.";
  }

  if (
    includesAny(q, [
      "patient assistant",
      "ai chatbot",
      "healthcare",
      "gemini",
      "clinic",
      "dental assistant",
    ])
  ) {
    const proj = PROJECTS.find((x) => x.id === "ai-patient-assistant");
    return proj
      ? `${proj.title}: ${proj.description}\nLive: ${proj.liveUrl}\nGitHub: ${proj.githubUrl}`
      : "See UK AI Patient Assistant in his projects.";
  }

  if (includesAny(q, ["years", "experience year", "how long"])) {
    return `About ${p.yearsExperience}+ years of engineering experience (as shown on his portfolio).`;
  }

  if (
    includesAny(q, [
      "weather",
      "football",
      "recipe",
      "president",
      "bitcoin",
      "joke",
      "math problem",
      "write code for",
    ])
  ) {
    return "I only answer questions about Myat Kaung Khant's portfolio — skills, projects, experience, and contact info. Try: \"What projects has he built?\" or \"How can I contact him?\"";
  }

  return `I can help with ${p.name}'s portfolio only. Try asking:\n• What are his skills?\n• List his projects\n• Tell me about EduTrack\n• How can I contact him?\n• What is his experience?`;
}
