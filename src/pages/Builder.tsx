import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock3,
  DollarSign,
  Gauge,
  Globe,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  SUPPORTED_COUNTRIES,
  SUPPORTED_ROLE_TITLES,
  parseSkillsInput,
  simulateCareerTransition,
  type CareerSimulationInput,
} from "@/lib/career-simulator";

const formSchema = z.object({
  currentRole: z.string().trim().min(2, "Enter your current role").max(80, "Keep it under 80 characters"),
  targetRole: z.string().trim().min(2, "Enter your target role").max(80, "Keep it under 80 characters"),
  yearsExperience: z.coerce.number().min(0, "Use 0 or more years").max(40, "Use 40 years or less"),
  country: z.string().trim().min(2, "Select a country"),
  currentSkills: z.string().trim().min(2, "Add at least one skill").max(500, "Keep skills under 500 characters"),
});

const initialValues = {
  currentRole: "Software Engineer",
  targetRole: "Data Scientist",
  yearsExperience: "3",
  country: "United Kingdom",
  currentSkills: "Java, SQL, APIs, Git, HTML",
};

const roleSuggestions = Array.from(new Set(SUPPORTED_ROLE_TITLES)).sort();

const metricCards = [
  {
    key: "transitionProbability",
    label: "Transition probability",
    icon: TrendingUp,
    description: "Based on skill overlap, role similarity, and experience alignment.",
  },
  {
    key: "skillMatchPercentage",
    label: "Skill match",
    icon: Target,
    description: "How many core target-role skills you already have.",
  },
  {
    key: "roleSimilarityPercentage",
    label: "Role similarity",
    icon: Briefcase,
    description: "How closely your current role maps to the target role.",
  },
  {
    key: "experienceAlignmentPercentage",
    label: "Experience alignment",
    icon: Gauge,
    description: "How well your experience level matches the target role depth.",
  },
] as const;

