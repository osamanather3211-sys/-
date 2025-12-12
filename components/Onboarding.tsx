import React, { useState } from 'react';
import { UserSettings } from '../types';
import { playSfx } from '../utils/audio';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

const WEEKDAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [tankInput, setTankInput] = useState('1'); // Local state for input string
  const [data, setData] = useState<UserSettings>({
    name: '',
    tankCount: 1,
    refillDay: '',
    refillStopInfo: ''
  });

  const handleChange = (field: keyof UserSettings, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleTankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valStr = e.target.value;
      setTankInput(valStr);
      
      const valNum = parseInt(valStr);
      if (!isNaN(valNum) && valNum > 0) {
          handleChange('tankCount', valNum);
      } else {
          handleChange('tankCount', 0); 
      }
  };

  const handleDaySelect = (day: string) => {
      playSfx('click');
      handleChange('refillDay', day);
  };

  const handleNext = () => {
    playSfx('click');
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 animate-fade-in">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-water-500' : 'w-2 bg-slate-200'}`} />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-water-100 rounded-full mx-auto flex items-center justify-center text-4xl shadow-sm">
              👋
            </div>
            <h2 className="text-2xl font-bold text-slate-800">أهلاً بك في قطرة</h2>
            <p className="text-slate-500">للبدء، نود التعرف عليك لتقديم أفضل مساعدة.</p>
            <div className="text-right">
                <label className="block text-sm font-medium text-slate-700 mb-2">ما هو اسمك؟</label>
                <input 
                    type="text" 
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 focus:border-water-500 focus:ring-2 focus:ring-water-200 outline-none transition-all text-right placeholder-slate-300"
                    placeholder="الاسم الكريم..."
                />
            </div>
          </div>
        )}

        {/* Step 2: Tanks */}
        {step === 2 && (
          <div className="space-y-6 text-center">
             <div className="w-20 h-20 bg-water-100 rounded-full mx-auto flex items-center justify-center text-3xl text-water-600 shadow-sm">
               🚰
            </div>
            <h2 className="text-2xl font-bold text-slate-800">بيانات الخزانات</h2>
            <p className="text-slate-500">يساعدنا هذا في تحليل نمط الاستهلاك بدقة.</p>
            
            <div className="text-right space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">عدد خزانات المياه لديك</label>
                    <div className="relative group">
                        <input 
                            type="number"
                            min="1"
                            max="50"
                            value={tankInput}
                            onChange={handleTankChange}
                            className="w-full p-4 rounded-xl border border-slate-200 focus:border-water-500 focus:ring-2 focus:ring-water-200 outline-none transition-all text-center text-lg font-bold"
                            placeholder="أدخل العدد يدوياً"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">خزان</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">يمكنك كتابة الرقم مباشرة</p>
                 </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="space-y-6 text-center">
             <div className="w-20 h-20 bg-water-100 rounded-full mx-auto flex items-center justify-center text-3xl shadow-sm">
               📅
            </div>
            <h2 className="text-2xl font-bold text-slate-800">جدول المياه</h2>
            <p className="text-slate-500">متى تصل المياه للحي ومتى تنقطع؟</p>
            
            <div className="text-right space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">يوم التعبئة (ضخ المياه)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {WEEKDAYS.map((day) => (
                            <button
                                key={day}
                                onClick={() => handleDaySelect(day)}
                                className={`relative py-3 px-2 rounded-xl text-sm font-bold transition-all border ${
                                    data.refillDay === day 
                                    ? 'bg-water-500 text-white shadow-lg shadow-water-200 scale-[1.03] border-water-600 z-10' 
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                                }`}
                            >
                                {day}
                                {data.refillDay === day && (
                                    <div className="absolute -top-2 -left-2 bg-white rounded-full">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 shadow-sm rounded-full" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">متى تتوقف عادة؟</label>
                    <input 
                        type="text" 
                        value={data.refillStopInfo}
                        onChange={(e) => handleChange('refillStopInfo', e.target.value)}
                        className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-water-500 focus:ring-2 focus:ring-water-200 transition-all placeholder-slate-300"
                        placeholder="مثال: مساء نفس اليوم"
                    />
                </div>
            </div>
          </div>
        )}

        <button 
            onClick={handleNext}
            disabled={
                (step === 1 && !data.name) || 
                (step === 2 && data.tankCount < 1) || 
                (step === 3 && (!data.refillDay || !data.refillStopInfo))
            }
            className="w-full mt-8 bg-water-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-water-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-water-200 active:scale-[0.98]"
        >
            {step === 3 ? 'ابدأ الاستخدام' : 'التالي'}
        </button>

      </div>
    </div>
  );
};