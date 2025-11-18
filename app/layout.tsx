import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { DiagramProvider } from "@/contexts/diagram-context";
import { ModelConfigProvider } from "@/contexts/model-config-context";
import "@excalidraw/excalidraw/index.css";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI Smart Draw",
    description: "An AI-powered drawing tool that integrates with draw.io, Mermaid, PlantUML, Excalidraw and more",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <DiagramProvider>
                    <ModelConfigProvider>{children}</ModelConfigProvider>
                </DiagramProvider>

                <Analytics />
            </body>
        </html>
    );
}
