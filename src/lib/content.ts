export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  technologies: string[];
  repository_url: string;
  demo_url?: string | null;
  featured: boolean;
  status: "draft" | "published" | "archived";
  problem?: string | null;
  solution?: string | null;
  architecture?: string | null;
  challenges?: string | null;
  outcomes?: string | null;
};

type ProjectRecord = Project & {
  sort_order?: number | null;
};

export const fallbackProjects: Project[] = [
  {
    id: "spotter",
    title: "Spotter — Weather-Aware Truck Routing",
    slug: "spotter-weather-aware-routing",
    summary:
      "A full-stack route-planning application that compares routes using weather checkpoints, travel time, and load-sensitive risk rules.",
    category: "Full Stack",
    technologies: [
      "Python",
      "Django REST Framework",
      "React",
      "TypeScript",
      "MapLibre",
      "Open-Meteo",
      "OSRM",
    ],
    repository_url:
      "https://github.com/MahdiNoorzadeh/spotter-ai-weather-aware-routing",
    demo_url: "https://spotter-ai-weather-aware-routing.vercel.app/",
    featured: true,
    status: "published",
    problem:
      "Route choice can change when weather conditions and driving time are considered together.",
    solution:
      "Built a map-based workflow to compare up to three routes and visualize forecast-based risk.",
    architecture:
      "React and TypeScript frontend consuming a Django REST API, with OpenStreetMap, Open-Meteo, and OSRM integrations.",
    challenges:
      "Combining routing and hourly forecast data into a clear, time-aware map experience.",
    outcomes:
      "Route comparison, risk visualization, and a 0–48 hour forecast view.",
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    slug: "url-shortener",
    summary:
      "A backend-focused URL shortener with redirects, expiration, click statistics, PostgreSQL persistence, and Redis Cache-Aside caching.",
    category: "Backend",
    technologies: [
      "Java 25",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Flyway",
      "Docker",
      "JUnit",
      "Mockito",
      "Testcontainers",
    ],
    repository_url: "https://github.com/MahdiNoorzadeh/url-shortener",
    featured: true,
    status: "published",
    problem:
      "Short links need predictable redirects, expiration behavior, and efficient repeated lookups.",
    solution:
      "Implemented URL creation, redirects, expiration, click statistics, and a Redis Cache-Aside pattern with URL-aligned TTL.",
    architecture:
      "Spring Boot REST API backed by PostgreSQL, Redis caching, Flyway migrations, and Docker Compose.",
    challenges:
      "Keeping cache TTL aligned with URL expiry and testing persistence and caching behavior.",
    outcomes:
      "OpenAPI documentation, health checks, validation, automated tests, and GitHub Actions CI.",
  },
  {
    id: "ciphervault",
    title: "CipherVault",
    slug: "ciphervault",
    summary:
      "A desktop API-token manager using AES-256-GCM encryption and operating-system keyring storage for the master key.",
    category: "Desktop & Security",
    technologies: [
      "Electron",
      "Vue 3",
      "Vuetify",
      "Realm",
      "AES-256-GCM",
      "Keytar",
    ],
    repository_url: "https://github.com/MahdiNoorzadeh/CipherVault",
    featured: true,
    status: "published",
    problem:
      "Developer API tokens need safer local storage and clear separation between UI and privileged operations.",
    solution:
      "Built a desktop token manager with encrypted token records, project/environment organization, and OS-keyring master-key storage.",
    architecture:
      "Electron main process handles privileged operations and cryptography while the Vue renderer uses validated IPC calls.",
    challenges:
      "Reducing plaintext exposure and hardening the Electron renderer-to-main-process boundary.",
    outcomes:
      "Context isolation, restrictive renderer settings, Content Security Policy, IPC sender validation, and encryption tests.",
  },
];

export const fallbackExperience = [
  {
    id: "raastar",
    company: "Raastar",
    role: "Backend Developer (Contract)",
    location: "Remote",
    start_date: "2025-10-01",
    end_date: "2025-12-31",
    description:
      "Delivered backend work across Go, Java/Spring Boot, and C#/.NET, including multi-tenant REST APIs and Java/MongoDB services. Adapted implementations to client requirements and coordinated delivery with cross-functional teams.",
  },
  {
    id: "bashomal",
    company: "BaShomal",
    role: "Backend Developer Intern",
    location: "Remote",
    start_date: "2025-03-01",
    end_date: "2025-08-31",
    description:
      "Analyzed and modernized legacy Java/Spring Boot services, configured Jenkins CI/CD pipelines, integrated PostgreSQL persistence, reviewed code in GitLab, and contributed to Agile sprint delivery.",
  },
];

export const skills = [
  {
    category: "Languages",
    items: ["Java", "C#", "Go", "Python", "JavaScript", "TypeScript"],
  },
  {
    category: "Frameworks",
    items: [
      "Spring Boot",
      "ASP.NET Core / .NET",
      "Node.js",
      "Django REST Framework",
      "React",
      "Vue 3",
      "Electron",
    ],
  },
  {
    category: "Data & DevOps",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Docker Compose",
      "Jenkins",
      "GitHub Actions",
      "Linux",
    ],
  },
  {
    category: "Testing & APIs",
    items: [
      "REST APIs",
      "JUnit",
      "Mockito",
      "Testcontainers",
      "Postman",
      "OpenAPI / Swagger",
      "CI/CD",
    ],
  },
];

export async function getProjects(): Promise<Project[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return fallbackProjects;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(url, key);

    const { data, error } = await db
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order");

    if (error || !data) return fallbackProjects;

    return (data as ProjectRecord[]).map((project) => ({
      ...project,
      technologies: project.technologies ?? [],
    }));
  } catch {
    return fallbackProjects;
  }
}

export async function getProject(
  slug: string,
): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getExperience() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return fallbackExperience;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(url, key);

    const { data, error } = await db
      .from("experience")
      .select("*")
      .eq("status", "published")
      .order("sort_order");

    return error || !data?.length ? fallbackExperience : data;
  } catch {
    return fallbackExperience;
  }
}

export const fallbackProfile = {
  full_name: "Mehdi Nourzadeh",
  headline: "Software Engineer | Backend Engineer",
  summary:
    "Early-career Software/Backend Engineer with hands-on experience building REST APIs and backend services in Java/Spring Boot, C#/.NET, and Go. I build reliable APIs, backend services, and developer tools.",
  email: "mahdinoorzadeh1@gmail.com",
  location: "",
  availability: "Open to software and backend opportunities",
  github_url: "https://github.com/MahdiNoorzadeh",
  linkedin_url: "",
  website_url: "https://mahdinoorzadeh.github.io/",
  resume_url: "/files/mahdi-nourzadeh-resume.pdf",
};

export async function getProfile() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return fallbackProfile;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(url, key);

    const { data, error } = await db
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    return error || !data ? fallbackProfile : { ...fallbackProfile, ...data };
  } catch {
    return fallbackProfile;
  }
}

export async function getSkills() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return skills;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient(url, key);

    const { data, error } = await db
      .from("skills")
      .select("name,category")
      .order("sort_order");

    if (error || !data?.length) return skills;

    const grouped = new Map<string, string[]>();

    for (const skill of data) {
      grouped.set(skill.category, [
        ...(grouped.get(skill.category) || []),
        skill.name,
      ]);
    }

    return Array.from(grouped, ([category, items]) => ({
      category,
      items,
    }));
  } catch {
    return skills;
  }
}
