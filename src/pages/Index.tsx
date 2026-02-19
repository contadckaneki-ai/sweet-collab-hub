import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PricingComparison from "@/components/PricingComparison";
import Footer from "@/components/Footer";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Banner />
      <Navbar />
      <Hero />
      <Features />
      <PricingComparison />
      <Footer />
    </div>
  );
};

export default Index;
