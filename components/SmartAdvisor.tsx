import React, { useState, useEffect } from 'react';
import { SimulationState, MonthlyStats, UserSettings } from '../types';
import { ClipboardDocumentCheckIcon, LightBulbIcon, WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface SmartAdvisorProps {
  simulationState: SimulationState;
  history: MonthlyStats[];
  userSettings?: UserSettings | null;
}

// نصائح توفير عامة (للوضع الطبيعي)
const GENERAL_TIPS = [
    "تأكد من إغلاق الصنبور أثناء غسل الأسنان، هذا يوفر الكثير من المياه.",
    "استخدم الدلو لغسيل السيارة بدلاً من الخرطوم لتقليل الهدر.",
    "ركب أدوات ترشيد الاستهلاك (Aerators) على الصنابير.",
    "ري النباتات في الصباح الباكر أو المساء يقلل من تبخر المياه.",
    "شغل غسالة الملابس فقط عندما تكون ممتلئة بالكامل.",
    "استخدام غسالة الصحون وهي ممتلئة يوفر مياه أكثر من الغسيل اليدوي."
];

// نصائح خاصة للتسريب البسيط (أقل من 10 لتر/دقيقة)
const MINOR_LEAK_TIPS = [
    "السبب رقم 1 للتسريبات البسيطة هو 'سيفون' الحمام، تأكد من عدم تهريبه.",
    "افحص التوصيلات أسفل المغاسل، قد يكون هناك تنقيط بطيء.",
    "راقب صنبور المطبخ أو الحديقة، وتأكد من إغلاقهم بإحكام.",
    "ابحث عن أي بقع رطوبة أو تقشر في الدهان أسفل الجدران."
];

// نصائح خاصة للتسريب الكبير (أكثر من 10 لتر/دقيقة) - حالات طارئة
const MAJOR_LEAK_TIPS = [
    "تحذير: التدفق عالي جداً! اصعد للسطح وتأكد من عدم فيضان الخزان العلوي.",
    "افحص 'عوامة' الخزان الأرضي والعلوي، غالباً هي السبب في هذا الهدر الكبير.",
    "أغلق المحبس الرئيسي للمنزل فوراً لإيقاف الهدر حتى إصلاح الخلل.",
    "تأكد من عدم وجود كسر في الماسورة الرئيسية المغذية للمنزل."
];

export const SmartAdvisor: React.FC<SmartAdvisorProps> = React.memo(({ simulationState, userSettings }) => {
  const [advice, setAdvice] = useState<string>('');
  const [displayTips, setDisplayTips] = useState<string[]>([]);
  const [statusColor, setStatusColor] = useState<'green' | 'orange' | 'red'>('green');

  // تحديد نوع الحالة (طبيعي - تسريب بسيط - تسريب خطير)
  const isMajorLeak = simulationState.isLeaking && simulationState.currentFlowRate > 10;
  const isMinorLeak = simulationState.isLeaking && simulationState.currentFlowRate <= 10;

  useEffect(() => {
    let currentAdvice = "";
    
    if (isMajorLeak) {
        currentAdvice = "حالة طارئة: يوجد استهلاك مياه غزير جداً ومستمر! يرجى التدخل فوراً.";
        setStatusColor('red');
        setDisplayTips(MAJOR_LEAK_TIPS);
    } else if (isMinorLeak) {
        currentAdvice = "تنبيه: يوجد استهلاك مستمر غير مبرر (تسريب خفي). غالباً المشكلة في السيفون أو الصنابير.";
        setStatusColor('orange');
        setDisplayTips(MINOR_LEAK_TIPS);
    } else {
        if (userSettings) {
             currentAdvice = `أهلاً ${userSettings.name}، استهلاكك طبيعي ومستقر. استمر في اتباع إرشادات التوفير.`;
        } else {
             currentAdvice = "استهلاكك طبيعي ومستقر. استمر في اتباع إرشادات التوفير.";
        }
        setStatusColor('green');
        const shuffled = [...GENERAL_TIPS].sort(() => 0.5 - Math.random());
        setDisplayTips(shuffled.slice(0, 3));
    }

    setAdvice(currentAdvice);
  }, [simulationState.isLeaking, isMajorLeak, isMinorLeak, userSettings]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-water-600" />
            النصائح والإرشادات
        </h2>
        <p className="text-slate-500 mt-2">
            {isMajorLeak || isMinorLeak ? 'تحليل المشكلة والحلول المقترحة' : 'تحليل حالة استهلاك المياه ونصائح دورية'}
        </p>
      </div>

      {/* Main Insight Card */}
      <div className={`rounded-3xl p-1 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] ${
          statusColor === 'red' ? 'bg-gradient-to-br from-red-600 to-orange-700 animate-pulse' :
          statusColor === 'orange' ? 'bg-gradient-to-br from-orange-400 to-yellow-500' :
          'bg-gradient-to-br from-indigo-600 to-purple-700'
      }`}>
        <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-8 h-full text-white">
            <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-full shrink-0">
                    {statusColor !== 'green' ? (
                        <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    ) : (
                        <ClipboardDocumentCheckIcon className="w-8 h-8 text-white" />
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">
                        {statusColor === 'red' ? 'خطر: تسريب كبير' : 
                         statusColor === 'orange' ? 'تنبيه: تسريب محتمل' : 
                         'حالة النظام ممتازة'}
                    </h3>
                    <p className="text-lg leading-relaxed font-medium opacity-95">
                        "{advice}"
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2 mt-8 px-2">
          {statusColor !== 'green' ? (
              <>
                <WrenchScrewdriverIcon className={`w-6 h-6 ${statusColor === 'red' ? 'text-red-600' : 'text-orange-500'}`} />
                <h3 className="text-xl font-bold text-slate-800">
                    {statusColor === 'red' ? 'إجراءات عاجلة لإيقاف الهدر' : 'أماكن يجب فحصها'}
                </h3>
              </>
          ) : (
              <>
                <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-slate-800">نصائح لزيادة التوفير</h3>
              </>
          )}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {displayTips.map((tip, index) => (
            <div key={index} className={`p-6 rounded-2xl border transition-all duration-300 group cursor-default flex items-start gap-4 ${
                statusColor === 'red' 
                ? 'bg-red-50 border-red-100 hover:shadow-lg hover:bg-red-100' 
                : statusColor === 'orange'
                ? 'bg-orange-50 border-orange-100 hover:shadow-lg hover:bg-orange-100'
                : 'bg-white border-slate-100 hover:shadow-lg hover:-translate-y-1'
            }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    statusColor === 'red'
                    ? 'bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white'
                    : statusColor === 'orange'
                    ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                    : 'bg-water-50 text-water-600 group-hover:bg-water-500 group-hover:text-white'
                }`}>
                    {statusColor !== 'green' ? <WrenchScrewdriverIcon className="w-5 h-5" /> : <LightBulbIcon className="w-6 h-6" />}
                </div>
                <p className={`font-medium leading-relaxed mt-1 ${
                    statusColor === 'red' ? 'text-red-800' : 
                    statusColor === 'orange' ? 'text-orange-800' : 
                    'text-slate-700'
                }`}>
                    {tip}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
});