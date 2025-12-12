import React from 'react';
import { SimulationState, Alert } from '../types';
import { WaterWave } from './WaterWave';
import { playSfx } from '../utils/audio';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ArrowTrendingUpIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  simulationState: SimulationState;
  dailyGoal: number;
  alerts: Alert[];
  toggleLeak: () => void;
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({ 
  simulationState, 
  dailyGoal, 
  alerts,
  toggleLeak
}) => {
  const percentage = (simulationState.totalToday / dailyGoal) * 100;
  const activeLeak = alerts.find(a => a.type === 'leak' && a.active);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Flow Rate Card - Device Look */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden transition-transform hover:scale-[1.02] duration-300 text-white">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
                    <CpuChipIcon className="w-4 h-4" />
                    جهاز قياس التدفق
                </h3>
                <span className={`w-2 h-2 rounded-full ${simulationState.currentFlowRate > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
            </div>
            
            <div className="flex items-baseline gap-2 font-mono">
              <span className={`text-5xl font-bold tracking-tighter ${simulationState.currentFlowRate > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                {simulationState.currentFlowRate.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">L/min</span>
            </div>
            <div className="mt-4 text-xs text-slate-500 font-mono border-t border-slate-700 pt-2">
                 Device ID: QT-8842-X
            </div>
          </div>
          {/* Background decoration to look like water/data */}
          <div className="absolute -right-6 -bottom-6 text-slate-800 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Total Today Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02] duration-300">
           <h3 className="text-slate-500 text-sm font-medium mb-1">الاستهلاك اليومي</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800">
                {simulationState.totalToday.toFixed(0)}
              </span>
              <span className="text-sm text-slate-400">لتر</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${percentage > 100 ? 'bg-red-500' : 'bg-water-500'}`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>0 لتر</span>
              <span>الهدف: {dailyGoal} لتر</span>
            </div>
        </div>

        {/* Status Card */}
        <div className={`p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:scale-[1.02] ${activeLeak ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
           <h3 className={`text-sm font-medium mb-1 ${activeLeak ? 'text-red-600' : 'text-green-600'}`}>حالة النظام</h3>
           <div className="flex items-center gap-3 mt-2">
              {activeLeak ? (
                <ExclamationTriangleIcon className="w-10 h-10 text-red-500 animate-bounce" />
              ) : (
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              )}
              <div>
                <p className={`font-bold text-lg ${activeLeak ? 'text-red-700' : 'text-green-700'}`}>
                  {activeLeak ? 'تحذير: تسريب!' : 'النظام مستقر'}
                </p>
                <p className={`text-sm ${activeLeak ? 'text-red-600' : 'text-green-600'}`}>
                  {activeLeak ? 'تم اكتشاف تدفق غير طبيعي مستمر.' : 'لا توجد تسريبات مكتشفة.'}
                </p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Gauge */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center lg:col-span-1">
          <WaterWave percentage={percentage} />
          <p className="mt-6 text-center text-slate-600">
            لقد استهلكت <span className="font-bold text-slate-900">{Math.round(percentage)}%</span> من خطتك اليومية.
          </p>
        </div>

        {/* Recent Alerts & Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800 text-lg">التنبيهات والتحكم</h3>
             <button 
                onClick={toggleLeak}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    simulationState.isLeaking 
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
             >
                {simulationState.isLeaking ? 'إيقاف محاكاة التسريب' : 'محاكاة تسريب مياه'}
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-60 custom-scrollbar">
            {alerts.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                    لا توجد تنبيهات جديدة
                </div>
            ) : (
                alerts.map(alert => (
                    <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl border animate-fade-in ${
                        alert.type === 'leak' ? 'bg-red-50 border-red-100' : 
                        alert.type === 'excess' ? 'bg-yellow-50 border-yellow-100' : 
                        'bg-blue-50 border-blue-100'
                    }`}>
                        <div className={`p-2 rounded-full ${
                            alert.type === 'leak' ? 'bg-red-100 text-red-600' : 
                            alert.type === 'excess' ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-blue-100 text-blue-600'
                        }`}>
                            {alert.type === 'leak' ? <ExclamationTriangleIcon className="w-5 h-5"/> : 
                             alert.type === 'excess' ? <ArrowTrendingUpIcon className="w-5 h-5"/> : 
                             <CheckCircleIcon className="w-5 h-5"/>}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-800 text-sm">{alert.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {alert.timestamp.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});