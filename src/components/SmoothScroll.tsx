import React, { useEffect } from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    let current = 0;
    let target = 0;
    const ease = 0.075;

    const smoothScroll = () => {
      target = window.scrollY;
      current += (target - current) * ease;
      
      if (Math.abs(target - current) > 0.1) {
        // We don't actually want to scroll the window again (infinite loop)
        // Instead, we could use a transform on a wrapper, but for simplicity
        // and accessibility, we'll just use native smooth scroll behavior
        // logic if supported, or a very subtle raf for custom feels.
      }
      requestAnimationFrame(smoothScroll);
    };

    // For the "Lusion" feel, we'll use a CSS-based approach for now 
    // to ensure maximum compatibility without external libraries.
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
