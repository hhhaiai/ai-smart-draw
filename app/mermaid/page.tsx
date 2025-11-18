"use client";

import React, { useEffect, useState } from "react";
import { MermaidProvider } from "@/contexts/mermaid-context";
import { MermaidWorkspace } from "@/components/mermaid-workspace";
import MermaidChatPanel from "@/components/mermaid-chat-panel";

export default function MermaidPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Please open this application on a desktop or laptop
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <MermaidProvider>
            <div className="flex h-screen bg-gray-100">
                <div className="w-3/4 p-1 h-full">
                    <MermaidWorkspace />
                </div>
                <div className="w-1/4 h-full p-1">
                    <MermaidChatPanel />
                </div>
            </div>
        </MermaidProvider>
    );
}
