export interface CareerSimulationInput {
  currentRole: string;
  targetRole: string;
  yearsExperience: number;
  country: string;
  currentSkills: string[] | string;
}

export interface SkillAssessment {
  skill: string;
  importance: number;
  matched: boolean;
  coverage: number;
}

export interface SalaryEstimate {
  country: string;
  currency: string;
  experienceLevel: "Entry level" | "Mid level" | "Senior";
  min: number;
  max: number;
  rangeLabel: string;
}

export interface LearningTimeEstimate {
  minMonths: number;
  maxMonths: number;
  label: string;
}

export interface CareerSimulationResult {
  currentRole: string;
  targetRole: string;
  country: string;
  yearsExperience: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  currentSkills: string[];
  skillAssessments: SkillAssessment[];
  skillMatchPercentage: number;
  roleSimilarityPercentage: number;
  experienceAlignmentPercentage: number;
  transitionProbability: number;
  estimatedSalary: SalaryEstimate;
  learningTime: LearningTimeEstimate;
  recommendedFocus: string[];
  readinessLabel: string;
  summary: string;
}

type ExperienceLevelKey = "entry" | "mid" | "senior";

type RoleProfile = {
  canonicalTitle: string;
  aliases: string[];
  keywords: string[];
  family: string;
  difficulty: number;
  requiredSkills: Array<{ name: string; importance: number }>;
  salaryUSD: Record<ExperienceLevelKey, [number, number]>;
};

type CountryProfile = {
  currency: string;
  locale: string;
  salaryFactor: number;
  format?: "standard" | "lakh";
};

const ROLE_PROFILES: RoleProfile[] = [
  {
    canonicalTitle: "Software Engineer",
    aliases: ["software engineer", "software developer", "frontend engineer", "backend engineer", "full stack engineer", "fullstack engineer"],
    keywords: ["software", "developer", "frontend", "backend", "full stack", "engineer"],
    family: "engineering",
    difficulty: 2.8,
    requiredSkills: [
      { name: "JavaScript", importance: 5 },
      { name: "TypeScript", importance: 4 },
      { name: "APIs", importance: 5 },
      { name: "Data Structures", importance: 4 },
      { name: "Testing", importance: 4 },
      { name: "Git", importance: 3 },
      { name: "System Design", importance: 4 },
    ],
    salaryUSD: {
      entry: [70000, 95000],
      mid: [105000, 145000],
      senior: [140000, 190000],
    },
  },
  {
    canonicalTitle: "Data Scientist",
    aliases: ["data scientist", "machine learning scientist", "applied scientist"],
    keywords: ["data", "scientist", "machine learning", "analytics"],
    family: "data",
    difficulty: 3.5,
    requiredSkills: [
      { name: "Python", importance: 5 },
      { name: "Machine Learning", importance: 5 },
      { name: "Statistics", importance: 5 },
      { name: "Data Visualization", importance: 4 },
      { name: "SQL", importance: 5 },
      { name: "Pandas", importance: 4 },
      { name: "Scikit-learn", importance: 4 },
    ],
    salaryUSD: {
      entry: [60000, 85000],
      mid: [90000, 120000],
      senior: [125000, 165000],
    },
  },
  {
    canonicalTitle: "Product Manager",
    aliases: ["product manager", "pm", "group product manager"],
    keywords: ["product", "roadmap", "stakeholder", "manager"],
    family: "product",
    difficulty: 3.2,
    requiredSkills: [
      { name: "Product Strategy", importance: 5 },
      { name: "Roadmapping", importance: 4 },
      { name: "User Research", importance: 4 },
      { name: "Analytics", importance: 4 },
      { name: "Stakeholder Management", importance: 5 },
      { name: "Experimentation", importance: 4 },
      { name: "Agile Delivery", importance: 3 },
    ],
    salaryUSD: {
      entry: [65000, 90000],
      mid: [95000, 130000],
      senior: [130000, 180000],
    },
  },
  {
    canonicalTitle: "UX Designer",
    aliases: ["ux designer", "product designer", "ui ux designer", "ui designer"],
    keywords: ["ux", "ui", "designer", "design"],
    family: "design",
    difficulty: 2.9,
    requiredSkills: [
      { name: "User Research", importance: 5 },
      { name: "Wireframing", importance: 4 },
      { name: "Prototyping", importance: 5 },
      { name: "Interaction Design", importance: 4 },
      { name: "Usability Testing", importance: 4 },
      { name: "Figma", importance: 4 },
      { name: "Information Architecture", importance: 3 },
    ],
    salaryUSD: {
      entry: [55000, 80000],
      mid: [80000, 110000],
      senior: [110000, 145000],
    },
  },
  {
    canonicalTitle: "DevOps Engineer",
    aliases: ["devops engineer", "site reliability engineer", "sre", "platform engineer"],
    keywords: ["devops", "sre", "platform", "infrastructure", "reliability"],
    family: "infrastructure",
    difficulty: 3.4,
    requiredSkills: [
      { name: "Cloud Infrastructure", importance: 5 },
      { name: "CI/CD", importance: 5 },
      { name: "Docker", importance: 4 },
      { name: "Kubernetes", importance: 5 },
      { name: "Linux", importance: 4 },
      { name: "Terraform", importance: 4 },
      { name: "Monitoring", importance: 3 },
    ],
    salaryUSD: {
      entry: [70000, 95000],
      mid: [105000, 140000],
      senior: [140000, 185000],
    },
  },
  {
    canonicalTitle: "AI/ML Engineer",
    aliases: ["ai ml engineer", "ml engineer", "machine learning engineer", "ai engineer"],
    keywords: ["ai", "ml", "machine learning", "llm", "model"],
    family: "ai",
    difficulty: 3.8,
    requiredSkills: [
      { name: "Python", importance: 5 },
      { name: "Machine Learning", importance: 5 },
      { name: "Deep Learning", importance: 4 },
      { name: "Model Deployment", importance: 4 },
      { name: "SQL", importance: 3 },
      { name: "PyTorch", importance: 4 },
      { name: "MLOps", importance: 4 },
    ],
    salaryUSD: {
      entry: [75000, 105000],
      mid: [115000, 155000],
      senior: [155000, 210000],
    },
  },
  {
    canonicalTitle: "Cybersecurity Analyst",
    aliases: ["cybersecurity analyst", "security analyst", "soc analyst", "cyber analyst"],
    keywords: ["security", "cyber", "soc", "threat"],
    family: "security",
    difficulty: 3.3,
    requiredSkills: [
      { name: "Threat Detection", importance: 5 },
      { name: "SIEM", importance: 4 },
      { name: "Incident Response", importance: 5 },
      { name: "Network Security", importance: 4 },
      { name: "Vulnerability Management", importance: 4 },
      { name: "Identity Access", importance: 3 },
      { name: "Risk Assessment", importance: 3 },
    ],
    salaryUSD: {
      entry: [65000, 90000],
      mid: [95000, 125000],
      senior: [125000, 165000],
    },
  },
  {
    canonicalTitle: "Cloud Architect",
    aliases: ["cloud architect", "solutions architect", "infrastructure architect"],
    keywords: ["cloud", "architect", "solutions", "infrastructure"],
    family: "cloud",
    difficulty: 3.7,
    requiredSkills: [
      { name: "Cloud Architecture", importance: 5 },
      { name: "AWS", importance: 5 },
      { name: "Networking", importance: 4 },
      { name: "Infrastructure as Code", importance: 4 },
      { name: "Security Architecture", importance: 4 },
      { name: "Cost Optimization", importance: 3 },
      { name: "Kubernetes", importance: 3 },
    ],
    salaryUSD: {
      entry: [85000, 115000],
      mid: [125000, 165000],
      senior: [165000, 220000],
    },
  },
];

