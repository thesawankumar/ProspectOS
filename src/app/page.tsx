import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Companies from "@/components/landing/Companies";
import Workflow from "@/components/landing/Workflow";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Interactive 3D Hero */}
        <Hero />

        {/* Brand Scrolling Marquee */}
        <Companies />

        {/* Interactive Pipeline Automation Mockup */}
        <Workflow />

        {/* Bento Grid Features Grid */}
        <Features />

        {/* Testimonials Masonry Grid */}
        <Testimonials />

        {/* Plan Pricing Configurations */}
        <Pricing />

        {/* Questions Accordion Board */}
        <FAQ />
      </main>

      {/* Structured Footer */}
      <Footer />
    </div>
  );
}
