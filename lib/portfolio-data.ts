// Central content source for the terminal portfolio.
// Everything the "OS" renders is driven from here so it is easy to edit.

export const profile = {
  name: "Aarav Mehta",
  handle: "aarav",
  host: "jiit-noida",
  role: "CS Student · Aspiring ML/AI Engineer",
  university: "Jaypee Institute of Information Technology, Noida",
  degree: "B.Tech, Computer Science & Engineering",
  location: "Noida, India",
  bio: [
    "Undergraduate CS student focused on machine learning systems and",
    "the infrastructure that makes them fast, reliable, and useful.",
    "I like turning messy problems into clean, well-structured software —",
    "from low-level C++ with STL to full-stack MERN apps and native iOS.",
  ],
  interests: [
    "ML/AI systems & applied deep learning",
    "Data structures, algorithms & OOP in C++",
    "Full-stack engineering (MERN & Next.js)",
    "Developer tooling & system automation",
  ],
}

export type EducationInfo = {
  institution: string
  degree: string
  branch: string
  duration: string
  gpa: string
  location: string
  coursework: string[]
  achievements: string[]
}

export const education: EducationInfo = {
  institution: "Jaypee Institute of Information Technology (JIIT)",
  degree: "Bachelor of Technology (B.Tech)",
  branch: "Computer Science & Engineering",
  duration: "2022 — 2026",
  gpa: "8.85 / 10.0",
  location: "Noida, UP, India",
  coursework: [
    "Data Structures & Algorithms (C++)",
    "Object-Oriented Programming & Design",
    "Machine Learning & Data Mining",
    "Database Management Systems (DBMS)",
    "Operating Systems & Systems Programming",
    "Computer Networks & Web Security",
  ],
  achievements: [
    "GDG JIIT Active Community Member & Tech Contributor",
    "Top 5% in Institute Competitive Programming Contests",
    "Dean's List Academic Merit Holder",
  ],
}

export type SkillCategory = {
  category: string
  items: {
    name: string
    level: number // 0-100
    note: string
  }[]
}

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages & Core",
    items: [
      { name: "cpp.h", level: 92, note: "OOP, STL, DSA & Low-level Systems" },
      { name: "python.py", level: 88, note: "ML modeling, pandas, PyTorch" },
      { name: "typescript.ts", level: 85, note: "ES2023, Async/Await, Strict Types" },
      { name: "swift.swift", level: 72, note: "SwiftUI, MVVM, iOS Apps" },
    ],
  },
  {
    category: "Frameworks & Web",
    items: [
      { name: "react.jsx", level: 88, note: "Hooks, State, Virtual DOM" },
      { name: "nextjs.app", level: 84, note: "App Router, SSR, Server Components" },
      { name: "express.node", level: 82, note: "RESTful APIs, Middleware, JWT" },
      { name: "mongodb.db", level: 80, note: "Aggregation, Mongoose, Schemas" },
      { name: "tailwindcss.css", level: 90, note: "Custom Design Systems & Utility CSS" },
    ],
  },
  {
    category: "Tools & Environment",
    items: [
      { name: "git.cfg", level: 86, note: "Branching, CI/CD Actions, Rebase" },
      { name: "linux.sh", level: 82, note: "Bash Scripting, System Admin, POSIX" },
      { name: "docker.env", level: 75, note: "Containerization, Multi-stage Builds" },
    ],
  },
]

// Flat skills array for backward compatibility
export const skills = skillCategories.flatMap((c) => c.items)

export type Project = {
  num: string // "01", "02", "03", "04"
  id: string
  file: string
  title: string
  stack: string[]
  year: string
  summary: string
  details: string[]
  repo?: string
  link?: string
}

export const projects: Project[] = [
  {
    num: "01",
    id: "smart-parking",
    file: "smart_parking.cpp",
    title: "Secure Online Voting / Smart Parking System",
    stack: ["C++", "OOP", "STL", "Cryptography"],
    year: "2024",
    summary: "Console-based allocator with real-time slot tracking and defensive resource handling.",
    details: [
      "Designed a class hierarchy (Vehicle, Slot, Lot, Ticket) using clean OOP principles.",
      "Used STL containers (map, priority_queue, vector) for O(log n) slot allocation and search.",
      "Added persistence, billing by duration, and defensive input validation.",
    ],
    repo: "https://github.com/aaravmehta/smart-parking-cpp",
    link: "https://github.com/aaravmehta/smart-parking-cpp",
  },
  {
    num: "02",
    id: "mood-tracker",
    file: "mood_tracker.jsx",
    title: "Campus Marketplace & Mood Tracker",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    year: "2024",
    summary: "Full-stack MERN application for institute community trading and emotional trend tracking.",
    details: [
      "Built full MERN stack: Express/Mongo REST API with a React responsive dashboard.",
      "Visualizes weekly/monthly emotional trends with streak tracking and analytics.",
      "Implemented JWT authentication, optimistic UI updates, and responsive charts.",
    ],
    repo: "https://github.com/aaravmehta/mood-tracker-mern",
    link: "https://mood-tracker-demo.vercel.app",
  },
  {
    num: "03",
    id: "ios-app",
    file: "focus_ios.swift",
    title: "Focus — Native SwiftUI iOS Application",
    stack: ["Swift", "SwiftUI", "SwiftData", "CoreHaptics"],
    year: "2025",
    summary: "Native iOS focus timer with haptics, WidgetKit support, and session analytics.",
    details: [
      "Built entirely in SwiftUI adhering strictly to MVVM architecture pattern.",
      "Live Activities + home-screen widget integration for live session tracking.",
      "Local data persistence via SwiftData and tactile Core Haptics feedback.",
    ],
    repo: "https://github.com/aaravmehta/focus-ios-swift",
  },
  {
    num: "04",
    id: "timetable-parser",
    file: "timetable_parser.py",
    title: "Timetable & Schedule Parsing Toolkit",
    stack: ["Python", "pandas", "regex", "iCalendar"],
    year: "2024",
    summary: "Automated parser converting institute PDF/HTML timetables into `.ics` calendar feeds.",
    details: [
      "Extracts structured schedule data from messy PDF and HTML exports using regex & pandas.",
      "Normalizes room allocations, lab batches, and time slots into standard `.ics` feeds.",
      "Saves hours of manual schedule entry every semester for over 300+ CS students.",
    ],
    repo: "https://github.com/aaravmehta/jiit-timetable-parser",
    link: "https://jiit-timetable-parser.vercel.app",
  },
]

export const socials = [
  { label: "github", value: "github.com/aaravmehta", href: "https://github.com" },
  { label: "linkedin", value: "linkedin.com/in/aaravmehta", href: "https://linkedin.com" },
  { label: "email", value: "aarav@jiit.ac.in", href: "mailto:aarav@jiit.ac.in" },
]
