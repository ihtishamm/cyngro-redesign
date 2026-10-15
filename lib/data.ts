// All copy below is sourced from cyngro.com (home, /about-us, /solutions),
// lightly trimmed to fit the new layout.

export const contact = {
  email: "info@cyngro.com",
  timezone: "Europe/London",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/cyngroofficial" },
    { label: "Instagram", href: "https://www.instagram.com/cyngroofficial/" },
    { label: "X", href: "https://x.com/cyngroofficial" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/cyngro" },
  ],
};

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 250, suffix: "+", label: "Tech experts" },
  { value: 10, suffix: "+", label: "Countries served" },
  { value: 700, suffix: "+", label: "Active clients" },
];

export type Service = {
  code: string;
  short: string;
  title: [string, string];
  blurb: string;
  points: string[];
  footer: string;
};

export const services: Service[] = [
  {
    code: "CYN/SVC.01-WEB",
    short: "WEB",
    title: ["Website", "Development"],
    blurb:
      "Quick, responsive, SEO-friendly websites that captivate users and turn visitors into leads.",
    points: ["Mobile-first, clean code", "Marketing sites & portals", "eCommerce platforms"],
    footer: "Built to attract qualified traffic",
  },
  {
    code: "CYN/SVC.02-SFT",
    short: "SFT",
    title: ["Software", "Development"],
    blurb:
      "Software designed to increase productivity, automate processes and help your company grow.",
    points: ["Agile, modular delivery", "Internal tools & platforms", "Cloud enterprise apps"],
    footer: "Performs under real-world conditions",
  },
  {
    code: "CYN/SVC.03-APP",
    short: "APP",
    title: ["App", "Development"],
    blurb:
      "iOS and Android apps that focus on usability, performance and a smooth user experience.",
    points: ["Swift, Kotlin, React Native, Flutter", "API & backend integration", "Store deployment"],
    footer: "Engaging on every device",
  },
  {
    code: "CYN/SVC.04-ERP",
    short: "ERP",
    title: ["Odoo", "ERP"],
    blurb:
      "Accounting, inventory, sales, HR and manufacturing — unified in one streamlined Odoo platform.",
    points: ["Configuration & migration", "Tailored custom modules", "Training & long-term support"],
    footer: "One system, total visibility",
  },
  {
    code: "CYN/SVC.05-STK",
    short: "STK",
    title: ["Tech", "Stack"],
    blurb:
      "Modern, proven stacks for reliable, secure and scalable solutions across web, mobile and cloud.",
    points: ["React, Vue, Node, Django, .NET", "CI/CD & test automation", "Modular architecture"],
    footer: "Future-proof by design",
  },
  {
    code: "CYN/SVC.06-CLD",
    short: "CLD",
    title: ["Cloud", "Integration"],
    blurb:
      "Scale faster, improve accessibility and ensure business continuity with tailored cloud deployments.",
    points: ["AWS & Microsoft Azure", "Migration & DevOps", "Continuity planning"],
    footer: "Always on, always scaling",
  },
];

export type Project = {
  id: string;
  client: string;
  role: string;
  tags: string;
  kind: "erp" | "app" | "fintech" | "saas";
  summary: string;
  quote: string;
  person: string;
};

// Cyngro has no public portfolio page; these are the client engagements the
// site itself names in its testimonials, plus its SaaS showcase from /solutions.
export const projects: Project[] = [
  {
    id: "stellarmart",
    client: "StellarMart",
    role: "Custom ERP solution",
    tags: "Odoo ERP, Integrations",
    kind: "erp",
    summary:
      "A custom ERP that unified inventory, sales and accounting into one real-time platform — delivered ahead of schedule.",
    quote:
      "Cyngro delivered our custom ERP solution ahead of schedule. Their team's attention to detail and communication were top-notch. It's rare to find such reliability in tech partners.",
    person: "Amit Shah, Operations Director",
  },
  {
    id: "healthnow",
    client: "HealthNow",
    role: "Mobile application",
    tags: "iOS, Android, UX/UI",
    kind: "app",
    summary:
      "From concept to launch in record time — a patient-facing mobile app built for performance, design and experience.",
    quote:
      "Our mobile app went from concept to launch in record time thanks to Cyngro. The performance, design, and user experience exceeded expectations. Couldn't have asked for more.",
    person: "Lisa Tran, Product Manager",
  },
  {
    id: "finedge",
    client: "FinEdge Solutions",
    role: "Web & software platform",
    tags: "Web, Software, Team as a Service",
    kind: "fintech",
    summary:
      "A two-year partnership across multiple web and software projects, with Cyngro developers working as an extension of the team.",
    quote:
      "We've worked with Cyngro for over 2 years now. They've handled multiple web and software projects with consistency and quality. Their developers feel like an extension of our team.",
    person: "David Kim, CTO",
  },
  {
    id: "saas",
    client: "Custom SaaS Suite",
    role: "Productivity & operations",
    tags: "SaaS, Dashboards, Automation",
    kind: "saas",
    summary:
      "Role-based dashboards, automated workflows, custom CRM pipelines and asset tracking — purpose-built SaaS tools that fit how a business actually works.",
    quote:
      "We build purpose-driven SaaS tools tailored to how your business actually works — no fluff, just solutions that deliver real results.",
    person: "Cyngro Solutions",
  },
];

export const process = [
  {
    n: "01",
    title: ["Discovery", "& Consultation"],
    body: "We uncover how your team operates and where the gaps are — then shape it into a clear brief with scope, goals and success metrics.",
  },
  {
    n: "02",
    title: ["Planning", "& Blueprinting"],
    body: "User flows, wireframes and a full system blueprint, so you can see how it works before a single line of code is written.",
  },
  {
    n: "03",
    title: ["Agile", "Development"],
    body: "Working software every sprint, with regular demos. Clean, documented, version-controlled — and flexible when priorities shift.",
  },
  {
    n: "04",
    title: ["Testing", "& Optimization"],
    body: "Automated and manual QA, security audits, load and accessibility checks. Nothing leaves our hands untested.",
  },
  {
    n: "05",
    title: ["Deployment", "& Support"],
    body: "A zero-disruption launch, team training and documentation — and we stay for the next phase too.",
  },
];

export const awards = [
  { title: "UK's Fastest-Growing Tech Companies", year: "2025", by: "Financial Times" },
  { title: "Top 500 UK IT Innovators", year: "2025", by: "CIO 100" },
  { title: "UK Top Software Developers", year: "2025", by: "Clutch" },
  { title: "Top 100 Global Outsourcing Providers", year: "2024", by: "Outsourcing 100" },
];

export const pillars = [
  { title: "The Right People", body: "A rigorous hiring process means only rock-solid, skilled engineers make it through." },
  { title: "The Right Process", body: "A proven delivery model that keeps your project on time, on track and stress-free." },
  { title: "The Right Tools", body: "The latest stacks and frameworks to build smarter, faster and better." },
  { title: "The Right Mindset", body: "Ownership, adaptability and a focus on real business value." },
];

export const industries = [
  "Agriculture",
  "Finance",
  "Insurance",
  "Real Estate",
  "Automotive",
  "Construction",
  "Retail",
  "Transportation & Logistics",
  "Entertainment",
  "Healthcare",
  "Oil & Gas",
  "Supply Chain",
  "Travel & Hospitality",
];

export const technologies = [
  "AWS",
  "Django",
  "Java",
  "PHP",
  "React",
  "Golang",
  "JavaScript",
  "Azure",
  "Ruby",
  "Vue.js",
  "Kotlin",
  "Node.js",
  "Python",
  "Xamarin",
];
