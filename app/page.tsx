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
        <div className="relative min-h-screen overflow-x-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 selection:bg-orange-500/30">
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
