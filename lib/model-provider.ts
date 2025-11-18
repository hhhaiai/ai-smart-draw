import { createOpenAI } from "@ai-sdk/openai";

export interface ModelConfigInput {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
}

const DEFAULTS = {
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY,
};

export function resolveModel(config?: ModelConfigInput) {
    const baseUrl = config?.baseUrl?.trim() || DEFAULTS.baseUrl;
    const apiKey = config?.apiKey?.trim() || DEFAULTS.apiKey;
    const model = config?.model?.trim() || DEFAULTS.model;

    const client = createOpenAI({
        apiKey,
        baseURL: baseUrl,
        name: "openai",
    });

    return { client, model };
}
