import React from 'react';
import { UserSettings, SimulationState } from '../types';
import { ArchiveBoxIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface TankMonitorProps {
  userSettings: UserSettings | null;
  simulationState: SimulationState;
}

export const TankMonitor: React.FC<TankMonitorProps> = ({ userSettings, simulationState }) => {
  const tankCount = userSettings?.tankCount || 1;
  const TANK_CAPACITY = 3000;
  
  const initialWaterLevel = tankCount * TANK_CAPACITY * 0.8; 
  const currentWaterLevelTotal = Math.max(0, initialWaterLevel - simulationState.totalToday);
  
  // النسبة المئوية للمياه (تستخدم لارتفاع الماء داخل الخزان)
  const percentFull = Math.max(0, Math.min(100, (currentWaterLevelTotal / (tankCount * TANK_CAPACITY)) * 100));

  // تحديد اللون بناءً على المستوى
  const isLow = percentFull < 20;
  const isMedium = percentFull < 50;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
      
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <ArchiveBoxIcon className="w-7 h-7 text-water-500" />
             مراقبة الخزانات
           </h2>
           <p className="text-slate-500 mt-1 text-sm">عرض ثلاثي الأبعاد لمستوى المياه في {tankCount} خزانات</p>
        </div>
        <div className="flex gap-4 text-center">
            <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">السعة الإجمالية</p>
                <p className="font-bold text-slate-800 text-lg">{(tankCount * TANK_CAPACITY).toLocaleString()} لتر</p>
            </div>
            <div className="bg-water-50 px-6 py-3 rounded-2xl border border-water-100">
                <p className="text-xs text-water-600 mb-1">المتبقي تقريباً</p>
                <p className="font-bold text-water-700 text-lg">{Math.round(currentWaterLevelTotal).toLocaleString()} لتر</p>
            </div>
        </div>
      </div>

      {/* 3D Tanks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center mt-12 mb-12">
        {Array.from({ length: tankCount }).map((_, index) => (
            <div key={index} className="relative w-40 sm:w-52 h-72 sm:h-96 group">
                {/* Tank Label */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg z-40 whitespace-nowrap flex items-center gap-2">
                    <span>خزان {index + 1}</span>
                    <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                </div>

                {/* --- 3D TANK STRUCTURE --- */}
                
                {/* 1. Back/Inner Wall (Depth) */}
                <div className="absolute top-5 w-full h-[calc(100%-25px)] bg-slate-100 rounded-b-[3rem] border-x border-slate-200 shadow-inner z-0"></div>

                {/* 2. Bottom Base (The floor of the tank) */}
                <div className="absolute bottom-0 w-full h-12 bg-slate-200 rounded-[50%] border-b-4 border-slate-300 shadow-xl z-0"></div>
                <div className="absolute bottom-0 w-full h-12 bg-slate-200 rounded-[50%] blur-xl opacity-40 z-[-1]"></div> {/* Ground Shadow */}

                {/* --- WATER CONTENT --- */}
                <div 
                    className="absolute bottom-6 left-1 right-1 z-10 transition-all duration-1000 ease-out flex flex-col justify-end"
                    style={{ height: `${percentFull}%` }}
                >
                    {/* Water Body (The block of liquid) */}
                    <div className={`w-full h-full opacity-80 backdrop-blur-[2px] rounded-b-[2.5rem] transition-colors duration-700 border-x border-white/10
                        ${isLow ? 'bg-gradient-to-r from-red-500/70 to-red-600/70' : isMedium ? 'bg-gradient-to-r from-yellow-400/70 to-yellow-500/70' : 'bg-gradient-to-r from-water-400/70 to-water-600/70'}
                    `}></div>

                    {/* Water Top Surface (The Meniscus - Ellipse) */}
                    <div className={`absolute -top-6 left-0 w-full h-12 rounded-[50%] shadow-inner transition-colors duration-700 border-t border-white/40
                        ${isLow ? 'bg-red-400' : isMedium ? 'bg-yellow-300' : 'bg-water-300'}
                    `}>
                        {/* Light Reflection on water surface */}
                        <div className="absolute top-2 left-[20%] w-[60%] h-5 bg-white/30 rounded-[50%] blur-[3px]"></div>
                    </div>

                    {/* Bubbles Simulation */}
                    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-b-[2.5rem] pointer-events-none">
                        <div className="absolute bottom-4 left-[20%] w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
                        <div className="absolute bottom-10 left-[60%] w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{animationDuration: '5s'}}></div>
                        <div className="absolute bottom-2 left-[40%] w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
                    </div>
                </div>

                {/* --- FRONT GLASS & DETAILS --- */}
                
                {/* Front Glass Shine/Reflection */}
                <div className="absolute top-5 w-full h-[calc(100%-25px)] rounded-b-[3rem] bg-gradient-to-r from-white/30 via-transparent to-black/5 pointer-events-none z-20 border-x border-white/50"></div>
                
                {/* Vertical Highlight (Cylindrical shine) */}
                <div className="absolute top-6 left-6 w-8 h-[calc(100%-32px)] bg-gradient-to-r from-white/30 to-transparent rounded-full blur-[4px] z-20 pointer-events-none"></div>

                {/* Top Rim/Lid */}
                <div className="absolute top-0 w-full h-12 bg-white/80 rounded-[50%] border-4 border-slate-200 shadow-sm z-30 backdrop-blur-md">
                    {/* Inner rim depth */}
                    <div className="absolute inset-0 rounded-[50%] shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]"></div>
                </div>
                
                {/* Measurement Ticks */}
                <div className="absolute -right-4 top-16 bottom-16 w-8 flex flex-col justify-between z-20 opacity-60">
                    {[100, 75, 50, 25, 0].map((tick) => (
                        <div key={tick} className="flex items-center justify-end gap-2 pr-1 group/tick">
                            <span className="text-[10px] font-mono text-slate-500 font-bold group-hover/tick:scale-110 transition-transform">{tick}%</span>
                            <div className="w-3 h-[2px] bg-slate-400"></div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      {/* Status Warning */}
      {isLow && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-pulse shadow-sm max-w-2xl mx-auto">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              <div>
                  <h3 className="font-bold text-red-700">تحذير: مستوى المياه حرج</h3>
                  <p className="text-sm text-red-600">المخزون أوشك على النفاذ، يرجى طلب صهريج مياه فوراً.</p>
              </div>
          </div>
      )}

      {/* Refill Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center max-w-2xl mx-auto">
          <p className="text-blue-800 font-medium">
              موعد التعبئة القادم المتوقع: <span className="font-bold text-xl block mt-1">{userSettings?.refillDay || 'غير محدد'}</span>
          </p>
      </div>

    </div>
  );
};