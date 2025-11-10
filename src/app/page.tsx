"use client";
import Header from "@/components/globals/header";
import PhilippineYouthDevelopmentPlan from '@/components/globals/pydp';
import TechAssistant from '@/components/globals/tech-assistant';
import Footer from '@/components/globals/footer';
import HeroSection from '@/components/globals/hero';
import MissionVisionSection from '@/components/globals/mission-vision';
import HelpCenter from '@/components/globals/help-center';

export default function HomePage() {
  return (
    <div className="min-h-screen dark:bg-[#30334e] bg-white">
      <section className="relative hero-background">
        <Header />
      </section>
      <HeroSection />
      <MissionVisionSection />
      <PhilippineYouthDevelopmentPlan />
      <TechAssistant />
      <Footer />
      <HelpCenter />
    </div>
  );
}
