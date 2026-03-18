import { motion } from "framer-motion";
import { Bot, Briefcase, Rocket, GraduationCap, HeartHandshake } from "lucide-react";

const mentors = [
  { icon: GraduationCap, name: "Junior Pro", desc: "Early career guidance and skill building strategies", color: "text-primary" },
  { icon: Briefcase, name: "Senior Pro", desc: "Strategic career moves and leadership development", color: "text-secondary" },
  { icon: Bot, name: "Hiring Manager", desc: "Interview prep and what recruiters really look for", color: "text-accent" },
  { icon: Rocket, name: "Startup Founder", desc: "Entrepreneurial thinking and startup career paths", color: "text-primary" },
  { icon: HeartHandshake, name: "Career Coach", desc: "Holistic career planning and work-life balance", color: "text-secondary" },
];

const MentorSection = () => {
  return (
    <section id="mentor-mode" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            AI Mentors,{" "}
            <span className="glow-text">Real Perspectives</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get personalized advice from AI mentors with distinct professional backgrounds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mentors.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 ${m.color} group-hover:scale-110 transition-transform`}>
                <m.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Chat preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-secondary">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold text-sm text-foreground">Senior Professional</div>
              <div className="text-xs text-muted-foreground">AI Mentor • Online</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="btn-glow rounded-2xl rounded-br-md px-4 py-2.5 max-w-xs">
                <p className="text-sm text-primary-foreground">How should I transition from frontend to full-stack?</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="glass-card px-4 py-2.5 max-w-sm rounded-2xl rounded-bl-md">
                <p className="text-sm text-foreground">Focus on building 2-3 full-stack projects. Start with Node.js + PostgreSQL — your React skills transfer well. I'd recommend contributing to open source backends first.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorSection;
