# 📟 portfolio.os — Retro Terminal Portfolio

A retro-futuristic CRT terminal operating system portfolio built for **Aarav Mehta** (CS Student @ Jaypee Institute of Information Technology, Noida · GDG JIIT selection).

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![pnpm](https://img.shields.io/badge/pnpm-v12-F69220?style=for-the-badge&logo=pnpm)

---

## 🌟 Overview

`portfolio.os` simulates a personal command-line operating system inside a retro CRT phosphor monitor interface. It combines nostalgic retro-hacker aesthetics with modern web practices, responsive UI layout, and smooth animations.

### ✨ Key Features

- 🚀 **Cinematic Boot-up Sequence**: Displays system initialization checks (`PORTFOLIO.OS`, `ACCESS GRANTED.`) with skip capability (keypress, tap, or click).
- 💻 **Interactive CLI Terminal**: Full command line parser supporting:
  - `help` / `?`: Lists all available system commands.
  - `about` / `whoami`: Detailed profile background, role, and interests.
  - `skills` / `ls skills`: Categorized technical skill tree (C++, Python, MERN, Swift, Linux) with proficiency bars.
  - `projects` / `cat projects.log`: Indexed list of projects (`[01]` through `[04]`).
  - `open <01-04>`: Expands project details inline (summary, tech tags, GitHub repository, live demo) without breaking terminal state or route changing.
  - `education`: Academic credentials (B.Tech CSE @ JIIT Noida, GPA 8.85), coursework, and honors.
  - `contact`: Social links and interactive transmission form.
  - `theme [green|amber|blue]`: Live theme switcher for CRT phosphor colors.
  - `matrix`: Triggers a 4-second intense falling digital rain overlay.
  - `sudo make coffee`: Brews developer coffee easter egg (`☕ Coffee.exe initialized. Productivity +47%`).
  - `clear`: Resets terminal scrollback output.
- ⚡ **Command History**: Cycle through previously typed commands using the `↑` and `↓` arrow keys.
- 📱 **Mobile-First Quick Buttons**: Tap-friendly quick command pills for touch devices alongside full keyboard input support.
- 📊 **Ambient System Monitor**: Dynamic CPU (15–60%), MEM (40–75%), and NET (10–95%) usage metrics drifting continuously with spring bar transitions.
- 🎨 **Multi-Theme Phosphor Palette**:
  - **Green Phosphor**: Classic hacker terminal.
  - **Amber Terminal**: Warm retro workstation.
  - **Hacker Blue**: Cyan sci-fi interface.
  - Choice persists in `localStorage`.
- 🖱️ **Interactive Effects**: Radial mouse glow tracking, subtle background parallax, CRT scanlines, chromatic aberration, and vignette.
- ♿ **Accessibility & Performance**: Full `prefers-reduced-motion` compliance, ARIA accessibility labels, zero horizontal overflow at all viewport sizes (375px+).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer-motion.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📂 Project Structure

```text
├── app/
│   ├── globals.css        # CRT scanlines, glowing text, and theme variables
│   ├── layout.tsx         # Root layout with JetBrains Mono font & metadata
│   └── page.tsx           # Terminal shell entry point
├── components/
│   ├── boot-sequence.tsx  # Cinematic ~3s boot animation & skip handler
│   ├── crt-overlay.tsx    # Scanlines, vignette, chromatic aberration
│   ├── matrix-rain.tsx    # Canvas digital rain background & matrix easter egg
│   ├── system-monitor.tsx # Dynamic CPU/MEM/NET live metrics widget
│   ├── terminal-shell.tsx # Main shell wrapper, radial cursor glow & parallax
│   ├── terminal.tsx       # Core CLI command parser, input & history state
│   ├── typewriter.tsx     # Character-by-character typing renderer
│   └── sections/
│       ├── education.tsx  # Academic credentials section
│       ├── whoami.tsx     # Profile & about section
│       ├── skills.tsx     # Categorized skill tree section
│       ├── projects.tsx   # Numbered projects ([01]-[04]) inline expansion
│       └── contact.tsx    # Contact form & social links
└── lib/
    └── portfolio-data.ts  # Centralized editable data source (Profile, Skills, Projects, Education)
```

---

## 🚀 Quick Start & Installation

### Prerequisites

Ensure you have **Node.js** (v18+) and **pnpm** installed on your system.

```bash
# Clone the repository
git clone https://github.com/aaravmehta/portfolio-os.git
cd portfolio-os

# Install dependencies
pnpm install

# Start the local development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view your website.

---

## 🏗️ Building for Production

```bash
# Generate optimized production build
pnpm build

# Preview production build locally
pnpm start
```

---

## 📄 Customization

To edit the portfolio details, edit [lib/portfolio-data.ts](file:///c:/Users/Alok%20%20%20singh/Downloads/ieo1hOqireD/lib/portfolio-data.ts):
- Update `profile` (Name, role, university, bio, interests).
- Update `education` (GPA, coursework, achievements).
- Update `skillCategories` (Languages, Frameworks, Tools).
- Update `projects` (Titles, stack, summary, GitHub links).

---




