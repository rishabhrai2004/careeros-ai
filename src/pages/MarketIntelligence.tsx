import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchCareerIntelligence, type CareerIntelligence } from "@/lib/api/career-intelligence";
import {
  ArrowLeft, Search, Building2, TrendingUp, Globe, DollarSign,
  Briefcase, Brain, Zap, ExternalLink, BarChart3, MapPin,
  Loader2, AlertCircle, CheckCircle2, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar, PieChart, Pie,
} from "recharts";

const PRESET_ROLES = [
  { title: "Software Engineer", icon: "💻", color: "from-primary to-secondary" },
  { title: "Data Scientist", icon: "📊", color: "from-secondary to-accent" },
  { title: "Product Manager", icon: "🎯", color: "from-accent to-primary" },
  { title: "UX Designer", icon: "🎨", color: "from-primary to-accent" },
  { title: "DevOps Engineer", icon: "⚙️", color: "from-secondary to-primary" },
  { title: "AI/ML Engineer", icon: "🤖", color: "from-accent to-secondary" },
  { title: "Cybersecurity Analyst", icon: "🛡️", color: "from-primary to-secondary" },
  { title: "Cloud Architect", icon: "☁️", color: "from-secondary to-accent" },
];

const SKILL_BAR_COLORS = [
  "hsl(265,80%,65%)", "hsl(200,80%,55%)", "hsl(175,70%,45%)",
  "hsl(265,60%,55%)", "hsl(200,60%,45%)", "hsl(175,50%,35%)",
  "hsl(265,40%,45%)", "hsl(200,40%,35%)",
];

