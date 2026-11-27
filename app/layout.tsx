import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
});

const mono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const serif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-serif",
});

export const metadata: Metadata = {
    title: "SmartTrack | Productivity Workspace",
    description: "Minimalist workspace for task planning, habit streaks, and academic milestones.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable} dark`}>
            <body className="min-h-screen bg-[#0E0D0C] text-[#F9F8F6] antialiased">
                {children}
            </body>
        </html>
    );
}
