import React, { useState, useEffect } from 'react';
import { analyzeWaterUsage, getEfficiencyTips } from '../services/geminiService';
import { SimulationState, MonthlyStats, UserSettings } from '../types';
import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/solid';

interface SmartAdvisorProps {
  simulationState: SimulationState;
  history: MonthlyStats[];
  userSettings?: UserSettings | null;
}

export const SmartAdvisor: React.FC<SmartAdvisorProps> = React.memo(({ simulationState, history, userSettings }) => {
  const [advice, setAdvice] = useState<string>('');
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce the analysis to avoid calling on every tick if not needed
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      // Only set loading if we don't have advice yet, to prevent UI flicker
      if (!advice) setLoading(true);
      
      try {
        const [analysisResult, tipsResult] = await Promise.all([
            analyzeWaterUsage(simulationState, history, userSettings || undefined),
            getEfficiencyTips()
        ]);
        
        if (mounted) {
            setAdvice(analysisResult);
            setTips(tipsResult);
            setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    };

    // Use a small timeout to debounce usage updates
    const timeoutId = setTimeout(fetchData, 1000);

    return () => { 
        mounted = false; 
        clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationState.isLeaking, userSettings]); // Reduced dependencies to prevent spamming

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <SparklesIcon className="w-8 h-8 text-amber-400" />
            المستشار الذكي
        </h2>
        <p className="text-slate-500 mt-2">نستخدم الذكاء الاصطناعي لتحليل استهلاكك وتقديم أفضل النصائح.</p>
      </div>

      {/* Main Insight Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-1 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
        <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-8 h-full text-white">
            <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-full shrink-0">
                    <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">تحليل الاستهلاك الحالي</h3>
                    {loading && !advice ? (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-white/30 rounded w-3/4"></div>
                            <div className="h-4 bg-white/30 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <p className="text-lg leading-relaxed font-light opacity-95">
                            "{advice || 'جاري الاتصال بالمستشار...'}"
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {tips.length === 0 ? (
            [1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse h-32"></div>
            ))
        ) : (
            tips.map((tip, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default">
                    <div className="w-10 h-10 bg-water-50 text-water-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-water-500 group-hover:text-white transition-colors duration-300">
                        <LightBulbIcon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-700 font-medium leading-snug">{tip}</p>
                </div>
            ))
        )}
      </div>
    </div>
  );
});
