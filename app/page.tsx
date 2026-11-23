import React from "react";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import FAQ from "@/components/landing/faq";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-[#20201f] selection:text-[#f9f8f6]">
            <Header />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
