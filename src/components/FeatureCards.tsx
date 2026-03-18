import { motion } from "framer-motion";
import { Cpu, BarChart3, Share2, MessageSquare, ClipboardList } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Career Simulation",
    desc: "Run AI simulations to explore different career trajectories and outcomes based on your skills and goals.",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    desc: "Real-time labor market analytics with salary trends, demand forecasts, and geographic insights.",
    color: "text-secondary",
  },
  {
    icon: Share2,
    title: "Skill Graph",
    desc: "Interactive visualization of skill relationships, gaps, and learning pathways personalized for you.",
    color: "text-accent",
  },
  {
    icon: MessageSquare,
    title: "AI Mentor",
    desc: "Get personalized career advice from AI mentors with different professional perspectives.",
    color: "text-primary",
  },
  {
    icon: ClipboardList,
    title: "Job Task Simulator",
    desc: "Practice real job tasks with AI evaluation to build confidence before interviews.",
    color: "text-secondary",
  },
];

const FeatureCards = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Intelligent Tools for{" "}
            <span className="glow-text">Career Growth</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to navigate your career with confidence and data-driven insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
