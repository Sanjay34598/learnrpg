/**
 * roles.js
 * ─────────────────────────────────────────────────────────────────────────
 * Career path definitions.
 *
 * Each role maps to an ordered array of sections.
 * Each section lists course IDs that appear in courses.js.
 *
 * Fields:
 *   id          — URL slug used in role.html?id=<id>
 *   title       — display name
 *   emoji       — icon shown on the card
 *   tagline     — one-line sell
 *   description — 2–3 sentence description shown on the role page
 *   color       — primary accent hex (used for glow / active states)
 *   gradient    — CSS gradient string for the card header
 *   difficulty  — beginner label
 *   duration    — rough time estimate
 *   skills[]    — bullet list of tools shown on the card
 *   sections[]  — ordered learning sections
 *     .id          — section slug
 *     .name        — display name
 *     .emoji       — icon
 *     .description — what this section covers
 *     .courses[]   — course IDs from COURSES
 */

/* global ROLES */
const ROLES = {

  /* ── Data Analyst ──────────────────────────────────────────── */
  "data-analyst": {
    id:          "data-analyst",
    title:       "Data Analyst",
    emoji:       "📊",
    tagline:     "Transform raw data into business insights",
    description: "Master the tools and techniques used daily by analysts: SQL for querying, Python and Pandas for processing, statistics for reasoning, and BI tools for presenting results that drive real decisions.",
    color:       "#3b82f6",
    gradient:    "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
    difficulty:  "Beginner-Friendly",
    duration:    "3–6 months",
    skills:      ["SQL", "Python", "Excel", "Power BI / Tableau", "Statistics"],
    sections: [
      {
        id:          "foundation",
        name:        "Foundation",
        emoji:       "🏗️",
        description: "Build the core skills every analyst relies on every day.",
        courses:     ["python", "database", "excel"]
      },
      {
        id:          "data-skills",
        name:        "Data Skills",
        emoji:       "🔬",
        description: "Learn to clean, reshape, and analyse real-world datasets.",
        courses:     ["pandas", "statistics", "cleaning"]
      },
      {
        id:          "visualization",
        name:        "Visualization & BI",
        emoji:       "📈",
        description: "Turn analysis into charts, dashboards, and business decisions.",
        courses:     ["visualization", "bi", "business"]
      },
      {
        id:          "career",
        name:        "Career Ready",
        emoji:       "💼",
        description: "Advanced SQL, storytelling, and interview preparation.",
        courses:     ["advancedSql", "storytelling", "portfolio", "interview"]
      }
    ]
  },

  /* ── ML Engineer ───────────────────────────────────────────── */
  "ml-engineer": {
    id:          "ml-engineer",
    title:       "ML Engineer",
    emoji:       "🤖",
    tagline:     "Build and deploy machine learning systems",
    description: "Go from Python fundamentals to building, evaluating, and deploying machine learning models. Covers vectorised computation, statistical foundations, model selection, and cloud deployment.",
    color:       "#8b5cf6",
    gradient:    "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
    difficulty:  "Intermediate",
    duration:    "4–8 months",
    skills:      ["Python", "NumPy", "Pandas", "Scikit-learn", "Statistics"],
    sections: [
      {
        id:          "python-data",
        name:        "Python & Data",
        emoji:       "🐍",
        description: "Master Python and numeric computing with NumPy and Pandas.",
        courses:     ["python", "numpy", "pandas"]
      },
      {
        id:          "math-stats",
        name:        "Math & Statistics",
        emoji:       "📐",
        description: "The mathematical foundations that make ML models meaningful.",
        courses:     ["statistics", "cleaning"]
      },
      {
        id:          "ml-core",
        name:        "Machine Learning",
        emoji:       "🧠",
        description: "Train, evaluate, and improve classification and regression models.",
        courses:     ["ml", "visualization"]
      },
      {
        id:          "production",
        name:        "Production & Portfolio",
        emoji:       "🚀",
        description: "Deploy to the cloud and showcase end-to-end projects.",
        courses:     ["warehouse", "git", "capstone"]
      }
    ]
  },

  /* ── Full Stack Developer ───────────────────────────────────── */
  "fullstack": {
    id:          "fullstack",
    title:       "Full Stack Developer",
    emoji:       "💻",
    tagline:     "Build complete web applications end-to-end",
    description: "Learn the back-end fundamentals that power every web application: typed languages, relational databases, version control, API design, and cloud deployment.",
    color:       "#10b981",
    gradient:    "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
    difficulty:  "Intermediate",
    duration:    "6–12 months",
    skills:      ["Java", "Python", "SQL", "Git", "Cloud"],
    sections: [
      {
        id:          "backend-basics",
        name:        "Backend Languages",
        emoji:       "⚙️",
        description: "Write clean, typed, object-oriented server-side code.",
        courses:     ["java", "python"]
      },
      {
        id:          "databases",
        name:        "Databases",
        emoji:       "🗄️",
        description: "Design schemas, write queries, and join relational tables.",
        courses:     ["database", "advancedSql"]
      },
      {
        id:          "devops",
        name:        "DevOps & Cloud",
        emoji:       "☁️",
        description: "Version control, CI/CD pipelines, and cloud infrastructure.",
        courses:     ["git", "warehouse"]
      },
      {
        id:          "portfolio",
        name:        "Portfolio",
        emoji:       "🏆",
        description: "Build and present a complete, job-ready project.",
        courses:     ["capstone", "portfolio"]
      }
    ]
  },

  /* ── BI Developer ──────────────────────────────────────────── */
  "bi-developer": {
    id:          "bi-developer",
    title:       "BI Developer",
    emoji:       "📉",
    tagline:     "Design dashboards that drive decisions",
    description: "Specialise in business intelligence: building reliable data models, defining KPI frameworks, and creating executive dashboards that stakeholders trust and actually use.",
    color:       "#f59e0b",
    gradient:    "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
    difficulty:  "Beginner-Friendly",
    duration:    "2–4 months",
    skills:      ["SQL", "Excel", "Power BI", "DAX", "Storytelling"],
    sections: [
      {
        id:          "data-foundations",
        name:        "Data Foundations",
        emoji:       "🏛️",
        description: "SQL and Excel are the backbone of every BI workflow.",
        courses:     ["database", "excel", "advancedSql"]
      },
      {
        id:          "analytics",
        name:        "Analytics",
        emoji:       "🔢",
        description: "Turn raw data into metrics stakeholders trust.",
        courses:     ["business", "statistics", "cleaning"]
      },
      {
        id:          "dashboards",
        name:        "Dashboards",
        emoji:       "📊",
        description: "Design and build dashboards people actually open.",
        courses:     ["bi", "visualization"]
      },
      {
        id:          "communication",
        name:        "Communication",
        emoji:       "🎤",
        description: "Present analysis as clear business recommendations.",
        courses:     ["storytelling", "interview"]
      }
    ]
  },

  /* ── Data Scientist ────────────────────────────────────────── */
  "data-scientist": {
    id:          "data-scientist",
    title:       "Data Scientist",
    emoji:       "🔬",
    tagline:     "Use statistics and ML to answer hard questions",
    description: "Blend deep statistical thinking with machine learning to deliver rigorous, reproducible analysis. Data scientists go beyond dashboards to build experiments, models, and forecasts.",
    color:       "#ec4899",
    gradient:    "linear-gradient(135deg, #be185d 0%, #ec4899 100%)",
    difficulty:  "Advanced",
    duration:    "6–9 months",
    skills:      ["Python", "Statistics", "ML", "NumPy", "Pandas"],
    sections: [
      {
        id:          "core-python",
        name:        "Core Python",
        emoji:       "🐍",
        description: "Python, NumPy, and Pandas at the depth science work demands.",
        courses:     ["python", "numpy", "pandas"]
      },
      {
        id:          "statistics-depth",
        name:        "Statistical Foundations",
        emoji:       "📐",
        description: "Distributions, experiments, uncertainty, and robust reasoning.",
        courses:     ["statistics", "cleaning"]
      },
      {
        id:          "ml-modeling",
        name:        "ML Modeling",
        emoji:       "🤖",
        description: "Train, evaluate, and clearly explain models.",
        courses:     ["ml", "visualization"]
      },
      {
        id:          "delivery",
        name:        "Delivery & Storytelling",
        emoji:       "🎯",
        description: "Communicate findings credibly to technical and business audiences.",
        courses:     ["storytelling", "capstone", "portfolio"]
      }
    ]
  },

  /* ── Backend Developer ─────────────────────────────────────── */
  "backend-developer": {
    id:          "backend-developer",
    title:       "Backend Developer",
    emoji:       "🛠️",
    tagline:     "Engineer the systems that power applications",
    description: "Build scalable APIs, services, and databases. Understand systems design, cloud architecture, and software engineering fundamentals that every backend role requires.",
    color:       "#f43f5e",
    gradient:    "linear-gradient(135deg, #9f1239 0%, #f43f5e 100%)",
    difficulty:  "Intermediate",
    duration:    "4–8 months",
    skills:      ["Java", "Python", "SQL", "Cloud", "Git"],
    sections: [
      {
        id:          "languages",
        name:        "Languages",
        emoji:       "📝",
        description: "Write clean, typed, structured backend code in Java and Python.",
        courses:     ["java", "python"]
      },
      {
        id:          "databases",
        name:        "Databases & SQL",
        emoji:       "🗄️",
        description: "Model data correctly and write efficient, readable queries.",
        courses:     ["database", "advancedSql", "cleaning"]
      },
      {
        id:          "cloud-infra",
        name:        "Cloud & Infrastructure",
        emoji:       "☁️",
        description: "Deploy, scale, and monitor services reliably.",
        courses:     ["warehouse", "git"]
      },
      {
        id:          "career-backend",
        name:        "Career",
        emoji:       "💼",
        description: "Build your portfolio and ace technical interviews.",
        courses:     ["capstone", "interview"]
      }
    ]
  }
};
