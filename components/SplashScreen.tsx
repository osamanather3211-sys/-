import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Container for the animation */}
      <div className="relative w-full h-full flex flex-col items-center justify-center -mt-20">
        
        {/* The Falling Drop - 3D Effect - Centered and Larger */}
        <div className="absolute top-[35%] animate-drop-fall z-10">
           <svg width="80" height="120" viewBox="0 0 100 150">
             <defs>
               <radialGradient id="dropGrad" cx="30%" cy="30%" r="70%">
                 <stop offset="0%" stopColor="#e0f2fe" />
                 <stop offset="50%" stopColor="#38bdf8" />
                 <stop offset="100%" stopColor="#0284c7" />
               </radialGradient>
               <filter id="glow">
                   <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                   <feMerge>
                       <feMergeNode in="coloredBlur"/>
                       <feMergeNode in="SourceGraphic"/>
                   </feMerge>
               </filter>
             </defs>
             <path 
                d="M50 0 C50 0 10 60 10 90 A40 40 0 1 0 90 90 C90 60 50 0 50 0 Z" 
                fill="url(#dropGrad)" 
                filter="url(#glow)"
             />
             {/* Shine reflection */}
             <ellipse cx="35" cy="70" rx="10" ry="15" fill="white" fillOpacity="0.6" transform="rotate(-20 35 70)" />
           </svg>
        </div>

        {/* Impact Area */}
        <div className="absolute top-[500px] flex items-center justify-center">
           {/* Realistic Ripple */}
           <div className="w-32 h-8 border-4 border-water-400 rounded-[100%] absolute animate-splash-expand opacity-0 box-border"></div>
           <div className="w-20 h-5 bg-water-200 rounded-[100%] absolute animate-splash-expand opacity-0" style={{animationDelay: '2.0s', animationDuration: '0.4s'}}></div>
           
           {/* Text Reveal */}
           <div className="mt-16 text-center animate-text-reveal opacity-0 w-80">
              <h1 className="text-6xl font-black text-slate-800 mb-2 drop-shadow-sm tracking-tighter">قطرة</h1>
              <p className="text-xl font-bold text-water-600 tracking-wide bg-white/50 py-1 px-4 rounded-full inline-block backdrop-blur-sm">... كل نقطة بتفرق</p>
           </div>
        </div>

      </div>
    </div>
  );
};