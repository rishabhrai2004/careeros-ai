import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import DashboardPreview from "@/components/DashboardPreview";
import MentorSection from "@/components/MentorSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <DashboardPreview />
      <MentorSection />
      <Footer />
    </div>
  );
};

export default Index;
