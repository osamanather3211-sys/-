import React from 'react';
import { MonthlyStats } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsProps {
  data: MonthlyStats[];
}

// Mock data for pie chart
const USAGE_BREAKDOWN = [
  { name: 'المطبخ', value: 30, color: '#38bdf8' }, // Sky 400
  { name: 'دورات المياه', value: 45, color: '#0ea5e9' }, // Sky 500
  { name: 'الغسيل', value: 15, color: '#0284c7' }, // Sky 600
  { name: 'أخرى', value: 10, color: '#bae6fd' }, // Sky 200
];

export const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  // Calculate trend
  const lastMonth = data[data.length - 2];
  const thisMonth = data[data.length - 1]; // Assuming current or projected
  const difference = thisMonth.projected - lastMonth.usage;
  const isIncrease = difference > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-lg font-bold mb-1 text-slate-200">ملخص الشهر الحالي</h2>
                <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-4xl font-bold">{thisMonth.usage}</span>
                    <span className="text-slate-400">لتر مستهلك</span>
                </div>
                <div className="mt-4 flex gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isIncrease ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {Math.abs(difference)} لتر {isIncrease ? 'زيادة' : 'توفير'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-300">
                        مقارنة بالشهر الماضي
                    </span>
                </div>
            </div>
            {/* Decor */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-water-500/10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl translate-x-10 translate-y-10"></div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                 <h3 className="font-bold text-slate-800 mb-2">توزيع الاستهلاك التقريبي</h3>
                 <div className="space-y-2">
                     {USAGE_BREAKDOWN.map((item) => (
                         <div key={item.name} className="flex items-center gap-2">
                             <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                             <span className="text-xs text-slate-500">{item.name}</span>
                             <span className="text-xs font-bold text-slate-700">{item.value}%</span>
                         </div>
                     ))}
                 </div>
             </div>
             <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={USAGE_BREAKDOWN}
                            innerRadius={25}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {USAGE_BREAKDOWN.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800">مقارنة الأشهر</h3>
             <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">الفعلي vs الهدف</span>
          </div>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Tajawal'}}
                />
                <Bar name="الاستهلاك" dataKey="usage" fill="#0ea5e9" radius={[6, 6, 6, 6]} barSize={12} />
                <Bar name="الهدف" dataKey="limit" fill="#e2e8f0" radius={[6, 6, 6, 6]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

         {/* Projected Area Chart */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">توقعات الاستهلاك</h3>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Tajawal'}}
                />
                <Area 
                    type="monotone" 
                    name="المتوقع" 
                    dataKey="projected" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorProjected)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
