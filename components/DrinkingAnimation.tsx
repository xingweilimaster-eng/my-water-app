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
    // Sequence the animation using window.setTimeout
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
                
                {/* Eyes */}
                <div className="mt-16 flex gap-6 w-full justify-center">
                   <div className={`w-10 h-4 bg-white shadow-[0_0_15px_white] transition-all ${isDrinking ? 'h-1' : ''} clip-path-triangle`}></div>
                   <div className={`w-10 h-4 bg-white shadow-[0_0_15px_white] transition-all ${isDrinking ? 'h-1' : ''} clip-path-triangle`}></div>
                </div>

                {/* Mouth Area (Exposed) */}
                <div className="absolute bottom-0 w-20 h-12 bg-orange-200 rounded-t-lg"></div>
             </div>
             {/* Body Hint */}
             <div className="w-56 h-32 bg-gray-800 -mt-4 rounded-t-full border-4 border-black relative z-0 flex justify-center pt-8">
                 <div className="w-16 h-10 bg-yellow-500 rounded-full border-2 border-black"></div>
             </div>
          </div>
        );
      
      case CharacterType.CATWOMAN:
        return (
          <div className="relative flex flex-col items-center">
             {/* Catwoman Head */}
             <div className="w-36 h-40 bg-purple-900 rounded-[2rem] border-4 border-black relative z-10 shadow-2xl flex flex-col items-center">
                {/* Ears */}
                <div className="absolute -top-4 left-2 w-8 h-12 bg-purple-900 border-l-4 border-r-4 border-black rounded-t-full"></div>
                <div className="absolute -top-4 right-2 w-8 h-12 bg-purple-900 border-l-4 border-r-4 border-black rounded-t-full"></div>
                
                {/* Goggles */}
                <div className="mt-14 w-32 h-10 bg-gray-800 rounded-full border-2 border-gray-600 flex justify-center items-center gap-2 opacity-90">
                   <div className="w-10 h-6 bg-white rounded-full opacity-50"></div>
                   <div className="w-10 h-6 bg-white rounded-full opacity-50"></div>
                </div>

                {/* Lips */}
                <div className="absolute bottom-6 w-8 h-4 bg-red-400 rounded-full"></div>
             </div>
             {/* Body Hint */}
             <div className="w-40 h-32 bg-black -mt-4 rounded-t-full border-4 border-gray-800 relative z-0"></div>
          </div>
        );

      case CharacterType.DORAEMON:
      default:
        return (
          <div className="relative flex flex-col items-center">
             {/* Head */}
             <div className="w-44 h-40 bg-blue-400 rounded-full border-4 border-black relative z-10 shadow-2xl">
               <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-32 bg-white rounded-full border-2 border-gray-200"></div>
               {/* Eyes */}
               <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-0">
                  <div className="w-12 h-14 bg-white rounded-full border-2 border-black flex items-center justify-center relative">
                    <div className={`w-3 h-3 bg-black rounded-full absolute transition-all ${isDrinking ? 'bottom-2' : 'right-2'}`}></div>
                  </div>
                  <div className="w-12 h-14 bg-white rounded-full border-2 border-black flex items-center justify-center relative">
                    <div className={`w-3 h-3 bg-black rounded-full absolute transition-all ${isDrinking ? 'bottom-2' : 'left-2'}`}></div>
                  </div>
               </div>
               {/* Nose */}
               <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-black shadow-sm z-20"></div>
               {/* Whiskers */}
               <div className="absolute top-20 left-4 w-10 h-px bg-black rotate-12"></div>
               <div className="absolute top-24 left-4 w-10 h-px bg-black"></div>
               <div className="absolute top-28 left-4 w-10 h-px bg-black -rotate-12"></div>
               <div className="absolute top-20 right-4 w-10 h-px bg-black -rotate-12"></div>
               <div className="absolute top-24 right-4 w-10 h-px bg-black"></div>
               <div className="absolute top-28 right-4 w-10 h-px bg-black rotate-12"></div>
               
               {/* Mouth */}
               {!isDrinking ? (
                 <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-10 border-b-2 border-black rounded-b-full"></div>
               ) : (
                 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-800 rounded-full border-2 border-black"></div>
               )}
             </div>
             
             {/* Body */}
             <div className="w-32 h-24 bg-blue-400 -mt-4 rounded-b-3xl border-4 border-black relative z-0">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-white rounded-full border-2 border-gray-200"></div>
                {/* Bell */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-black shadow-md z-10">
                   <div className="w-full h-1 bg-black mt-2 opacity-50"></div>
                   <div className="w-2 h-2 bg-black rounded-full mx-auto mt-1"></div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
       {/* Dark Overlay */}
       <div 
         className={`absolute inset-0 bg-black transition-opacity duration-500 ${stage > 0 ? 'opacity-40' : 'opacity-0'}`}
       ></div>

       {/* Character Container */}
       <div className={`transform transition-all duration-500 relative ${
          stage === 0 ? 'translate-y-[100vh]' : 
          stage === 5 ? 'translate-y-[100vh]' : 'translate-y-20'
       }`}>
          {renderCharacter()}

          {/* Drink Item */}
          <div className={`absolute top-28 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-30 ${
             stage < 2 ? 'scale-0 opacity-0' : 
             stage === 2 ? 'scale-100 translate-y-20' : 
             stage === 3 ? 'scale-90 -translate-y-4 rotate-12' : 
             'scale-0 opacity-0'
          }`}>
             <div className={`w-16 h-20 rounded-lg border-2 border-black shadow-xl flex items-center justify-center ${drinkOption.bg}`}>
                <drinkOption.icon size={32} className={drinkOption.color} />
             </div>
          </div>

          {/* Hands */}
          <div className={`absolute top-40 left-[-20px] w-10 h-10 bg-white rounded-full border-2 border-black transition-all duration-300 z-40 ${
             stage >= 2 && stage < 4 ? 'translate-x-16 -translate-y-16' : ''
          }`}></div>
          <div className={`absolute top-40 right-[-20px] w-10 h-10 bg-white rounded-full border-2 border-black transition-all duration-300 z-40 ${
             stage >= 2 && stage < 4 ? '-translate-x-16 -translate-y-16' : ''
          }`}></div>

          {/* Happy Effect */}
          {stage === 4 && (
             <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-4 animate-bounce">
                <span className="text-4xl">✨</span>
                <span className="text-4xl">❤️</span>
             </div>
          )}
       </div>
    </div>
  );
};