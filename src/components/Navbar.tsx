import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const links = [
  { label: "Career Simulator", href: "/builder" },
  { label: "Market Intelligence", href: "/market-intelligence" },
  { label: "Skill Graph", href: "/#skill-graph" },
  { label: "Job Tasks", href: "/#features" },
  { label: "Mentor Mode", href: "/#mentor" },
  { label: "Progress", href: "/#progress" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      <div className="glass-card px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-glow flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tighter">CareerVanguard <span className="text-primary">AI</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.label} to={link.href} className="nav-link text-sm font-medium">
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link to="/builder" className="btn-glow px-5 py-2 rounded-lg text-sm font-semibold text-primary-foreground">
            Start Career Simulation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mt-2 p-4 flex flex-col gap-3 lg:hidden"
        >
          {links.map((link) => (
            <Link key={link.label} to={link.href} className="nav-link text-sm font-medium py-1">
              {link.label}
            </Link>
          ))}
          <Link to="/builder" className="btn-glow px-5 py-2 rounded-lg text-sm font-semibold text-primary-foreground mt-2">
            Start Career Simulation
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
