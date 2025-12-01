
import { GoogleGenAI } from "@google/genai";
import { DrinkLog, UserProfile, GeminiAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  
  return "AI 暂时开小差了，请稍后再试。";
};

// Legacy single-shot analysis
export const analyzeHydration = async (
  logs: DrinkLog[],
  profile: UserProfile,
  period: 'daily' | 'weekly'
): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    return {
       message: "请配置 API Key。",
       status: "warning",
       tip: "需要 API Key 才能进行 AI 分析。"
    };
  }

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

  try {
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
      status: "good",
      tip: "保持喝水！"
    };
  }
};

// New Chat Function
export const createChatSession = async (logs: DrinkLog[], profile: UserProfile) => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const systemInstruction = getContextPrompt(logs, profile);

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return chat;
};

export const formatChatError = (error: any): string => {
    return handleGeminiError(error);
};
