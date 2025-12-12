import React, { useState } from 'react';
import { UserSettings } from '../types';
import { playSfx } from '../utils/audio';
import { 
  UserIcon, 
  BeakerIcon, 
  BellIcon, 
  MoonIcon, 
  PencilSquareIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SettingsProps {
  userSettings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  dailyGoal: number;
  onUpdateGoal: (goal: number) => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userSettings, onUpdateSettings, dailyGoal, onUpdateGoal, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userSettings);
  const [goal, setGoal] = useState(dailyGoal);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    onUpdateSettings(formData);
    onUpdateGoal(goal);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
      playSfx('click');
      setIsEditing(!isEditing);
  }

  const handleNotifToggle = () => {
      playSfx('click');
      setNotificationsEnabled(!notificationsEnabled);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-water-500 to-water-600"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-4 mt-8 px-4">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg -mt-12 md:mt-0">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl overflow-hidden border-4 border-white">
                    🤠
                </div>
            </div>
            <div className="flex-1 text-center md:text-right mb-2">
                <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
                <p className="text-slate-500 text-sm">عضو في قطرة منذ 2024</p>
            </div>
            <button 
                onClick={handleEditToggle}
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
                {isEditing ? (
                    <>
                     <span className="text-red-500">إلغاء</span>
                    </>
                ) : (
                    <>
                        <PencilSquareIcon className="w-5 h-5" />
                        <span>تعديل البيانات</span>
                    </>
                )}
            </button>
        </div>

        {isEditing && (
             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">الاسم</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-water-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">عدد الخزانات</label>
                    <input 
                        type="number" 
                        value={formData.tankCount}
                        onChange={(e) => setFormData({...formData, tankCount: parseInt(e.target.value) || 0})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-water-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">يوم التعبئة</label>
                    <select 
                        value={formData.refillDay}
                        onChange={(e) => setFormData({...formData, refillDay: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-water-500 outline-none bg-white"
                    >
                        {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2 flex justify-end mt-2">
                    <button 
                        onClick={handleSave}
                        className="bg-water-500 text-white px-6 py-2 rounded-xl font-bold shadow-md shadow-water-200 hover:bg-water-600 flex items-center gap-2"
                    >
                        <CheckIcon className="w-5 h-5" />
                        حفظ التغييرات
                    </button>
                </div>
             </div>
        )}
      </div>

      {/* Goal Settings */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <AdjustmentsHorizontalIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">أهداف الاستهلاك</h3>
          </div>
          
          <div className="space-y-4">
              <div>
                  <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-700">الحد اليومي المستهدف</label>
                      <span className="text-sm font-bold text-water-600">{goal} لتر</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="2000" 
                    step="50"
                    value={goal}
                    onChange={(e) => setGoal(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-water-500"
                  />
                  <p className="text-xs text-slate-400 mt-2">سنرسل لك تنبيهاً عند تجاوز هذا الرقم.</p>
              </div>
          </div>
          {goal !== dailyGoal && !isEditing && (
              <button onClick={() => { onUpdateGoal(goal); }} className="mt-4 text-sm text-water-600 font-bold hover:underline">
                  حفظ الهدف الجديد
              </button>
          )}
      </div>

      {/* App Preferences */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <BellIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">التنبيهات والنظام</h3>
          </div>

          <div className="space-y-4 divide-y divide-slate-50">
              <div className="flex items-center justify-between py-2">
                  <div>
                      <p className="font-medium text-slate-800">تنبيهات التسريب</p>
                      <p className="text-xs text-slate-400">الحصول على إشعار فوري عند اكتشاف تدفق غير طبيعي</p>
                  </div>
                  <button 
                    onClick={handleNotifToggle}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
                  >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? 'left-1' : 'left-7'}`}></span>
                  </button>
              </div>

              <div className="flex items-center justify-between py-4">
                  <div>
                      <p className="font-medium text-slate-800">الوضع الليلي</p>
                      <p className="text-xs text-slate-400">تغيير مظهر التطبيق للألوان الداكنة</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-slate-200 transition-colors relative cursor-not-allowed opacity-60">
                      <span className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full"></span>
                  </button>
              </div>
          </div>
      </div>

      <div className="text-center pt-8 pb-4">
          <p className="text-xs text-slate-300 mb-4">رقم الإصدار 1.0.2</p>
          <button 
            onClick={onLogout}
            className="text-red-500 bg-red-50 border border-red-100 px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 mx-auto"
          >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              تسجيل الخروج
          </button>
      </div>

    </div>
  );
};