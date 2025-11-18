import { streamText, convertToModelMessages } from "ai";
import { z } from "zod/v3";
import { resolveModel } from "@/lib/model-provider";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { messages, scene, modelConfig } = await req.json();

        const systemMessage = `
You are an Excalidraw scene architect.
Return only well-formed Excalidraw scene JSON (elements + appState + files) via the display_excalidraw tool.

Rules for reliability:
- ALWAYS include a complete object: { "elements": [...], "appState": {...}, "files": {...} }.
- If unsure, reuse the current scene and apply small changes instead of rebuilding from scratch.
- Keep layouts tidy, distribute nodes evenly, align connectors, and avoid overlaps.
- Use meaningful text labels; keep coordinates reasonable (within a 1200x800 canvas).
- Never stream raw JSON in text replies; only send it through the tool call.
- If you need a blank start, use an empty array for elements and empty objects for appState/files.
- Exactly ONE display_excalidraw tool call per response.
`;

        const lastMessage = messages[messages.length - 1];
        const lastMessageText =
            lastMessage.parts?.find((part: any) => part.type === "text")
                ?.text || "";
        const fileParts =
            lastMessage.parts?.filter((part: any) => part.type === "file") ||
            [];

        const formattedTextContent = `
Current scene JSON:
"""json
${scene || '{"elements": [], "appState": {}, "files": {}}'}
"""
User input:
"""md
${lastMessageText}
"""
`;

        const modelMessages = convertToModelMessages(messages);
        let enhancedMessages = [...modelMessages];

        if (enhancedMessages.length > 0) {
            const lastModelMessage = enhancedMessages[enhancedMessages.length - 1];
            if (lastModelMessage.role === "user") {
                const contentParts: any[] = [
                    { type: "text", text: formattedTextContent },
                ];

                for (const filePart of fileParts) {
                    contentParts.push({
                        type: "image",
                        image: filePart.url,
                        mimeType: filePart.mediaType,
                    });
                }

                enhancedMessages = [
                    ...enhancedMessages.slice(0, -1),
                    { ...lastModelMessage, content: contentParts },
                ];
            }
        }

        const { client, model } = resolveModel(modelConfig);

        const result = streamText({
            system: systemMessage,
            model: client.chat(model),
            messages: enhancedMessages,
            temperature: 0,
            tools: {
                display_excalidraw: {
                    description:
                        "Render an Excalidraw scene by supplying its full JSON payload.",
                    inputSchema: z.object({
                        scene: z
                            .string()
                            .describe(
                                "Stringified JSON containing {elements, appState, files}"
                            ),
                        summary: z
                            .string()
                            .optional()
                            .describe(
                                "Optional short description of what changed"
                            ),
                    }),
                },
            },
        });

        function errorHandler(error: unknown) {
            if (error == null) {
                return "unknown error";
            }
            if (typeof error === "string") {
                return error;
            }
            if (error instanceof Error) {
                return error.message;
            }
            return JSON.stringify(error);
        }

        return result.toUIMessageStreamResponse({
            onError: errorHandler,
        });
    } catch (error) {
        console.error("Error in excalidraw route:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
