import React from 'react';

interface WaterWaveProps {
  percentage: number;
}

export const WaterWave: React.FC<WaterWaveProps> = ({ percentage }) => {
  // Clamp percentage between 0 and 100
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  
  return (
    <div className="relative w-48 h-48 rounded-full border-4 border-water-200 bg-white overflow-hidden shadow-inner mx-auto">
      <div 
        className="absolute bottom-0 left-0 w-[200%] h-[200%] bg-water-400 opacity-40 rounded-[40%] animate-wave origin-center -translate-x-1/2"
        style={{ bottom: `${safePercentage - 100}%` }} 
      />
      <div 
        className="absolute bottom-0 left-0 w-[200%] h-[200%] bg-water-500 opacity-60 rounded-[35%] animate-wave origin-center -translate-x-1/2"
        style={{ bottom: `${safePercentage - 105}%`, animationDuration: '4s' }} 
      />
      <div 
        className="absolute bottom-0 left-0 w-[200%] h-[200%] bg-water-600 opacity-30 rounded-[30%] animate-wave origin-center -translate-x-1/2"
        style={{ bottom: `${safePercentage - 102}%`, animationDuration: '6s' }} 
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span className="text-4xl font-bold text-slate-700">{Math.round(safePercentage)}%</span>
        <span className="text-xs text-slate-500 font-medium mt-1">من الهدف اليومي</span>
      </div>
    </div>
  );
};