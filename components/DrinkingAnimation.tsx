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
    // Sequence the animation
    const t1 = setTimeout(() => setStage(1), 100);   // Character appears
    const t2 = setTimeout(() => setStage(2), 1000);  // Character grabs drink
    const t3 = setTimeout(() => setStage(3), 2000);  // Drinking / Gulping
    const t4 = setTimeout(() => setStage(4), 3500);  // Happy / Finished
    const t5 = setTimeout(() => onComplete(), 4500); // Close

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
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
                <div className="mt-16 flex gap-6 z-20">
                    <div className={`w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white ${isDrinking ? 'scale-y-50' : ''}`}></div>
                    <div className={`w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white ${isDrinking ? 'scale-y-50' : ''}`}></div>
                </div>

                {/* Face/Mouth Area */}
                <div className="absolute bottom-0 w-full h-16 bg-[#ffdbac] flex justify-center pt-2">
                     <div className={`w-12 h-1 bg-black opacity-30 ${isHappy ? 'rounded-b-full h-4 bg-black/50' : ''}`}></div>
                </div>
             </div>
             {/* Body Hint */}
             <div className="w-48 h-32 bg-gray-800 -mt-2 rounded-t-3xl border-4 border-black relative z-0 flex justify-center pt-8">
                 <div className="w-24 h-16 bg-yellow-500 rounded-full border-2 border-black opacity-80 flex items-center justify-center">
                     <div className="w-16 h-4 bg-black rounded-full"></div>
                 </div>
                 {/* Cape */}
                 <div className="absolute top-4 -left-8 w-12 h-32 bg-black skew-x-12"></div>
                 <div className="absolute top-4 -right-8 w-12 h-32 bg-black -skew-x-12"></div>
             </div>
          </div>
        );

      case CharacterType.CATWOMAN:
        return (
          <div className="relative flex flex-col items-center">
             {/* Catwoman Head */}
             <div className="w-36 h-40 bg-gray-900 rounded-[2rem] border-4 border-black relative z-10 shadow-2xl flex flex-col items-center">
                 {/* Ears */}
                 <div className="absolute -top-4 left-2 w-8 h-12 bg-gray-900 border-2 border-black rounded-t-full"></div>
                 <div className="absolute -top-4 right-2 w-8 h-12 bg-gray-900 border-2 border-black rounded-t-full"></div>

                 {/* Goggles */}
                 <div className="mt-12 flex gap-1 z-20">
                     <div className="w-14 h-14 rounded-full bg-gray-300 border-4 border-gray-600 opacity-90 relative overflow-hidden">
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full opacity-50"></div>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-gray-300 border-4 border-gray-600 opacity-90 relative overflow-hidden">
                        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full opacity-50"></div>
                     </div>
                 </div>

                 {/* Lips */}
                 <div className="absolute bottom-4 w-10 h-4 bg-red-700 rounded-full">
                    {isHappy && <div className="w-full h-full border-b-2 border-white rounded-full"></div>}
                 </div>
             </div>
             {/* Body Hint */}
             <div className="w-32 h-32 bg-black -mt-2 rounded-t-3xl border-4 border-gray-800 relative z-0 flex justify-center">
                 <div className="w-full h-full bg-gradient-to-b from-gray-800 to-black opacity-50"></div>
                 <div className="absolute top-10 w-4 h-20 bg-gray-700/30"></div> {/* Zipper hint */}
             </div>
          </div>
        );

      case CharacterType.DORAEMON:
      default:
        // Original Doraemon
        return (
          <div className="relative flex flex-col items-center">
                {/* Head */}
                <div className="w-48 h-44 bg-[#0096e0] rounded-[50%_50%_45%_45%] border-4 border-black relative z-10 shadow-2xl flex justify-center">
                    {/* Face (White Area) */}
                    <div className="absolute bottom-2 w-40 h-32 bg-white rounded-[45%_45%_50%_50%] border-2 border-gray-100"></div>
                    {/* Eyes */}
                    <div className="absolute top-6 flex gap-1 z-20">
                        <div className="w-12 h-14 bg-white border-2 border-black rounded-[50%] flex items-center justify-center relative">
                             {isHappy ? (
                                 <div className="w-6 h-3 border-t-4 border-black rounded-full mt-2"></div> 
                             ) : (
                                 <div className={`w-3 h-4 bg-black rounded-full absolute top-5 right-3 ${isDrinking ? 'animate-bounce' : ''}`}></div>
                             )}
                        </div>
                        <div className="w-12 h-14 bg-white border-2 border-black rounded-[50%] flex items-center justify-center relative">
                             {isHappy ? (
                                 <div className="w-6 h-3 border-t-4 border-black rounded-full mt-2"></div>
                             ) : (
                                 <div className={`w-3 h-4 bg-black rounded-full absolute top-5 left-3 ${isDrinking ? 'animate-bounce' : ''}`}></div>
                             )}
                        </div>
                    </div>
                    {/* Nose */}
                    <div className="absolute top-16 z-30 w-8 h-8 bg-red-600 rounded-full border-2 border-black shadow-sm">
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-2 opacity-60"></div>
                    </div>
                    {/* Philtrum */}
                    <div className="absolute top-24 z-20 w-1 h-8 bg-black"></div>
                    {/* Whiskers */}
                    <div className="absolute top-20 left-4 w-12 h-0.5 bg-black rotate-12 z-20"></div>
                    <div className="absolute top-24 left-3 w-12 h-0.5 bg-black z-20"></div>
                    <div className="absolute top-28 left-4 w-12 h-0.5 bg-black -rotate-12 z-20"></div>
                    <div className="absolute top-20 right-4 w-12 h-0.5 bg-black -rotate-12 z-20"></div>
                    <div className="absolute top-24 right-3 w-12 h-0.5 bg-black z-20"></div>
                    <div className="absolute top-28 right-4 w-12 h-0.5 bg-black rotate-12 z-20"></div>
                    {/* Mouth */}
                    <div className={`absolute top-24 w-24 h-12 border-b-4 border-black rounded-full z-10 transition-all ${
                        isDrinking ? 'h-16 bg-[#990000] border-none scale-110 overflow-hidden' : ''
                    }`}>
                        {isDrinking && (
                            <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-12 h-8 bg-orange-400 rounded-t-full"></div>
                        )}
                    </div>
                </div>
                {/* Collar */}
                <div className="w-36 h-8 bg-red-600 rounded-full border-2 border-black -mt-4 relative z-20 flex justify-center items-center">
                    {/* Bell */}
                    <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-black flex flex-col items-center justify-center shadow-md translate-y-2">
                         <div className="w-8 h-1 bg-black/20 rounded-full mb-1"></div>
                         <div className="w-2 h-2 bg-black rounded-full"></div>
                         <div className="w-1 h-3 bg-black"></div>
                    </div>
                </div>
                {/* Body Hint */}
                <div className="w-40 h-32 bg-[#0096e0] -mt-6 rounded-b-[3rem] border-4 border-black relative z-0">
                     <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-24 bg-white rounded-full border-2 border-black/10"></div>
                </div>
          </div>
        );
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-900 bg-opacity-80 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-sm h-96 flex flex-col items-center justify-end pb-10">
        
        {/* The Drink Cup */}
        <div 
          className={`absolute bottom-20 z-20 transition-all duration-700 ease-in-out ${
            stage >= 3 ? 'scale-75 translate-y-[40px] rotate-[-10deg] opacity-0' : ''
          } ${stage === 0 ? 'opacity-0 translate-y-[100px]' : 'opacity-100'}`}
        >
           <div className={`w-16 h-20 rounded-b-xl rounded-t-sm ${drinkOption.bg} border-4 border-white shadow-xl flex items-center justify-center relative overflow-hidden`}>
              <div className={`absolute bottom-0 left-0 w-full bg-current opacity-30 transition-all duration-[1500ms] ease-linear ${stage >= 3 ? 'h-0' : 'h-3/4'}`}></div>
              <drinkOption.icon size={32} className={`${drinkOption.color} relative z-10`} />
              <div className="absolute -top-6 right-2 w-2 h-10 bg-white -rotate-12 border border-gray-100"></div>
           </div>
        </div>

        {/* The Character */}
        <div className={`absolute bottom-0 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            stage === 0 ? 'translate-y-full' : 'translate-y-10'
        }`}>
            {renderCharacter()}
            
            {/* Generic Hands (Paws) - Adjusted position for general fit */}
            <div className={`absolute top-32 -left-16 w-16 h-16 bg-white border-2 border-black rounded-full z-30 transition-all duration-300 ${
                stage >= 2 ? 'translate-x-20 translate-y-0 rotate-45' : ''
            }`}></div>
            <div className={`absolute top-32 -right-16 w-16 h-16 bg-white border-2 border-black rounded-full z-30 transition-all duration-300 ${
                stage >= 2 ? '-translate-x-20 translate-y-0 -rotate-45' : ''
            }`}></div>
        </div>

        {/* Text Effects */}
        {stage === 3 && (
            <div className="absolute top-10 text-4xl font-bold text-white brand-font animate-bounce drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                咕咚咕咚!
            </div>
        )}

        {stage === 4 && (
            <div className="absolute top-10 text-5xl font-bold text-yellow-300 brand-font animate-pulse drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                太爽啦!
            </div>
        )}

      </div>
    </div>
  );
};