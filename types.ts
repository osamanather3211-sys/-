
export interface DailyUsage {
  date: string;
  amount: number; // Liters
}

export interface MonthlyStats {
  month: string;
  usage: number; // Liters
  projected: number; // Projected usage
  limit: number; // Goal limit
}

export interface Alert {
  id: string;
  type: 'leak' | 'excess' | 'info';
  message: string;
  timestamp: Date;
  active: boolean;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  ADVISOR = 'ADVISOR',
  PLUMBERS = 'PLUMBERS'
}

export interface SimulationState {
  currentFlowRate: number; // Liters per minute
  isLeaking: boolean;
  totalToday: number;
}

export interface UserSettings {
  name: string;
  tankCount: number;
  refillDay: string;
  refillStopInfo: string;
}

export interface Plumber {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  phone: string;
  isAvailable: boolean;
  avatarColor: string;
}