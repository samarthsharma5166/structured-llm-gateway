import {loadEnv} from './env'
import {ChatOpenAI} from '@langchain/openai'
import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
import { ChatGroq } from "@langchain/groq";

export type Provider = "openai" | "gemini" | "groq";

export function createChatModel(){
    loadEnv();
    const forced = (process.env.PROVIDER || "").toLowerCase();
    const hasOpenAi = !!process.env.OPENAI_API_KEY;
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;

    if (forced === "openai" && !hasOpenAi) {
        throw new Error("OPENAI_API_KEY is missing");
    }

    const base = {temperature:0 as const}

    if (forced === "openai" || (!forced && hasOpenAi)){
        return {
            provider:"openai",
            model: new ChatOpenAI({
                ...base,
                apiKey:process.env.OPENAI_API_KEY,
                model:"gpt-4o-mini",
                maxTokens:60000,
            })
        }
    }

    if (forced === "gemini" || (!forced && hasGemini)){
        return {
            provider:"gemini",
            model: new ChatGoogleGenerativeAI({
                ...base,
                apiKey:process.env.GEMINI_API_KEY,
                model:"gemini-2.0-flash-lite",
            })
        }
    }


    if (forced === "groq" || (!forced && hasGroq)){
        return {
            provider:"groq",
            model: new ChatGroq({
                ...base,
                apiKey:process.env.GROQ_API_KEY,
                model:"llama-3.3-70b-versatile",
            })
        }
    }

    throw new Error("No AI provider configured");
}