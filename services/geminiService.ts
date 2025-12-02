
import { GoogleGenAI } from "@google/genai";
import { DrinkLog, UserProfile, GeminiAnalysis } from "../types";

// Helper to safely get the API Key from various environments
const getApiKey = (): string | undefined => {
  // 1. Try Vite environment variable (Best for Vercel + Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try standard process.env (Node.js / Webpack)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_API_KEY) return process.env.VITE_API_KEY;
    if (process.env.API_KEY) return process.env.API_KEY;
  }

  return undefined;
};

// Lazy initialization to prevent app crash on load if key is missing
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
    
    CRITICAL: YOU MUST ACT AS IF YOU REMEMBER THE USER'S HABITS.
    The user's "Long Term Memory" is provided to you in the form of the profile and logs below. 
    Use this data to form a complete picture of their health.
    
    User Profile (Physical State):
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Daily Goal: ${profile.dailyGoal}ml
    
    Recent Drinking History (Habits):
    - Total Consumed Today: ${totalAmount}ml
    - Detailed Logs: ${drinkDetails || "No drinks recorded today yet"}
    
    Your Role:
    1. Analyze the user's data scientifically (calculate BMI if needed, check hydration levels).
    2. If the user asks "Do you remember my habits?", say YES and cite their data (e.g., "Yes, I know you are ${profile.age} years old and you've drunk ${totalAmount}ml today.").
    3. If they drink too much sugary stuff (Milk Tea, Soda), kindly warn them.
    4. Keep the tone fun and encouraging.
  `;
};

const handleGeminiError = (error: any): string => {
  console.error("Gemini API Error:", error);
  const msg = error.toString().toLowerCase();
  
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
    return "无法连接到 AI 服务器。\n\n如果您在中国大陆，该服务需要科学上网。请检查您的 VPN (梯子) 是否开启并支持全局代理。";
  }
  
  if (msg.includes('key') || msg.includes('auth')) {
    return "API Key 无效或未配置。\n请检查 Vercel 环境变量设置 (VITE_API_KEY)。";
  }
  
  return "AI 暂时开小差了，请稍后再试。(" + msg + ")";
};

// Single-shot analysis
export const analyzeHydration = async (
  logs: DrinkLog[],
  profile: UserProfile,
  period: 'daily' | 'weekly'
): Promise<GeminiAnalysis> => {
  try {
    const ai = getGenAI(); // Init here safely
    const context = getContextPrompt(logs, profile);
    const prompt = `
      ${context}
      
      Task:
      Provide a JSON summary for a ${period} report.
      Format:
      {
        "status": "excellent" | "good" | "warning" | "bad",
        "message": "string (Chinese, max 2 sentences)",
        "tip": "string (Chinese, scientific tip)"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as GeminiAnalysis;
  } catch (error) {
    const errorMsg = handleGeminiError(error);
    return {
      message: errorMsg,
      status: "warning",
      tip: "请检查网络或设置。"
    };
  }
};

// Chat Function
export const createChatSession = async (logs: DrinkLog[], profile: UserProfile) => {
  try {
    const ai = getGenAI(); // Init here safely
    const systemInstruction = getContextPrompt(logs, profile);

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return chat;
  } catch (error) {
    throw error;
  }
};

export const formatChatError = (error: any): string => {
    return handleGeminiError(error);
};
