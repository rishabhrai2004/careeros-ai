import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Code, Database, Palette, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const careers = [
  { icon: Code, title: "Software Engineering", growth: "+24%", color: "text-primary" },
  { icon: Database, title: "Data Science & AI", growth: "+31%", color: "text-secondary" },
  { icon: Palette, title: "Product Design", growth: "+18%", color: "text-accent" },
  { icon: Shield, title: "Cybersecurity", growth: "+28%", color: "text-primary" },
  { icon: TrendingUp, title: "Product Management", growth: "+20%", color: "text-secondary" },
  { icon: Briefcase, title: "Management Consulting", growth: "+12%", color: "text-accent" },
];

const Careers = () => (
  <div className="min-h-screen bg-background mesh-gradient">
    <Navbar />
    <div className="pt-28 px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Explore <span className="glow-text">Career Paths</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12">Browse in-demand careers with AI-powered growth forecasts and skill requirements.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="glass-card-hover p-6 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <c.icon className={`w-8 h-8 ${c.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">{c.growth}</span>
              </div>
              <h3 className="font-display font-semibold text-foreground">{c.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Careers;
