import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Casca Body / UI Font
const neueMontreal = localFont({
    src: [
        {
            path: "./fonts/NeueMontreal-Regular.otf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/NeueMontreal-Medium.otf",
            weight: "500",
            style: "normal",
        },
    ],
    variable: "--font-sans",
    display: "swap",
});

// 2. Authentic Casca Denton Variable Display Serif
const denton = localFont({
    src: "./fonts/Denton-Variable.woff2",
    variable: "--font-serif",
    display: "swap",
    weight: "100 900", // CRITICAL: unlocks full width & weight axes for Denton
});

export const metadata: Metadata = {
    title: "Smart Track",
    description:
        "A simple and clean planner to manage your daily tasks, habits, and academic milestones.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${neueMontreal.variable} ${denton.variable} dark antialiased`}
            style={{ colorScheme: "dark" }}
        >
            <body className="min-h-screen bg-background font-sans text-foreground">
                {children}
            </body>
        </html>
    );
}
