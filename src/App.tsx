import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Builder from "./pages/Builder.tsx";
import Careers from "./pages/Careers.tsx";
import MarketIntelligence from "./pages/MarketIntelligence.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor") as HTMLElement;
    const outline = document.querySelector(".custom-cursor-outline") as HTMLElement;

    const moveCursor = (e: MouseEvent) => {
      if (cursor && outline) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        outline.style.left = `${e.clientX}px`;
        outline.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="custom-cursor" />
        <div className="custom-cursor-outline" />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/market-intelligence" element={<MarketIntelligence />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
