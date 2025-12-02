
import React, { useEffect, useState } from 'react';
import { DrinkType, CharacterType } from '../types';
import { DRINK_OPTIONS } from '../constants';

interface DrinkingAnimationProps {
  type: DrinkType;
  characterType: CharacterType;
  onComplete: () => void;
}

export const DrinkingAnimation: React.FC<DrinkingAnimationProps> = ({ type, characterType, onComplete }) => {
  const [stage, setStage] = useState(0);
  const drinkOption = DRINK_OPTIONS.find(d => d.type === type) || DRINK_OPTIONS[0];

  useEffect(() => {
    // Sequence the animation using window.setTimeout to avoid Node.js Timeout type conflicts
    const t1 = window.setTimeout(() => setStage(1), 100);   // Character appears
    const t2 = window.setTimeout(() => setStage(2), 1000);  // Character grabs drink
    const t3 = window.setTimeout(() => setStage(3), 2000);  // Drinking / Gulping
    const t4 = window.setTimeout(() => setStage(4), 3500);  // Happy / Finished
    const t5 = window.setTimeout(() => onComplete(), 4500); // Close

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, [onComplete]);

  // Render different characters using pure CSS/divs
  const renderCharacter = () => {
    const isDrinking = stage === 3;
    const isHappy = stage === 4;

    switch (characterType) {
      case CharacterType.OPTIMUS:
        return (
          <div className="relative flex flex-col items-center">
             {/* Optimus Head */}
             <div className="w-40 h-44 bg-blue-700 rounded-lg border-4 border-gray-800 relative z-10 shadow-2xl flex flex-col items-center">
                {/* Antennas */}
                <div className="absolute -top-12 -left-2 w-4 h-16 bg-blue-700 border-2 border-gray-800"></div>
                <div className="absolute -top-12 -right-2 w-4 h-16 bg-blue-700 border-2 border-gray-800"></div>
                {/* Center Crest */}
                <div className="absolute -top-6 w-12 h-8 bg-blue-600 border-2 border-gray-800 rounded-t-lg"></div>
                
                {/* Eyes Area */}
                <div className="mt-12 flex gap-4 w-full justify-center px-4">
                   <div className={`w-10 h-6 bg-cyan-400 rounded-sm shadow-[0_0_10px_cyan] transition-all ${isDrinking ? 'h-2 bg-cyan-600' : ''}`}></div>
                   <div className={`w-10 h-6 bg-cyan-400 rounded-sm shadow-[0_0_10px_cyan] transition-all ${isDrinking ? 'h-2 bg-cyan-600' : ''}`}></div>
                </div>

                {/* Face Mask */}
                <div className="absolute bottom-2 w-32 h-20 bg-gray-300 border-2 border-gray-700 flex flex-col items-center justify-center gap-1 rounded-b-md">
                   <div className="w-1 h-12 bg-gray-400 absolute center"></div>
                   {isHappy && <div className="absolute top-0 text-xs font-bold text-blue-800">ENERGY!</div>}
                </div>
             </div>
             {/* Body Hint */}
             <div className="w-48 h-32 bg-red-600 -mt-2 rounded-t-xl border-4 border-black relative z-0 flex justify-center pt-4">
                 <div className="w-20 h-16 bg-gray-400 border-2 border-black grid grid-cols-2 gap-1 p-1">
                     <div className="bg-yellow-400 h-full w-full"></div>
                     <div className="bg-yellow-400 h-full w-full"></div>
                 </div>
             </div>
          </div>
        );

      case CharacterType.BATMAN:
        return (
          <div className="relative flex flex-col items-center">
             {/* Batman Head */}
             <div className="w-40 h-44 bg-gray-900 rounded-3xl border-4 border-black relative z-10 shadow-2xl flex flex-col items-center overflow-hidden">
                {/* Ears */}
                <div className="absolute -top-6 left-0 w-8 h-16 bg-gray-900 border-l-4 border-r-4 border-black -skew-x-12"></div>
                <div className="absolute -top-6 right-0 w-8 h-16 bg-gray-900 border-l-4 border-r-4 border-black skew-x-12"></div>
                
                {