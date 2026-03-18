import { motion } from "framer-motion";
import { TrendingUp, Users, Brain, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

const barData = [
  { name: "React", value: 92 },
  { name: "Python", value: 85 },
  { name: "AI/ML", value: 78 },
  { name: "Cloud", value: 70 },
  { name: "DevOps", value: 65 },
  { name: "Data", value: 60 },
];

const areaData = [
  { month: "Jan", demand: 40 },
  { month: "Feb", demand: 45 },
  { month: "Mar", demand: 55 },
  { month: "Apr", demand: 65 },
  { month: "May", demand: 60 },
  { month: "Jun", demand: 75 },
  { month: "Jul", demand: 85 },
];

const stats = [
  { icon: TrendingUp, label: "Career Score", value: "87", color: "text-primary" },
  { icon: Users, label: "Network Reach", value: "2.4K", color: "text-secondary" },
  { icon: Brain, label: "Skills Mapped", value: "34", color: "text-accent" },
  { icon: Target, label: "Goals Met", value: "12/15", color: "text-primary" },
];

const DashboardPreview = () => {
  return (
    <section id="progress" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Your Career{" "}
            <span className="glow-text">Command Center</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Track progress, analyze trends, and make data-driven career decisions.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold mb-4 text-foreground">Skill Demand Index</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="hsl(220,15%,55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220,15%,55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Bar dataKey="value" fill="hsl(265,80%,65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold mb-4 text-foreground">Market Demand Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200,80%,55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(200,80%,55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(220,15%,55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220,15%,55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Area type="monotone" dataKey="demand" stroke="hsl(200,80%,55%)" fill="url(#demandGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 mt-6"
        >
          <h3 className="font-display font-semibold mb-6 text-foreground">Skill Progress</h3>
          <div className="space-y-4">
            {[
              { skill: "Frontend Development", pct: 92, color: "from-primary to-secondary" },
              { skill: "Machine Learning", pct: 68, color: "from-secondary to-accent" },
              { skill: "System Design", pct: 75, color: "from-accent to-primary" },
              { skill: "Leadership", pct: 55, color: "from-primary to-accent" },
            ].map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">{s.skill}</span>
                  <span className="text-muted-foreground">{s.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
