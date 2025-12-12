import React from 'react';
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon, 
  ArrowLeftIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-water-400 to-water-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-water-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">قطرة</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-water-600 transition-colors">المميزات</a>
            <a href="#how-it-works" className="hover:text-water-600 transition-colors">كيف يعمل</a>
            <a href="#contact" className="hover:text-water-600 transition-colors">اتصل بنا</a>
          </div>

          <button 
            onClick={onEnterApp}
            className="bg-water-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-water-700 transition-all shadow-lg shadow-water-200 hover:shadow-water-300 transform hover:-translate-y-0.5"
          >
            دخول النظام
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-water-50 text-water-700 text-xs font-bold border border-water-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-water-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-water-500"></span>
                    </span>
                    النظام الأول لإدارة المياه منزلياً
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900">
                    تحكم في <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-water-500 to-blue-600">استهلاك المياه</span> <br/>
                    بكل ذكاء
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                    تطبيق قطرة يساعدك على مراقبة استهلاكك، كشف التسريبات فور حدوثها، وتوفير المال من خلال تقارير دقيقة ومتابعة لحظية.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={onEnterApp} className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        ابدأ الآن مجاناً
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                        شاهد الفيديو
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-3 h-3 ml-0.5 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </button>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                    <div className="flex -space-x-3 space-x-reverse">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-slate-800">+10,000 مستخدم</p>
                        <p className="text-slate-500">يثقون في قطرة</p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-water-100 to-purple-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/4246/4246154.png" 
                    alt="App Preview" 
                    className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">كل ما تحتاجه لإدارة المياه</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">نظام متكامل يجمع بين السهولة والذكاء ليمنحك راحة البال الكاملة بخصوص منزلك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: ChartBarIcon,
                        title: "مراقبة لحظية",
                        desc: "تابع تدفق المياه واستهلاكك لحظة بلحظة عبر لوحة تحكم تفاعلية."
                    },
                    {
                        icon: ShieldCheckIcon,
                        title: "كشف التسريبات",
                        desc: "نظام تنبيه فوري يخبرك بوجود تسريب قبل أن يتسبب في أضرار كبيرة."
                    },
                    {
                        icon: DevicePhoneMobileIcon,
                        title: "سهولة الاستخدام",
                        desc: "واجهة بسيطة مصممة لتناسب جميع أفراد العائلة مع إشعارات ذكية."
                    }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-14 h-14 bg-water-50 rounded-2xl flex items-center justify-center text-water-600 mb-6">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-water-500 to-purple-600 rounded-3xl transform rotate-3 opacity-10"></div>
                    <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden shadow-2xl">
                         {/* Abstract UI representation */}
                         <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                         </div>
                         <div className="space-y-4">
                             <div className="h-24 bg-gradient-to-r from-water-500 to-water-400 rounded-2xl opacity-90 w-3/4"></div>
                             <div className="h-16 bg-white/10 rounded-2xl w-full"></div>
                             <div className="h-16 bg-white/10 rounded-2xl w-full"></div>
                         </div>
                         <div className="mt-8 flex gap-4">
                             <div className="flex-1 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                                <span className="text-4xl">💧</span>
                             </div>
                             <div className="flex-1 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                                <span className="text-4xl">📊</span>
                             </div>
                         </div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">ابدأ في 3 خطوات بسيطة</h2>
                    <div className="space-y-8">
                        {[
                            { step: "01", title: "سجل حسابك", desc: "قم بإنشاء حسابك وتحديد عدد الخزانات في منزلك." },
                            { step: "02", title: "اربط الجهاز", desc: "اربط جهاز الاستشعار الذكي بشبكة الواي فاي الخاصة بك." },
                            { step: "03", title: "تابع ووفر", desc: "استلم التقارير وابدأ في توفير المياه والمال فوراً." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="text-4xl font-black text-water-100 leading-none shrink-0">{item.step}</div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                    <p className="text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-water-500 to-water-700 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز للتحكم في استهلاكك؟</h2>
                  <p className="text-water-100 text-lg mb-8 max-w-2xl mx-auto">انضم للآلاف من المستخدمين الذين استطاعوا تخفيض فواتير المياه وحماية منازلهم من التسريبات.</p>
                  <button onClick={onEnterApp} className="bg-white text-water-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-lg transform hover:-translate-y-1">
                      انشئ حسابك الآن
                  </button>
              </div>
              
              {/* Decor Circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-water-900 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-white font-bold text-2xl mb-4">
                      <span>قطرة</span>
                      <span className="w-2 h-2 rounded-full bg-water-500"></span>
                  </div>
                  <p className="text-slate-400 max-w-sm leading-relaxed">
                      المنصة الرائدة لحلول المياه الذكية. نسعى لبناء مستقبل مستدام وحماية كل قطرة مياه من الهدر.
                  </p>
              </div>
              
              <div>
                  <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
                  <ul className="space-y-2">
                      <li><a href="#" className="hover:text-water-400 transition-colors">عن قطرة</a></li>
                      <li><a href="#" className="hover:text-water-400 transition-colors">المميزات</a></li>
                      <li><a href="#" className="hover:text-water-400 transition-colors">الأسعار</a></li>
                      <li><a href="#" className="hover:text-water-400 transition-colors">المدونة</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                          <EnvelopeIcon className="w-5 h-5 text-water-500" />
                          support@qatra.app
                      </li>
                      <li className="flex items-center gap-3">
                          <PhoneIcon className="w-5 h-5 text-water-500" />
                          920000000
                      </li>
                      <li className="flex items-center gap-3">
                          <GlobeAltIcon className="w-5 h-5 text-water-500" />
                          الرياض، المملكة العربية السعودية
                      </li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
              © 2024 تطبيق قطرة. جميع الحقوق محفوظة.
          </div>
      </footer>

    </div>
  );
};