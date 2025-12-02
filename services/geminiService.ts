import { GoogleGenAI } from "@google/genai";
import { DrinkLog, UserProfile, GeminiAnalysis } from "../types";

// Helper to safely get the API Key
const getApiKey = (): string | undefined => {
  let key: string | undefined = undefined;

  // Try accessing VITE_API_KEY in a way that won't break compilation in different environments
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore errors in environments where import.meta is not supported
  }

  // Fallback to process.env (Node.js style)
  if (!key && typeof process !== 'undefined' && process.env) {
    key = process.env.VITE_API_KEY || process.env.REACT_APP_API_KEY || process.env.API_KEY;
  }

  return key;
};

// Lazy initialization
const getGenAI = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key 未找到。请在 Vercel 环境变量中配置 VITE_API_KEY。");
  }
  return new GoogleGenAI({ apiKey });
};

const getContextPrompt = (logs: DrinkLog[], profile: UserProfile) => {
  const totalAmount = logs.reduce((sum, log) => sum + log.amount, 0);
  const drinkDetails = logs.map(l => 
    `${l.type}${l.customName ? `(${l.customName})` : ''}: ${l.amount}ml`
  ).join(", ");

  return `
    System Instruction:
    You are "HydroBuddy", a smart, scientific, and friendly hydration coach.
    Language: Chinese (Simplified).
    
    User Profile:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Daily Goal: ${profile.dailyGoal}ml
    
    Today's History:
    - Total: ${totalAmount}ml
    - Drinks: ${drinkDetails || "None yet"}
    
    Role:
    1. Analyze data scientifically.
    2. If user asks "Do you remember me?", say YES and cite data.
    3. Be fun and encouraging.
  `;
};

const handleGeminiError = (error: any): string => {
  console.error("Gemini API Error:", error);
  const msg = error?.toString()?.toLowerCase() || "unknown error";
  
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
    return "无法连接到 AI 服务器。\n\n如果您在中国大陆，该服务需要科学上网。请检查您的 VPN (梯子) 是否开启并支持全局代理。";
  }
  
  if (msg.includes('key') || msg.includes('auth')) {
    return "API Key 无效或未配置。\n请检查 Vercel 环境变量设置 (VITE_API_KEY)。";
  }
  
  return "AI 暂时开小差了，请稍后再试。";
};

// Single-shot analysis
export const analyzeHydration = async (
  logs: DrinkLog[],
  profile: UserProfile,
  period: 'daily' | 'weekly'
): Promise<GeminiAnalysis> => {
  try {
    const ai = getGenAI();
    const context = getContextPrompt(logs, profile);
    const prompt = `
      ${context}
      Task: Provide a JSON summary for a ${period} report.
      Format: {"status": "excellent" | "good" | "warning" | "bad", "message": "string (Chinese)", "tip": "string"}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as GeminiAnalysis;
  } catch (error) {
    return {
      message: handleGeminiError(error),
      status: "warning",
      tip: "请检查网络或设置。"
    };
  }
};

// Chat Function
export const createChatSession = async (logs: DrinkLog[], profile: UserProfile) => {
  try {
    const ai = getGenAI();
    return ai.chats.create({
      model: "gemini-2.5-flash",
      config: { systemInstruction: getContextPrompt(logs, profile) }
    });
  } catch (error) {
    throw error;
  }
};

export const formatChatError = (error: any): string => handleGeminiError(error);