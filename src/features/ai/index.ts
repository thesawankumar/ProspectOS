// Features — AI
export type { AIChatRequest, AIChatResponse, AIGenerateRequest } from "@/types";

export async function chatWithAI(message: string, history: unknown[] = []) {
  const res = await fetch("/api/v1/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("AI chat failed");
  return (await res.json()).data;
}

export async function generateContent(type: string, context: Record<string, string | undefined>) {
  const res = await fetch("/api/v1/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, context }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Content generation failed");
  return (await res.json()).data;
}
