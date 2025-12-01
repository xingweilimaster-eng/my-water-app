import { UserProfile } from "./types";

export const calculateScientificGoal = (weight: number, age: number): number => {
  // Basic formula: 35ml per kg of body weight
  let base = weight * 35;
  
  // Age adjustments
  if (age > 55) {
    base = weight * 30; // Older adults need slightly less calculation base but more frequent
  } else if (age < 18) {
    base = weight * 40; // Growing teens
  }

  return Math.round(base);
};

export const getDayKey = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
};