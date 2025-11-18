"use client";

import React, { useEffect, useState } from "react";
import { PlantUMLProvider } from "@/contexts/plantuml-context";
import { PlantUMLWorkspace } from "@/components/plantuml-workspace";
import PlantUMLChatPanel from "@/components/plantuml-chat-panel";

export default function PlantUMLPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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
        <PlantUMLProvider>
            <div className="flex h-screen bg-gray-100">
                <div className="w-3/4 p-1 h-full">
                    <PlantUMLWorkspace />
                </div>
                <div className="w-1/4 h-full p-1">
                    <PlantUMLChatPanel />
                </div>
            </div>
        </PlantUMLProvider>
    );
}
