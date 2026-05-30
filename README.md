# Myat Kaung Khant — Developer Portfolio

A modern, glassmorphic personal portfolio built with **React 19**, **TypeScript**, and **Vite**. Designed to showcase full-stack development skills with smooth motion design, interactive 3D visuals, and a polished dark UI.

**Live repository:** [github.com/mkkbun/myatkaungkhant-portfolio](https://github.com/mkkbun/myatkaungkhant-portfolio)

---

## About

This project is the official portfolio site for **Myat Kaung Khant**, a Junior Developer & Full Stack Developer based in **East London, UK**. It presents profile information, technical skills, selected projects, work experience, blog highlights, and a contact section in a single-page, recruiter-friendly layout.

The interface uses a cyber-glass aesthetic: frosted panels, gradient accents, custom cursor tracking, and responsive sections that work on desktop and mobile.

---

## Features

| Area | Highlights |
|------|------------|
| **Hero** | Animated typewriter role labels, profile card with skill tags, live stats |
| **Skills** | Categorized stacks (Frontend, Backend, Database, Mobile) with spotlight modals |
| **Projects** | Filterable portfolio grid with simulated build terminal |
| **Experience** | Timeline of roles with technology tags |
| **Blog** | Article cards with expandable reading view |
| **Contact** | Working contact form → email inbox (Gmail SMTP), copy email, phone link, social links |
| **UX** | 4 accent themes, 3D tilt cards, mouse-reactive background glow, custom cursor |
| **3D** | Interactive canvas (torus, crystal, DNA, wave) synced to theme colors |

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`)
- **Animation:** Motion (Framer Motion)
- **Icons:** Lucide React
- **3D / Canvas:** Custom `Interactive3DCanvas` (Canvas 2D projection)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (included with Node.js)

### Installation

```bash
git clone https://github.com/mkkbun/myatkaungkhant-portfolio.git
cd myatkaungkhant-portfolio
npm install
```

### Contact form email setup

Messages from the website are sent to your inbox via Gmail SMTP.

1. Copy the env template:
   ```bash
   cp .env.example .env.local
   ```
2. Turn on **2-Step Verification** for your Google account.
3. Create an **App Password**: [Google App Passwords](https://myaccount.google.com/apppasswords) → choose “Mail” → copy the 16-character password.
4. Edit `.env.local`:
   ```env
   SMTP_USER=myatkaungkhant022@gmail.com
   SMTP_PASS=your_app_password_here
   CONTACT_TO_EMAIL=myatkaungkhant022@gmail.com
   ```
5. Run `npm run dev` (starts the API on port **3001** and the site on **3000**).

When someone submits the contact form, you receive an email with their name, email, subject, and message. **Reply** in Gmail goes directly to the visitor.

> **Live deployment:** The API must run on a host with your SMTP env vars (e.g. Railway, Render, Fly.io). Set `VITE_API_URL` to that API URL when building the frontend. Static-only hosting (GitHub Pages) cannot send email without a separate backend.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The contact API runs at `http://localhost:3001` and is proxied through `/api` in development.

### Production build

```bash
npm run build
npm run preview
```

### Type check

```bash
npm run lint
```

---

## Project Structure

```
├── src/
│   ├── App.tsx                 # Main layout, sections, theme & contact UI
│   ├── types.ts                # Profile, projects, experience, blog data
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles & Tailwind
│   ├── lib/contact.ts          # Contact form API client
│   └── components/
│       └── Interactive3DCanvas.tsx
├── server/
│   └── index.ts                # Contact form email API (Nodemailer)
├── assets/                     # Static assets
├── index.html
├── vite.config.ts
├── package.json
└── .env.example                # SMTP credentials template for contact form
```

---

## Customization

Edit **`src/types.ts`** to update portfolio content:

- `INITIAL_PROFILE` — name, role, bio, location, phone, email, social URLs, stats
- `SKILL_CATEGORIES` — skill groups and tags
- `PROJECTS` — portfolio case studies
- `EXPERIENCES` — work history
- `BLOG_POSTS` — blog entries

The in-app **Control Panel** (gear icon, bottom-right) lets you adjust accent color and location at runtime; **Reset telemetry** restores defaults from `INITIAL_PROFILE`.

---

## Deployment

The app is a static SPA after `npm run build` (`dist/` folder).

| Platform | Notes |
|----------|--------|
| **Vercel / Netlify** | Connect the repo; build command `npm run build`, output `dist` |
| **GitHub Pages** | Set `base: '/myatkaungkhant-portfolio/'` in `vite.config.ts`, then deploy `dist` |

---

## Contact

| | |
|---|---|
| **Name** | Myat Kaung Khant |
| **Role** | Junior Developer & Full Stack Developer |
| **Location** | London, East London |
| **Email** | [myatkaungkhant022@gmail.com](mailto:myatkaungkhant022@gmail.com) |
| **Phone** | [+44 777 441 4594](tel:+447774414594) |
| **GitHub** | [@mkkbun](https://github.com/mkkbun) |

---

## License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">
  Built with React & Vite · © 2026 Myat Kaung Khant
</p>
