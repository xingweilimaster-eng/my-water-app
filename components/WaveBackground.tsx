import React from 'react';

interface WaveBackgroundProps {
  percentage: number;
}

export const WaveBackground: React.FC<WaveBackgroundProps> = ({ percentage }) => {
  // Clamp percentage between 0 and 100 for visual sanity
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const heightStr = `${clamped}%`;

  return (
    <div className="absolute bottom-0 left-0 w-full z-0 transition-all duration-1000 ease-in-out overflow-hidden rounded-3xl" style={{ height: heightStr }}>
        <div className="relative w-full h-full bg-blue-400 bg-opacity-30">
             <div className="absolute top-[-20px] left-0 w-[200%] h-[60px] wave-bg opacity-50"></div>
             <div className="absolute top-[-30px] left-[-10px] w-[200%] h-[70px] wave-bg opacity-30" style={{ animationDuration: '7s' }}></div>
        </div>
    </div>
  );
};
