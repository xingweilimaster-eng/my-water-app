import { DrinkType, CharacterType } from "./types";
import { Coffee, GlassWater, Milk, Zap, CupSoda, Info } from "lucide-react";

export const DRINK_OPTIONS = [
  { type: DrinkType.WATER, icon: GlassWater, color: "text-blue-500", bg: "bg-blue-100" },
  { type: DrinkType.TEA, icon: Coffee, color: "text-green-600", bg: "bg-green-100" },
  { type: DrinkType.COFFEE, icon: Coffee, color: "text-amber-700", bg: "bg-amber-100" },
  { type: DrinkType.MILK_TEA, icon: Milk, color: "text-orange-400", bg: "bg-orange-100" },
  { type: DrinkType.JUICE, icon: CupSoda, color: "text-yellow-500", bg: "bg-yellow-100" },
  { type: DrinkType.SODA, icon: CupSoda, color: "text-purple-500", bg: "bg-purple-100" },
  { type: DrinkType.ENERGY, icon: Zap, color: "text-red-500", bg: "bg-red-100" },
  { type: DrinkType.OTHER, icon: Info, color: "text-gray-500", bg: "bg-gray-100" },
];

export const PRESET_AMOUNTS = [150, 250, 350, 500];

export const DEFAULT_GOAL = 2500;

export const CHARACTERS = [
  { id: CharacterType.DORAEMON, name: '蓝胖子', color: 'bg-blue-500' },
  { id: CharacterType.OPTIMUS, name: '柱子哥', color: 'bg-red-600' },
  { id: CharacterType.BATMAN, name: '黑暗骑士', color: 'bg-gray-900' },
  { id: CharacterType.CATWOMAN, name: '猫女', color: 'bg-purple-900' },
];