const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  "United States": { currency: "USD", locale: "en-US", salaryFactor: 1 },
  "United Kingdom": { currency: "GBP", locale: "en-GB", salaryFactor: 0.78 },
  Germany: { currency: "EUR", locale: "de-DE", salaryFactor: 0.72 },
  Canada: { currency: "CAD", locale: "en-CA", salaryFactor: 1.05 },
  Australia: { currency: "AUD", locale: "en-AU", salaryFactor: 1.22 },
  India: { currency: "INR", locale: "en-IN", salaryFactor: 18, format: "lakh" },
  Singapore: { currency: "SGD", locale: "en-SG", salaryFactor: 1.12 },
  Netherlands: { currency: "EUR", locale: "nl-NL", salaryFactor: 0.74 },
  "United Arab Emirates": { currency: "AED", locale: "en-AE", salaryFactor: 3.1 },
};

const SKILL_SYNONYMS: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  api: "apis",
  apis: "apis",
  "machine-learning": "machine learning",
  ml: "machine learning",
  stats: "statistics",
  statistical: "statistics",
  "data viz": "data visualization",
  "data visualisation": "data visualization",
  visualization: "data visualization",
  visualisation: "data visualization",
  sklearn: "scikit-learn",
  "sci kit learn": "scikit-learn",
  pandas: "pandas",
  sql: "sql",
  python: "python",
  docker: "docker",
  k8s: "kubernetes",
  kubernetes: "kubernetes",
  terraform: "terraform",
  linux: "linux",
  aws: "aws",
  figma: "figma",
  wireframes: "wireframing",
  prototypes: "prototyping",
  "user interviews": "user research",
  "ux research": "user research",
  "stakeholder communication": "stakeholder management",
  cicd: "ci/cd",
  "ci cd": "ci/cd",
  iac: "infrastructure as code",
  mlops: "mlops",
};

