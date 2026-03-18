import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg btn-glow flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-foreground">CareerVanguard <span className="text-primary">AI</span></span>
      </div>
      <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CareerVanguard AI. Elite career intelligence.</p>
    </div>
  </footer>
);

export default Footer;