function ConfidenceBadge({ level }: { level: string }) {
  const config = {
    high: { color: "text-accent bg-accent/10", icon: CheckCircle2, label: "High Confidence" },
    medium: { color: "text-secondary bg-secondary/10", icon: AlertCircle, label: "Medium Confidence" },
    low: { color: "text-destructive bg-destructive/10", icon: AlertCircle, label: "Low Confidence" },
  }[level] || { color: "text-muted-foreground bg-muted", icon: AlertCircle, label: "Unknown" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <config.icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function SkillTag({ skill, variant = "top" }: { skill: string; variant?: "top" | "emerging" | "declining" }) {
  const styles = {
    top: "bg-primary/15 text-primary border-primary/20",
    emerging: "bg-accent/15 text-accent border-accent/20",
    declining: "bg-destructive/15 text-destructive border-destructive/20",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {skill}
    </span>
  );
}

function IntelligenceDashboard({ data }: { data: CareerIntelligence }) {
  const skillChartData = data.topSkills?.slice(0, 8).map((s, i) => ({
    name: s, value: 100 - i * 10,
  })) || [];

  const demandRadial = [{
    name: "Demand",
    value: data.hiringTrends?.demandScore || 0,
    fill: "hsl(265,80%,65%)",
  }];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Summary */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">{data.role}</h2>
            <p className="text-muted-foreground max-w-2xl">{data.summary}</p>
          </div>
          <div className="flex items-center gap-3">
            <ConfidenceBadge level={data.dataConfidence || "medium"} />
            <span className="text-xs text-muted-foreground">
              {data.sourcesAnalyzed || 0} sources analyzed
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Demand Score", value: `${data.hiringTrends?.demandScore || "—"}/100`, color: "text-primary" },
          { icon: Globe, label: "Top Market", value: data.hiringTrends?.topCountries?.[0] || "Unknown", color: "text-secondary" },
          { icon: BarChart3, label: "Growth Rate", value: data.hiringTrends?.growthRate || "Unknown", color: "text-accent" },
          { icon: Building2, label: "Companies Found", value: `${data.companies?.length || 0}`, color: "text-primary" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <div className="font-display text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Demand Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Top Skills Demand
          </h3>
          {skillChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillChartData} layout="vertical">
                <XAxis type="number" stroke="hsl(220,15%,55%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(220,15%,55%)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {skillChartData.map((_, i) => (
                    <Cell key={i} fill={SKILL_BAR_COLORS[i % SKILL_BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm">No skill data available.</p>
          )}
        </motion.div>

        {/* Demand Score Radial */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary" /> Market Demand Score
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={220} height={220}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={demandRadial} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <div className="font-display text-3xl font-bold text-foreground">{data.hiringTrends?.demandScore || "—"}</div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Top Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.topSkills?.map(s => <SkillTag key={s} skill={s} variant="top" />) || <p className="text-sm text-muted-foreground">No data</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Emerging Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.emergingSkills?.map(s => <SkillTag key={s} skill={s} variant="emerging" />) || <p className="text-sm text-muted-foreground">No data</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-destructive rotate-180" /> Declining Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.decliningSkills?.length ? data.decliningSkills.map(s => <SkillTag key={s} skill={s} variant="declining" />) : <p className="text-sm text-muted-foreground">None identified</p>}
          </div>
        </motion.div>
      </div>

      {/* Companies Hiring */}
      {data.companies?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-6 text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-secondary" /> Companies Hiring
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.companies.map((c, i) => (
              <motion.div
                key={c.name + i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display font-semibold text-foreground text-sm">{c.name}</h4>
                  {c.jobUrl && (
                    <a href={c.jobUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{c.industry}</p>
                <div className="space-y-1 text-xs">
                  {c.openPositions && c.openPositions !== "Unknown" && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-accent" />
                      <span className="text-foreground">{c.openPositions} positions</span>
                    </div>
                  )}
                  {c.avgExperience && c.avgExperience !== "Unknown" && (
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3 h-3 text-secondary" />
                      <span className="text-foreground">{c.avgExperience}</span>
                    </div>
                  )}
                </div>
                {c.keyTechnologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.keyTechnologies.slice(0, 4).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Salary & Hiring Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Salary Ranges */}
        {data.salaryRanges?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" /> Salary Ranges by Region
            </h3>
            <div className="space-y-3">
              {data.salaryRanges.map(s => (
                <div key={s.region} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{s.region}</span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-primary">{s.range}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hiring Geography */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Top Hiring Locations
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Countries</p>
              <div className="flex flex-wrap gap-2">
                {data.hiringTrends?.topCountries?.map((c, i) => (
                  <span key={c} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    <span className="text-[10px] font-bold text-muted-foreground">#{i + 1}</span> {c}
                  </span>
                )) || <p className="text-sm text-muted-foreground">No data</p>}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Cities</p>
              <div className="flex flex-wrap gap-2">
                {data.hiringTrends?.topCities?.map(c => (
                  <span key={c} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                    {c}
                  </span>
                )) || <p className="text-sm text-muted-foreground">No data</p>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Experience Levels */}
      {data.experienceLevels && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-accent" /> Experience Level Breakdown
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {(["junior", "mid", "senior"] as const).map(level => {
              const d = data.experienceLevels?.[level];
              if (!d) return null;
              const labels = { junior: "Junior", mid: "Mid-Level", senior: "Senior" };
              const colors = { junior: "from-accent to-secondary", mid: "from-secondary to-primary", senior: "from-primary to-accent" };
              return (
                <div key={level} className="glass-card p-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r ${colors[level]} text-primary-foreground`}>
                    {labels[level]}
                  </div>
                  <div className="text-sm text-foreground font-medium">{d.years} years</div>
                  <div className="text-xs text-muted-foreground mt-1">{d.avgSalary}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Job Links */}
      {data.jobLinks?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4 text-foreground flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" /> Job Opening Links
          </h3>
          <div className="space-y-2">
            {data.jobLinks.map((j, i) => (
              <a
                key={i}
                href={j.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{j.company}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {j.role}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const MarketIntelligence = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["career-intelligence", selectedRole],
    queryFn: () => fetchCareerIntelligence(selectedRole!),
    enabled: !!selectedRole,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    toast.info(`Analyzing ${role}...`, { description: "Scraping live data from job boards. This may take 15-30 seconds." });
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <Navbar />
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Market <span className="glow-text">Intelligence</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Live AI-powered analysis of global job markets. Select a role to scrape real hiring data from across the web.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-semibold mb-6 text-foreground">Select a Career Path</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PRESET_ROLES.map((role, i) => (
                <motion.button
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleRoleSelect(role.title)}
                  disabled={isLoading}
                  className={`glass-card-hover p-4 text-left group transition-all ${
                    selectedRole === role.title ? "ring-2 ring-primary/50" : ""
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-2xl mb-2 block">{role.icon}</span>
                  <span className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {role.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 text-center"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Analyzing Global Job Market</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Scraping live data from job boards, company career pages, and salary databases.
                  Cross-referencing and validating with AI...
                </p>
                <div className="mt-6 space-y-2 text-xs text-muted-foreground">
                  {["Searching job postings...", "Analyzing salary data...", "Mapping skill requirements...", "Validating & cross-referencing..."].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 4 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Search className="w-3 h-3" /> {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {error && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Analysis Failed</h3>
              <p className="text-sm text-muted-foreground mb-4">{(error as Error).message}</p>
              <button onClick={() => refetch()} className="btn-glow px-6 py-2 rounded-lg text-sm font-semibold text-primary-foreground">
                Retry Analysis
              </button>
            </motion.div>
          )}

          {/* Results */}
          {data && !isLoading && <IntelligenceDashboard data={data} />}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketIntelligence;
