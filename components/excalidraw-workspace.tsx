"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useMemo, useCallback } from "react";
import { useExcalidraw } from "@/contexts/excalidraw-context";
import { ExcalidrawSceneCard } from "@/components/excalidraw-scene-card";

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    { ssr: false }
);

export function ExcalidrawWorkspace({
    onRequestHistory,
}: {
    onRequestHistory: () => void;
}) {
    const { sceneData, recordScene, clearScene, excalidrawAPIRef, history } =
        useExcalidraw();

    const initialData = useMemo(() => {
        try {
            return JSON.parse(sceneData);
        } catch {
            return undefined;
        }
    }, [sceneData]);

    const handleOnChange = useCallback(
        (elements: readonly any[], appState: Record<string, any>, files: any) => {
            // avoid mutating Excalidraw internal state by cloning
            const elementsCopy = elements.map((element) => ({ ...element }));
            recordScene(elementsCopy, appState, files);
        },
        [recordScene]
    );

    return (
        <div className="flex flex-col h-full gap-1">
            <div className="flex-1 min-h-0 border rounded-lg overflow-hidden bg-white">
                <Excalidraw
                    excalidrawAPI={(api) => {
                        excalidrawAPIRef.current = api;
                    }}
                    initialData={initialData}
                    onChange={handleOnChange}
                />
            </div>
            <div className="h-52">
                <ExcalidrawSceneCard
                    onClear={clearScene}
                    onHistory={onRequestHistory}
                    historyDisabled={history.length === 0}
                />
            </div>
        </div>
    );
}
