export enum DrinkType {
  WATER = '水',
  TEA = '茶',
  COFFEE = '咖啡',
  MILK_TEA = '奶茶',
  JUICE = '果汁',
  SODA = '汽水',
  ENERGY = '功能饮料',
  OTHER = '其他'
}

export enum CharacterType {
  DORAEMON = 'doraemon',
  OPTIMUS = 'optimus',
  BATMAN = 'batman',
  CATWOMAN = 'catwoman'
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  avatar?: string; // base64
  dailyGoal: number; // in ml
  reminderInterval: number; // in minutes
  selectedCharacter: CharacterType;
}

export interface DrinkLog {
  id: string;
  type: DrinkType;
  customName?: string; // For 'Other' types
  amount: number; // in ml
  timestamp: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  total: number;
  goal: number;
  percentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface GeminiAnalysis {
  message: string;
  status: 'excellent' | 'good' | 'warning' | 'bad';
  tip: string;
}