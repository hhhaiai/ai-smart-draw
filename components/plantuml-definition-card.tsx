"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCopy, ClipboardCheck } from "lucide-react";

interface PlantUMLDefinitionCardProps {
    definition: string;
    onDefinitionChange?: (definition: string) => void;
}

export function PlantUMLDefinitionCard({
    definition,
    onDefinitionChange,
}: PlantUMLDefinitionCardProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        if (!definition) return;
        await navigator.clipboard.writeText(definition);
        setCopied(true);
    };

    return (
        <div className="bg-white rounded-lg border shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                <div>
                    <p className="text-sm font-medium">PlantUML 定义</p>
                    <p className="text-xs text-muted-foreground">
                        编辑代码片段可以立即刷新预览。
                    </p>
                </div>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!definition}
                >
                    {copied ? (
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                    ) : (
                    <ClipboardCopy className="h-4 w-4 mr-2" />
                )}
                    {copied ? "已复制" : "复制"}
                </Button>
            </div>
            <div className="flex-1 p-1 bg-muted/10 flex flex-col gap-2 overflow-hidden">
                <Textarea
                    value={definition}
                    onChange={(event) => onDefinitionChange?.(event.target.value)}
                    placeholder="Describe a diagram or type PlantUML directly..."
                    className="flex-1 min-h-0 text-xs resize-none bg-white/70 focus-visible:ring-2 overflow-auto"
                    spellCheck={false}
                    disabled={!onDefinitionChange}
                />
                <p className="text-[11px] text-muted-foreground">
                    变更的 PlantUML 渲染器实时同步。
                </p>
            </div>
        </div>
    );
}
