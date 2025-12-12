import React, { useState, useEffect } from 'react';
import { SimulationState, UserSettings } from '../types';
import { ClipboardDocumentCheckIcon, LightBulbIcon } from '@heroicons/react/24/solid';

interface SmartAdvisorProps {
  simulationState: SimulationState;
  userSettings?: UserSettings | null;
}

// قائمة نصائح ثابتة
const STATIC_TIPS = [
  "تأكد من إغلاق الصنبور أثناء غسل الأسنان، هذا يوفر الكثير من المياه.",
  "استخدم الدلو لغسيل السيارة بدلاً من الخرطوم لتقليل الهدر.",
  "تأكد من سلامة عوامة الخزان الأرضي والعلوي بشكل دوري.",
  "ركب أدوات ترشيد الاستهلاك (Aerators) على الصنابير.",
  "افحص السيفون في دورات المياه، فهو مسبب رئيسي للتسريبات الخفية.",
  "ري النباتات في الصباح الباكر أو المساء يقلل من تبخر المياه.",
  "شغل غسالة الملابس فقط عندما تكون ممتلئة بالكامل."
];

export const SmartAdvisor: React.FC<SmartAdvisorProps> = React.memo(
  ({ simulationState, userSettings }) => {
    const [advice, setAdvice] = useState<string>('');
    const [displayTips, setDisplayTips] = useState<string[]>([]);

    useEffect(() => {
      let currentAdvice = "";

      if (simulationState.isLeaking) {
        if (simulationState.currentFlowRate > 10) {
          currentAdvice =
            "يوجد تسريب كبير جداً! يرجى التأكد من الخزان الرئيسي والعوامات فوراً.";
        } else {
          currentAdvice =
            "يوجد تسريب بسيط ومستمر. تأكد من إحكام إغلاق الصنابير وافحص السيفون.";
        }
      } else {
        currentAdvice = userSettings
          ? `أهلاً ${userSettings.name}، وضعك المائي ممتاز! لا توجد تسريبات حالياً.`
          : "وضعك المائي ممتاز! لا توجد تسريبات حالياً.";
      }

      setAdvice(currentAdvice);

      const shuffled = [...STATIC_TIPS].sort(() => 0.5 - Math.random());
      setDisplayTips(shuffled.slice(0, 3));
    }, [simulationState.isLeaking, simulationState.currentFlowRate, userSettings]);

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-water-600" />
            النصائح والإرشادات
          </h2>
          <p className="text-slate-500 mt-2">
            تحليل حالة استهلاك المياه ونصائح دورية للتوفير.
          </p>
        </div>

        <div
          className={`rounded-3xl p-1 shadow-xl transition-all duration-500 ${
            simulationState.isLeaking
              ? 'bg-gradient-to-br from-red-500 to-orange-600'
              : 'bg-gradient-to-br from-indigo-600 to-purple-700'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <ClipboardDocumentCheckIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {simulationState.isLeaking ? 'تنبيه عاجل' : 'حالة النظام'}
                </h3>
                <p className="text-lg font-medium opacity-95">
                  {advice}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayTips.map((tip, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border hover:shadow-lg transition"
            >
              <div className="w-10 h-10 bg-water-50 text-water-600 rounded-xl flex items-center justify-center mb-4">
                <LightBulbIcon className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
