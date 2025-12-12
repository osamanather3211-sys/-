import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MonthlyStats, Alert, AppView, SimulationState, UserSettings } from './types';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { SmartAdvisor } from './components/SmartAdvisor';
import { Settings } from './components/Settings';
import { PlumberList } from './components/PlumberList';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';

import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClipboardDocumentCheckIcon,
  Bars3Icon,
  XMarkIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

/* ---------------- MOCK DATA ---------------- */

const MOCK_HISTORY: MonthlyStats[] = [
  { month: 'يناير', usage: 12000, projected: 11500, limit: 13000 },
  { month: 'فبراير', usage: 11500, projected: 11000, limit: 13000 },
  { month: 'مارس', usage: 13200, projected: 12500, limit: 13000 },
  { month: 'أبريل', usage: 12800, projected: 12000, limit: 13000 },
  { month: 'مايو', usage: 14500, projected: 14000, limit: 13000 },
  { month: 'يونيو', usage: 15100, projected: 14800, limit: 13000 },
];

/* ---------------- NAV ITEM ---------------- */

const NavItem = ({
  view,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  view: AppView;
  label: string;
  icon: any;
  isActive: boolean;
  onClick: (v: AppView) => void;
}) => (
  <button
    onClick={() => onClick(view)}
    className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all ${
      isActive
        ? 'bg-water-500 text-white'
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span>{label}</span>
  </button>
);

/* ---------------- SIDEBAR ---------------- */

const Sidebar = ({
  currentView,
  setCurrentView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: any) => (
  <aside
    className={`fixed md:static top-0 right-0 h-full w-64 bg-white border-l z-30 transition-transform
    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
  >
    <nav className="p-4 space-y-2">
      <NavItem view={AppView.DASHBOARD} label="الرئيسية" icon={HomeIcon} isActive={currentView === AppView.DASHBOARD} onClick={setCurrentView} />
      <NavItem view={AppView.ANALYTICS} label="التقارير" icon={ChartBarIcon} isActive={currentView === AppView.ANALYTICS} onClick={setCurrentView} />
      <NavItem view={AppView.PLUMBERS} label="السباكين" icon={WrenchScrewdriverIcon} isActive={currentView === AppView.PLUMBERS} onClick={setCurrentView} />
      <NavItem view={AppView.ADVISOR} label="النصائح" icon={ClipboardDocumentCheckIcon} isActive={currentView === AppView.ADVISOR} onClick={setCurrentView} />
      <NavItem view={AppView.SETTINGS} label="الإعدادات" icon={Cog6ToothIcon} isActive={currentView === AppView.SETTINGS} onClick={setCurrentView} />
    </nav>
  </aside>
);

/* ---------------- APP ---------------- */

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(500);

  const [simState, setSimState] = useState<SimulationState>({
    currentFlowRate: 0,
    isLeaking: false,
    totalToday: 120,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const leakTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  /* ---- SIMULATION ---- */
  useEffect(() => {
    const i = setInterval(() => {
      setSimState((p) => {
        const flow = p.isLeaking ? Math.random() * 6 + 1 : 0;
        return {
          ...p,
          currentFlowRate: flow,
          totalToday: p.totalToday + flow * 0.02,
        };
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

  /* ---- LEAK DETECTION ---- */
  useEffect(() => {
    if (simState.currentFlowRate > 0 && !leakTimerRef.current) {
      leakTimerRef.current = window.setTimeout(() => {
        setAlerts((a) => [
          {
            id: Date.now().toString(),
            type: 'leak',
            message: 'تم اكتشاف تسريب مياه',
            timestamp: new Date(),
            active: true,
          },
          ...a,
        ]);
      }, 5000);
    }

    if (simState.currentFlowRate === 0 && leakTimerRef.current) {
      clearTimeout(leakTimerRef.current);
      leakTimerRef.current = null;
    }
  }, [simState.currentFlowRate]);

  /* ---- RENDER CONTENT ---- */
  const renderContent = () => {
    switch (currentView) {
      case AppView.ANALYTICS:
        return <Analytics data={MOCK_HISTORY} />;

      case AppView.PLUMBERS:
        return <PlumberList />;

      case AppView.ADVISOR:
        return <SmartAdvisor simulationState={simState} userSettings={userSettings} />;

      case AppView.SETTINGS:
        return (
          <Settings
            userSettings={userSettings!}
            onUpdateSettings={setUserSettings}
            dailyGoal={dailyGoal}
            onUpdateGoal={setDailyGoal}
          />
        );

      default:
        return (
          <Dashboard
            simulationState={simState}
            dailyGoal={dailyGoal}
            alerts={alerts}
            toggleLeak={() => setSimState((s) => ({ ...s, isLeaking: !s.isLeaking }))}
          />
        );
    }
  };

  if (showSplash) return <SplashScreen />;
  if (!userSettings) return <Onboarding onComplete={setUserSettings} />;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white p-4 z-40 flex justify-between">
        <span className="font-bold">قطرة</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <XMarkIcon className="w-6" /> : <Bars3Icon className="w-6" />}
        </button>
      </div>

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 p-6 mt-14 md:mt-0 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
