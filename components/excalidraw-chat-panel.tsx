"use client";

import type React from "react";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatInput } from "@/components/chat-input";
import { ExcalidrawChatMessageDisplay } from "@/components/excalidraw-chat-message-display";
import { useExcalidraw } from "@/contexts/excalidraw-context";
import { ModeNav } from "@/components/mode-nav";
import { ModelConfigDialog } from "@/components/model-config-dialog";
import { useModelConfig } from "@/contexts/model-config-context";

export default function ExcalidrawChatPanel() {
    const { sceneData, clearScene } = useExcalidraw();
    const [files, setFiles] = useState<File[]>([]);
    const [input, setInput] = useState("");
    const { config: modelConfig } = useModelConfig();

    const { messages, sendMessage, addToolResult, status, error, setMessages } =
        useChat({
            transport: new DefaultChatTransport({
                api: "/api/excalidraw",
            }),
            async onToolCall({ toolCall }) {
                if (toolCall.toolName === "display_excalidraw") {
                    addToolResult({
                        tool: "display_excalidraw",
                        toolCallId: toolCall.toolCallId,
                        output: "Canvas updated",
                    });
                }
            },
        });

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || status === "streaming") return;

        try {
            const parts: any[] = [{ type: "text", text: input }];

            if (files.length > 0) {
                for (const file of files) {
                    const reader = new FileReader();
                    const dataUrl = await new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });

                    parts.push({
                        type: "file",
                        url: dataUrl,
                        mediaType: file.type,
                    });
                }
            }

            sendMessage(
                { parts },
                {
                    body: {
                        scene: sceneData,
                        modelConfig,
                    },
                }
            );

            setInput("");
            setFiles([]);
        } catch (err) {
            console.error("Failed to submit Excalidraw prompt:", err);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInput(e.target.value);
    };

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    return (
        <Card className="h-full flex flex-col rounded-none py-0 gap-0">
            <CardHeader className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-4">
                    <CardTitle className="text-lg font-semibold">
                        Excalidraw
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap justify-end">
                        <ModelConfigDialog size="sm" />
                        <ModeNav active="excalidraw" className="flex gap-2 flex-wrap justify-end" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden px-2">
                <ExcalidrawChatMessageDisplay
                    messages={messages}
                    error={error}
                    setInput={setInput}
                    setFiles={handleFileChange}
                />
            </CardContent>
            <CardFooter className="p-2">
                <ChatInput
                    input={input}
                    status={status}
                    onSubmit={onFormSubmit}
                    onChange={handleInputChange}
                    onClearChat={() => {
                        setMessages([]);
                        clearScene();
                    }}
                    files={files}
                    onFileChange={handleFileChange}
                    enableHistoryControls={false}
                />
            </CardFooter>
        </Card>
    );
}
