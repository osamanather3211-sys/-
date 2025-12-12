import React from 'react';
import { Plumber } from '../types';
import { playSfx } from '../utils/audio';
import { 
  PhoneIcon, 
  MapPinIcon, 
  StarIcon, 
  WrenchScrewdriverIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';

const MOCK_PLUMBERS: Plumber[] = [
  { id: '1', name: 'محمد خالد', rating: 4.8, reviews: 124, distance: '0.5 كم', phone: '0500000001', isAvailable: true, avatarColor: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'مؤسسة السباكة الحديثة', rating: 4.5, reviews: 89, distance: '1.2 كم', phone: '0500000002', isAvailable: true, avatarColor: 'bg-indigo-100 text-indigo-600' },
  { id: '3', name: 'أحمد سعيد', rating: 4.9, reviews: 210, distance: '2.5 كم', phone: '0500000003', isAvailable: false, avatarColor: 'bg-emerald-100 text-emerald-600' },
  { id: '4', name: 'عبدالله العمري', rating: 4.2, reviews: 45, distance: '3.0 كم', phone: '0500000004', isAvailable: true, avatarColor: 'bg-orange-100 text-orange-600' },
  { id: '5', name: 'فني صيانة محترف', rating: 4.6, reviews: 156, distance: '4.1 كم', phone: '0500000005', isAvailable: true, avatarColor: 'bg-purple-100 text-purple-600' },
];

export const PlumberList: React.FC = () => {
  
  const handleCall = (name: string) => {
    playSfx('click');
    // Simulate a call action
    alert(`جاري الاتصال بـ ${name}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-8">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <WrenchScrewdriverIcon className="w-7 h-7 text-water-500" />
             سباكين بالقرب منك
           </h2>
           <p className="text-slate-500 mt-1 text-sm">قائمة بأفضل الفنيين المعتمدين في منطقتك</p>
        </div>
        <div className="hidden md:block bg-water-50 text-water-600 px-4 py-2 rounded-xl text-sm font-bold">
            {MOCK_PLUMBERS.filter(p => p.isAvailable).length} متاح حالياً
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PLUMBERS.map((plumber) => (
          <div key={plumber.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 relative group">
            
            {/* Availability Badge */}
            <div className={`absolute top-5 left-5 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${plumber.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${plumber.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                {plumber.isAvailable ? 'متاح الآن' : 'مشغول'}
            </div>

            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm ${plumber.avatarColor}`}>
                    {plumber.name.charAt(0)}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1">
                        {plumber.name}
                        {plumber.rating > 4.7 && <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="موثوق" />}
                    </h3>
                    
                    <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-slate-700">{plumber.rating}</span>
                        <span className="text-xs text-slate-400">({plumber.reviews} تقييم)</span>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-slate-500 text-sm">
                        <MapPinIcon className="w-4 h-4" />
                        <span>يبعد {plumber.distance}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-slate-50 flex gap-3">
                <button 
                    onClick={() => handleCall(plumber.name)}
                    className="flex-1 bg-water-500 hover:bg-water-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-water-200"
                >
                    <PhoneIcon className="w-5 h-5" />
                    اتصال
                </button>
                <button className="px-4 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                    التفاصيل
                </button>
            </div>

          </div>
        ))}
      </div>

      {/* Safety Tip */}
      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-start gap-3 text-sm text-yellow-800">
          <div className="bg-yellow-100 p-2 rounded-full shrink-0">
             <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="mt-1">
              نصيحة: تأكد دائماً من الاتفاق على السعر قبل بدء العمل، واطلب فاتورة لضمان حقك في الصيانة.
          </p>
      </div>

    </div>
  );
};