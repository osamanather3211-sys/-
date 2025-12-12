import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MonthlyStats, Alert, AppView, SimulationState, UserSettings } from './types';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { SmartAdvisor } from './components/SmartAdvisor';
import { Settings } from './components/Settings';
import { PlumberList } from './components/PlumberList';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { LandingPage } from './components/LandingPage';
import { TankMonitor } from './components/TankMonitor';
import { playSfx } from './utils/audio';
import { 
  HomeIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  ClipboardDocumentCheckIcon,
  Bars3Icon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

// Mock Data
const MOCK_HISTORY: MonthlyStats[] = [
  { month: 'يناير', usage: 12000, projected: 11500, limit: 13000 },
  { month: 'فبراير', usage: 11500, projected: 11000, limit: 13000 },
  { month: 'مارس', usage: 13200, projected: 12500, limit: 13000 },
  { month: 'أبريل', usage: 12800, projected: 12000, limit: 13000 },
  { month: 'مايو', usage: 14500, projected: 14000, limit: 13000 },
  { month: 'يونيو', usage: 15100, projected: 14800, limit: 13000 },
  { month: 'يوليو', usage: 0, projected: 16500, limit: 13000 },
];

// Extracted NavItem
const NavItem = ({ view, label, icon: Icon, isActive, onClick }: { view: AppView, label: string, icon: any, isActive: boolean, onClick: (v: AppView) => void }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-water-500 text-white shadow-md shadow-water-200 scale-[1.02]' 
        : 'text-slate-500 hover:bg-slate-50 hover:pl-5'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="font-medium text-lg">{label}</span>
  </button>
);

// Sidebar Component
const Sidebar = ({ currentView, setCurrentView, isMobileMenuOpen, setIsMobileMenuOpen }: any) => {
    
    const handleNavClick = (view: AppView) => {
        playSfx('nav');
        setCurrentView(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <aside className={`
            fixed inset-y-0 right-0 z-20 w-64 bg-white border-l border-slate-100 shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
            <div className="p-8 hidden md:flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-water-400 to-water-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-water-200 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h1 className="font-bold text-2xl text-slate-800 tracking-tight leading-none">قطرة</h1>
                <p className="text-xs text-water-600 font-bold mt-1">كل نقطة بتفرق</p>
            </div>
            </div>

            <nav className="px-4 space-y-2 mt-4 md:mt-0">
                <NavItem view={AppView.DASHBOARD} label="الرئيسية" icon={HomeIcon} isActive={currentView === AppView.DASHBOARD} onClick={handleNavClick} />
                <NavItem view={AppView.TANKS} label="الخزانات" icon={ArchiveBoxIcon} isActive={currentView === AppView.TANKS} onClick={handleNavClick} />
                <NavItem view={AppView.ANALYTICS} label="التقارير" icon={ChartBarIcon} isActive={currentView === AppView.ANALYTICS} onClick={handleNavClick} />
                <NavItem view={AppView.PLUMBERS} label="السباكين" icon={WrenchScrewdriverIcon} isActive={currentView === AppView.PLUMBERS} onClick={handleNavClick} />
                <NavItem view={AppView.ADVISOR} label="النصائح والإرشادات" icon={ClipboardDocumentCheckIcon} isActive={currentView === AppView.ADVISOR} onClick={handleNavClick} />
                <NavItem view={AppView.SETTINGS} label="الإعدادات" icon={Cog6ToothIcon} isActive={currentView === AppView.SETTINGS} onClick={handleNavClick} />
            </nav>
            
            <div className="absolute bottom-8 right-0 w-full px-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 mb-2">حالة الجهاز</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-700">متصل بالشبكة</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

// Application Flow States
type AppState = 'SPLASH' | 'LANDING' | 'ONBOARDING' | 'APP';

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('SPLASH');
  
  // Initialize state from LocalStorage
  const [userSettings, setUserSettings] = useState<UserSettings | null>(() => {
    try {
      const saved = localStorage.getItem('qatra_settings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [dailyGoal, setDailyGoal] = useState(500); // Liters
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simulation State
  const [simState, setSimState] = useState<SimulationState>({
    currentFlowRate: 0,
    isLeaking: false,
    totalToday: 150,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const leakTimerRef = useRef<any>(null);
  const LEAK_THRESHOLD_TIME = 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      // After splash, decide where to go
      if (userSettings) {
        setAppState('APP');
      } else {
        setAppState('LANDING');
      }
    }, 4000); 
    return () => clearTimeout(timer);
  }, [userSettings]);

  // Update LocalStorage when settings change
  const handleUpdateSettings = (newSettings: UserSettings) => {
      setUserSettings(newSettings);
      localStorage.setItem('qatra_settings', JSON.stringify(newSettings));
      playSfx('success');
  };

  const handleRegistrationComplete = (settings: UserSettings) => {
      handleUpdateSettings(settings);
      setAppState('APP');
  };

  const handleLogout = () => {
      playSfx('error');
      localStorage.removeItem('qatra_settings');
      setUserSettings(null);
      setCurrentView(AppView.DASHBOARD);
      setAppState('LANDING');
  };

  // Simulation Logic - Running frequently
  useEffect(() => {
    // Only run simulation if we are in the app mode
    if (appState !== 'APP' || !userSettings) return;

    const interval = setInterval(() => {
      setSimState(prev => {
        let baseFlow = prev.isLeaking ? 2.5 : 0;
        // Only add random noise if leaking or occasionally
        const randomSpike = (prev.isLeaking || Math.random() > 0.95) ? Math.random() * (prev.isLeaking ? 15 : 2) : 0;
        const newFlow = baseFlow + randomSpike;
        const addedAmount = (newFlow / 60) * 0.5;
        
        return {
          ...prev,
          currentFlowRate: newFlow > 0.5 ? newFlow : 0, // Noise gate
          totalToday: prev.totalToday + addedAmount
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [appState, userSettings]);

  // Leak Detection & Alert Logic
  useEffect(() => {
    if (appState !== 'APP' || !userSettings) return;

    const { currentFlowRate, isLeaking, totalToday } = simState;

    // Detect Leak
    if (currentFlowRate > 0 && currentFlowRate < 10) {
      if (!leakTimerRef.current) {
        leakTimerRef.current = setTimeout(() => {
            if (isLeaking) { 
                 const isLarge = currentFlowRate > 5;
                 setAlerts(prev => {
                    if (prev.some(a => a.type === 'leak' && a.active)) return prev;
                    playSfx('alert');
                    return [{
                        id: Date.now().toString(),
                        type: 'leak',
                        message: isLarge ? 'تدفق عالي مستمر! (احتمال تسريب خزان)' : 'تدفق منخفض مستمر (احتمال تسريب مواسير)',
                        timestamp: new Date(),
                        active: true
                    }, ...prev];
                 });
            }
        }, LEAK_THRESHOLD_TIME);
      }
    } else if (currentFlowRate === 0) {
      if (leakTimerRef.current) {
        clearTimeout(leakTimerRef.current);
        leakTimerRef.current = null;
      }
      if (!isLeaking) {
         setAlerts(prev => {
             const hasActiveLeak = prev.some(a => a.type === 'leak' && a.active);
             if (hasActiveLeak) {
                 return prev.map(a => a.type === 'leak' ? {...a, active: false} : a);
             }
             return prev;
         });
      }
    }
    
    // Detect Excess
    if (totalToday > dailyGoal) {
        setAlerts(prev => {
            if (prev.some(a => a.type === 'excess')) return prev;
            playSfx('alert');
            return [{
                id: 'excess-' + Date.now(),
                type: 'excess',
                message: 'تجاوزت حد الاستهلاك اليومي المخطط له',
                timestamp: new Date(),
                active: true
            }, ...prev];
        });
    }

  }, [simState.currentFlowRate, simState.isLeaking, Math.floor(simState.totalToday), dailyGoal, appState, userSettings]);

  const toggleLeak = useCallback(() => {
    playSfx('click');
    setSimState(prev => ({ ...prev, isLeaking: !prev.isLeaking }));
  }, []);

  const toggleLargeLeak = useCallback(() => {
     playSfx('click');
     setSimState(prev => {
        const isHighFlow = prev.currentFlowRate > 10;
        if (isHighFlow) return { ...prev, isLeaking: false, currentFlowRate: 0 };
        return { ...prev, isLeaking: true, currentFlowRate: 15 }; 
     });
  }, []);

  const handleMobileMenuToggle = () => {
      playSfx('click');
      setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const renderContent = () => {
    switch(currentView) {
        case AppView.ANALYTICS:
            return <Analytics data={MOCK_HISTORY} />;
        case AppView.PLUMBERS:
            return <PlumberList />;
        case AppView.ADVISOR:
            return <SmartAdvisor simulationState={simState} history={MOCK_HISTORY} userSettings={userSettings} />;
        case AppView.TANKS:
            return <TankMonitor userSettings={userSettings} simulationState={simState} />;
        case AppView.SETTINGS:
            return userSettings ? (
                <Settings 
                  userSettings={userSettings} 
                  onUpdateSettings={handleUpdateSettings}
                  dailyGoal={dailyGoal}
                  onUpdateGoal={(g) => { setDailyGoal(g); playSfx('success'); }}
                  onLogout={handleLogout}
                />
            ) : null;
        case AppView.DASHBOARD:
        default:
            return (
                <div className="space-y-6">
                    <div className="flex gap-2 justify-end">
                    <button onClick={toggleLeak} className="text-xs text-slate-400 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm transition-colors">
                        {simState.isLeaking ? '[إيقاف المحاكاة]' : '[محاكاة تسريب صغير]'}
                    </button>
                    <button onClick={toggleLargeLeak} className="text-xs text-slate-400 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm transition-colors">
                        [محاكاة تسريب خزان]
                    </button>
                    </div>
                    <Dashboard 
                        simulationState={simState} 
                        dailyGoal={dailyGoal}
                        alerts={alerts}
                        toggleLeak={toggleLeak}
                    />
                </div>
            );
    }
  };

  if (appState === 'SPLASH') {
    return <SplashScreen />;
  }

  if (appState === 'LANDING') {
    return <LandingPage onEnterApp={() => setAppState('ONBOARDING')} />;
  }

  if (appState === 'ONBOARDING') {
    return <Onboarding onComplete={handleRegistrationComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans overflow-hidden animate-fade-in">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-30 relative">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-water-400 to-water-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="flex flex-col">
                <h1 className="font-bold text-xl text-slate-800 leading-none">قطرة</h1>
                <p className="text-xs text-water-600 font-bold mt-1">كل نقطة بتفرق</p>
            </div>
        </div>
        <button onClick={handleMobileMenuToggle}>
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 relative scroll-smooth bg-slate-50">
        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {currentView === AppView.DASHBOARD && userSettings && `مرحباً، ${userSettings.name}`}
                    {currentView === AppView.TANKS && 'مراقبة مستوى الخزانات'}
                    {currentView === AppView.ANALYTICS && 'تحليل الاستهلاك'}
                    {currentView === AppView.PLUMBERS && 'خدمات الصيانة'}
                    {currentView === AppView.ADVISOR && 'النصائح والإرشادات'}
                    {currentView === AppView.SETTINGS && 'الإعدادات'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    {userSettings && userSettings.tankCount} خزانات • يوم التعبئة: {userSettings && userSettings.refillDay}
                </p>
            </div>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                     <span className={`w-2 h-2 rounded-full ${simState.isLeaking ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></span>
                     <span className="text-sm font-medium text-slate-600">
                        {simState.isLeaking ? 'تم اكتشاف تسريب' : 'النظام يعمل بكفاءة'}
                     </span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-xl">
                     🤠
                 </div>
            </div>
        </header>

        {/* View Routing */}
        <div className="max-w-7xl mx-auto pb-12">
            {renderContent()}
        </div>
      </main>

      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <h1 className="text-xl font-bold text-red-600 mb-2">عذراً، حدث خطأ غير متوقع</h1>
            <p className="text-slate-500 mb-6">واجه التطبيق مشكلة في العرض. يرجى محاولة تحديث الصفحة.</p>
            
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              تحديث الصفحة
            </button>
            
            <div className="mt-8 pt-4 border-t border-slate-100">
               <button 
                 onClick={() => { localStorage.clear(); window.location.reload(); }}
                 className="text-xs text-slate-400 hover:text-red-500 underline"
               >
                 إعادة ضبط التطبيق (حذف البيانات)
               </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;