const GENERIC_REQUIRED_SKILLS = [
  { name: "Problem Solving", importance: 5 },
  { name: "Communication", importance: 4 },
  { name: "Domain Knowledge", importance: 4 },
  { name: "Execution", importance: 4 },
  { name: "Collaboration", importance: 3 },
  { name: "Data Literacy", importance: 3 },
  { name: "Stakeholder Management", importance: 3 },
];

export const SUPPORTED_ROLE_TITLES = ROLE_PROFILES.map((role) => role.canonicalTitle);
export const SUPPORTED_COUNTRIES = Object.keys(COUNTRY_PROFILES);

function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/[()]/g, " ").replace(/[^a-z0-9+/.-]+/g, " ").replace(/\s+/g, " ");
}

function normalizeSkill(value: string) {
  const cleaned = normalizeText(value).replace(/[./]/g, " ").replace(/\s+/g, " ").trim();
  return SKILL_SYNONYMS[cleaned] ?? cleaned;
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseSkillsInput(input: string | string[]) {
  const rawSkills = Array.isArray(input)
    ? input
    : input
        .split(/[\n,;]+/)
        .map((skill) => skill.trim())
        .filter(Boolean);

  const unique = new Map<string, string>();

  rawSkills.forEach((skill) => {
    const normalized = normalizeSkill(skill);
    if (!normalized) return;
    if (!unique.has(normalized)) {
      unique.set(normalized, toTitleCase(normalized));
    }
  });

  return Array.from(unique.values());
}

function getRoleProfile(role: string): RoleProfile {
  const normalizedRole = normalizeText(role);

  const exactMatch = ROLE_PROFILES.find((profile) =>
    profile.aliases.some((alias) => normalizeText(alias) === normalizedRole),
  );
  if (exactMatch) return exactMatch;

  const containsMatch = ROLE_PROFILES.find((profile) =>
    profile.aliases.some((alias) => normalizedRole.includes(normalizeText(alias)) || normalizeText(alias).includes(normalizedRole)),
  );
  if (containsMatch) return containsMatch;

  const scoredMatches = ROLE_PROFILES.map((profile) => ({
    profile,
    score: profile.keywords.reduce((total, keyword) => total + (normalizedRole.includes(keyword) ? 1 : 0), 0),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredMatches[0]) return scoredMatches[0].profile;

  return {
    canonicalTitle: toTitleCase(role.trim()) || "Target Role",
    aliases: [normalizedRole],
    keywords: normalizedRole.split(" "),
    family: "general",
    difficulty: 3,
    requiredSkills: GENERIC_REQUIRED_SKILLS,
    salaryUSD: {
      entry: [50000, 70000],
      mid: [70000, 95000],
      senior: [95000, 130000],
    },
  };
}

function getExperienceLevel(yearsExperience: number): { key: ExperienceLevelKey; label: SalaryEstimate["experienceLevel"] } {
  if (yearsExperience <= 2) return { key: "entry", label: "Entry level" };
  if (yearsExperience <= 5) return { key: "mid", label: "Mid level" };
  return { key: "senior", label: "Senior" };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value);
}

function overlapRatio(left: string[], right: string[]) {
  const leftSet = new Set(left.map(normalizeSkill));
  const rightSet = new Set(right.map(normalizeSkill));
  const intersection = Array.from(leftSet).filter((skill) => rightSet.has(skill)).length;
  return rightSet.size ? intersection / rightSet.size : 0;
}

function formatLakh(value: number) {
  const lakhs = value / 100000;
  const formatted = lakhs >= 10 ? lakhs.toFixed(0) : lakhs.toFixed(1);
  return formatted.replace(/\.0$/, "") + "L";
}

function formatCurrency(value: number, profile: CountryProfile) {
  if (profile.format === "lakh") {
    return `₹${formatLakh(value)}`;
  }

  return new Intl.NumberFormat(profile.locale, {
    style: "currency",
    currency: profile.currency,
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .replace(".0", "");
}

function buildSalaryEstimate(targetProfile: RoleProfile, country: string, yearsExperience: number): SalaryEstimate {
  const countryProfile = COUNTRY_PROFILES[country] ?? COUNTRY_PROFILES["United States"];
  const experienceLevel = getExperienceLevel(yearsExperience);
  const [minUSD, maxUSD] = targetProfile.salaryUSD[experienceLevel.key];
  const min = Math.round(minUSD * countryProfile.salaryFactor);
  const max = Math.round(maxUSD * countryProfile.salaryFactor);

  return {
    country,
    currency: countryProfile.currency,
    experienceLevel: experienceLevel.label,
    min,
    max,
    rangeLabel: `${formatCurrency(min, countryProfile)} – ${formatCurrency(max, countryProfile)}`,
  };
}

function buildLearningTime(missingSkillCount: number, difficulty: number, roleSimilarity: number, yearsExperience: number): LearningTimeEstimate {
  const baseMonths = missingSkillCount * (0.9 + difficulty * 0.35);
  const roleDistancePenalty = (1 - roleSimilarity) * 4;
  const experienceReduction = Math.min(yearsExperience * 0.2, 2.5);
  const minMonths = Math.max(1, Math.round(baseMonths * 0.65 + roleDistancePenalty - experienceReduction));
  const maxMonths = Math.max(minMonths + 1, Math.round(baseMonths * 0.95 + roleDistancePenalty + 1 - experienceReduction / 2));

  return {
    minMonths,
    maxMonths,
    label: `${minMonths}-${maxMonths} months`,
  };
}

function buildReadinessLabel(probability: number) {
  if (probability >= 75) return "Strong transition fit";
  if (probability >= 55) return "Promising with focused upskilling";
  if (probability >= 35) return "Possible but needs significant upskilling";
  return "Low readiness right now";
}

export function simulateCareerTransition(input: CareerSimulationInput): CareerSimulationResult {
  const currentSkills = parseSkillsInput(input.currentSkills);
  const targetProfile = getRoleProfile(input.targetRole);
  const currentProfile = getRoleProfile(input.currentRole);

  const matchedSkillKeys = new Set(currentSkills.map(normalizeSkill));
  const requiredSkills = targetProfile.requiredSkills.map((skill) => skill.name);

  const skillAssessments = targetProfile.requiredSkills.map((requirement) => {
    const matched = matchedSkillKeys.has(normalizeSkill(requirement.name));
    return {
      skill: requirement.name,
      importance: requirement.importance,
      matched,
      coverage: matched ? 100 : 0,
    };
  });

  const matchedSkills = skillAssessments.filter((skill) => skill.matched).map((skill) => skill.skill);
  const missingSkills = skillAssessments.filter((skill) => !skill.matched).map((skill) => skill.skill);

  const skillMatchPercentage = round((matchedSkills.length / requiredSkills.length) * 100);
  const currentProfileSkills = currentProfile.requiredSkills.map((skill) => skill.name);
  const profileOverlap = overlapRatio(currentProfileSkills, requiredSkills);
  const currentSkillsOverlap = overlapRatio(currentSkills, requiredSkills);
  const sameFamily = currentProfile.family === targetProfile.family;
  const exactRoleMatch = normalizeText(input.currentRole) === normalizeText(input.targetRole);

  const roleSimilarityPercentage = round(
    clamp(
      (exactRoleMatch ? 0.92 : sameFamily ? 0.58 : 0.25) + profileOverlap * 0.25 + currentSkillsOverlap * 0.18,
      0.18,
      0.98,
    ) * 100,
  );

  const targetExperienceNeed = 1.5 + targetProfile.difficulty * 1.4;
  const experienceAlignmentPercentage = round(clamp((input.yearsExperience + 1) / (targetExperienceNeed + 1), 0.25, 1) * 100);

  const transitionProbability = round(
    clamp(
      skillMatchPercentage * 0.55 + roleSimilarityPercentage * 0.25 + experienceAlignmentPercentage * 0.2,
      12,
      96,
    ),
  );

  const estimatedSalary = buildSalaryEstimate(targetProfile, input.country, input.yearsExperience);
  const learningTime = buildLearningTime(missingSkills.length, targetProfile.difficulty, roleSimilarityPercentage / 100, input.yearsExperience);
  const recommendedFocus = skillAssessments
    .filter((skill) => !skill.matched)
    .sort((left, right) => right.importance - left.importance)
    .slice(0, 4)
    .map((skill) => skill.skill);
  const readinessLabel = buildReadinessLabel(transitionProbability);

  const summary = `${input.currentRole} → ${targetProfile.canonicalTitle}: you already match ${matchedSkills.length} of ${requiredSkills.length} core skills. ${readinessLabel}, with the biggest gaps in ${recommendedFocus.slice(0, 3).join(", ") || "role-specific skills"}.`;

  return {
    currentRole: toTitleCase(input.currentRole.trim()),
    targetRole: targetProfile.canonicalTitle,
    country: input.country,
    yearsExperience: input.yearsExperience,
    requiredSkills,
    matchedSkills,
    missingSkills,
    currentSkills,
    skillAssessments,
    skillMatchPercentage,
    roleSimilarityPercentage,
    experienceAlignmentPercentage,
    transitionProbability,
    estimatedSalary,
    learningTime,
    recommendedFocus,
    readinessLabel,
    summary,
  };
}