const Builder = () => {
  const [values, setValues] = useState(initialValues);

  const parsed = useMemo(() => formSchema.safeParse(values), [values]);

  const errors = useMemo(() => {
    if (parsed.success) return {} as Record<string, string>;

    return parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
      const key = issue.path[0];
      if (typeof key === "string" && !acc[key]) {
        acc[key] = issue.message;
      }
      return acc;
    }, {});
  }, [parsed]);

  const result = useMemo(() => {
    const validation = formSchema.safeParse(values);
    if (!validation.success) return null;

    const simulationInput: CareerSimulationInput = {
      currentRole: validation.data.currentRole,
      targetRole: validation.data.targetRole,
      yearsExperience: validation.data.yearsExperience,
      country: validation.data.country,
      currentSkills: validation.data.currentSkills,
    };

    return simulateCareerTransition(simulationInput);
  }, [values]);

  const currentSkillList = useMemo(() => parseSkillsInput(values.currentSkills), [values.currentSkills]);

  const handleChange = (field: keyof typeof initialValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <Navbar />
      <main className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-5 max-w-4xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">CareerVanguard Intelligence</p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  Dynamic <span className="glow-text">career transition intelligence</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Enter your current role, target role, experience, country, and skills to calculate transition probability, salary, learning time, and a real skill gap.
                </p>
              </div>
              <div className="glass-card px-4 py-3 min-w-[220px]">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">Live logic</p>
                <p className="text-sm text-foreground">Every chart, badge, and progress bar updates from your inputs.</p>
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-[420px_minmax(0,1fr)] gap-8 items-start">
            <section className="glass-card p-6 lg:p-7 space-y-5 xl:sticky xl:top-24">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-foreground">Simulation inputs</h2>
                <p className="text-sm text-muted-foreground">Use role-specific inputs to generate realistic transition guidance.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Input
                    id="currentRole"
                    list="career-role-suggestions"
                    value={values.currentRole}
                    onChange={(event) => handleChange("currentRole", event.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                  {errors.currentRole && <p className="text-sm text-destructive">{errors.currentRole}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    list="career-role-suggestions"
                    value={values.targetRole}
                    onChange={(event) => handleChange("targetRole", event.target.value)}
                    placeholder="e.g. Data Scientist"
                  />
                  {errors.targetRole && <p className="text-sm text-destructive">{errors.targetRole}</p>}
                </div>

                <datalist id="career-role-suggestions">
                  {roleSuggestions.map((role) => (
                    <option key={role} value={role} />
                  ))}
                </datalist>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      max="40"
                      value={values.yearsExperience}
                      onChange={(event) => handleChange("yearsExperience", event.target.value)}
                    />
                    {errors.yearsExperience && <p className="text-sm text-destructive">{errors.yearsExperience}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      value={values.country}
                      onChange={(event) => handleChange("country", event.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {SUPPORTED_COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentSkills">Current Skills</Label>
                  <Textarea
                    id="currentSkills"
                    value={values.currentSkills}
                    onChange={(event) => handleChange("currentSkills", event.target.value)}
                    placeholder="Comma-separated, e.g. Python, SQL, Data Analysis"
                    className="min-h-[128px]"
                  />
                  <p className="text-xs text-muted-foreground">Separate skills with commas, semicolons, or new lines.</p>
                  {errors.currentSkills && <p className="text-sm text-destructive">{errors.currentSkills}</p>}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-accent" /> Parsed current skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkillList.length > 0 ? (
                    currentSkillList.map((skill) => (
                      <span key={skill} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Add skills to begin.</span>
                  )}
                </div>
              </div>

              <Button type="button" className="w-full btn-glow text-primary-foreground">
                Results update automatically
              </Button>
            </section>

            <section className="space-y-6">
              {result ? (
                <>
                  <div className="glass-card p-6 lg:p-7 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          <Target className="w-3.5 h-3.5" /> {result.currentRole} → {result.targetRole}
                        </div>
                        <div>
                          <h2 className="font-display text-3xl font-bold text-foreground">{result.readinessLabel}</h2>
                          <p className="text-muted-foreground mt-2">{result.summary}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 min-w-full lg:min-w-[340px] lg:max-w-[380px]">
                        <div className="rounded-2xl border border-border bg-card/80 p-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <DollarSign className="w-4 h-4 text-accent" /> Estimated salary
                          </div>
                          <div className="font-display text-2xl font-bold text-foreground">{result.estimatedSalary.rangeLabel}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.estimatedSalary.experienceLevel} in {result.country}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card/80 p-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock3 className="w-4 h-4 text-secondary" /> Learning time
                          </div>
                          <div className="font-display text-2xl font-bold text-foreground">{result.learningTime.label}</div>
                          <p className="text-xs text-muted-foreground mt-1">Estimated time to close the gap.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {metricCards.map((metric) => {
                        const value = result[metric.key];
                        return (
                          <div key={metric.key} className="rounded-2xl border border-border bg-card/70 p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">{metric.label}</p>
                                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                              </div>
                              <metric.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <div className="font-display text-3xl font-bold text-foreground">{value}%</div>
                              <Progress value={value} className="h-2.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
                    <div className="glass-card p-6 lg:p-7 space-y-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-display text-2xl font-semibold text-foreground">Role-specific skill gap</h3>
                          <p className="text-sm text-muted-foreground mt-1">Required skills are mapped to {result.targetRole} and compared against your current skills.</p>
                        </div>
                        <div className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm text-foreground">
                          {result.matchedSkills.length}/{result.requiredSkills.length} skills matched
                        </div>
                      </div>

                      <div className="space-y-4">
                        {result.skillAssessments.map((skill) => (
                          <div key={skill.skill} className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-foreground">{skill.skill}</span>
                                {skill.matched ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20">
                                    <CheckCircle2 className="w-3 h-3" /> You have this
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive border border-destructive/20">
                                    <XCircle className="w-3 h-3" /> Missing
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">Priority {skill.importance}/5</span>
                            </div>
                            <Progress value={skill.coverage} className="h-2.5" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="glass-card p-6 space-y-4">
                        <h3 className="font-display text-xl font-semibold text-foreground">Skills you already have</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSkills.length > 0 ? (
                            result.matchedSkills.map((skill) => (
                              <span key={skill} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No direct overlap yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="glass-card p-6 space-y-4">
                        <h3 className="font-display text-xl font-semibold text-foreground">Missing skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((skill) => (
                            <span key={skill} className="rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="glass-card p-6 space-y-4">
                        <h3 className="font-display text-xl font-semibold text-foreground">Recommended next focus</h3>
                        <ol className="space-y-3">
                          {result.recommendedFocus.map((skill, index) => (
                            <li key={skill} className="flex items-start gap-3">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/15 text-secondary text-sm font-semibold border border-secondary/20">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-foreground">{skill}</p>
                                <p className="text-xs text-muted-foreground">High-impact gap for improving transition odds.</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="glass-card p-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Globe className="w-4 h-4 text-primary" /> Salary logic used
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Compensation is estimated from the target role, your selected country, and your experience level — not generic global placeholders.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-card p-8 text-center">
                  <h2 className="font-display text-2xl font-semibold text-foreground">Add valid inputs to run the simulation</h2>
                  <p className="text-muted-foreground mt-2">The simulator will calculate transition probability, skill gaps, salary, and learning time from your entries.</p>
                </div>
              )}
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Builder;
