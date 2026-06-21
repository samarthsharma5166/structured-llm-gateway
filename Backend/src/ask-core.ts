import { createChatModel } from "./lc-model";
import { AskResult, AskResultSchema } from "./schema";

export async function askStructure(query:string):Promise<AskResult> {
    const { model } = createChatModel()
    const system = "you are a concise assistant. Return only the requested JSON"
    const user = `Summarize for a beginner:\n` +
    `"${query}"`+
    `Return fields: summary (short paragraph), confidence(0..1)`;
    
    const structured = model.withStructuredOutput(AskResultSchema);
    const resutlt = await structured.invoke([{
        role:"system",
        content:system
    },
     {
        role:"user",
        content:user
    }]);
    return resutlt;
}  