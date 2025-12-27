import { useState, useEffect } from 'react';
import { UserProfile, DailyLog, FoodEntry, NutritionGoals, calculateDailyGoals } from '@/types/nutrition';
import { format } from 'date-fns';

const STORAGE_KEYS = {
  PROFILE: 'nutrition_profile',
  LOGS: 'nutrition_logs',
};

export const useNutritionStore = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setGoals(calculateDailyGoals(parsed));
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    setIsLoading(false);
  }, []);

  // Save profile to localStorage
  const saveProfile = (newProfile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    setProfile(newProfile);
    setGoals(calculateDailyGoals(newProfile));
  };

  // Save logs to localStorage
  const saveLogs = (newLogs: Record<string, DailyLog>) => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(newLogs));
    setLogs(newLogs);
  };

  // Add food entry
  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>, date?: Date) => {
    const targetDate = date || new Date();
    const dateKey = format(targetDate, 'yyyy-MM-dd');
    
    const newEntry: FoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: targetDate,
    };

    const existingLog = logs[dateKey] || {
      date: dateKey,
      entries: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      waterIntake: 0,
    };

    const updatedLog: DailyLog = {
      ...existingLog,
      entries: [...existingLog.entries, newEntry],
      totalCalories: existingLog.totalCalories + entry.calories,
      totalProtein: existingLog.totalProtein + entry.protein,
      totalCarbs: existingLog.totalCarbs + entry.carbs,
      totalFat: existingLog.totalFat + entry.fat,
    };

    const newLogs = { ...logs, [dateKey]: updatedLog };
    saveLogs(newLogs);
  };

  // Remove food entry
  const removeFoodEntry = (dateKey: string, entryId: string) => {
    const log = logs[dateKey];
    if (!log) return;

    const entry = log.entries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedLog: DailyLog = {
      ...log,
      entries: log.entries.filter(e => e.id !== entryId),
      totalCalories: log.totalCalories - entry.calories,
      totalProtein: log.totalProtein - entry.protein,
      totalCarbs: log.totalCarbs - entry.carbs,
      totalFat: log.totalFat - entry.fat,
    };

    const newLogs = { ...logs, [dateKey]: updatedLog };
    saveLogs(newLogs);
  };

  // Update water intake
  const updateWaterIntake = (amount: number, date?: Date) => {
    const targetDate = date || new Date();
    const dateKey = format(targetDate, 'yyyy-MM-dd');

    const existingLog = logs[dateKey] || {
      date: dateKey,
      entries: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      waterIntake: 0,
    };

    const updatedLog: DailyLog = {
      ...existingLog,
      waterIntake: existingLog.waterIntake + amount,
    };

    const newLogs = { ...logs, [dateKey]: updatedLog };
    saveLogs(newLogs);
  };

  // Get log for a specific date
  const getLogForDate = (date: Date): DailyLog | null => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return logs[dateKey] || null;
  };

  // Get cumulative stats for a date range
  const getCumulativeStats = (startDate: Date, endDate: Date) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWater = 0;
    let daysLogged = 0;

    const current = new Date(startDate);
    while (current <= endDate) {
      const log = getLogForDate(current);
      if (log && log.entries.length > 0) {
        totalCalories += log.totalCalories;
        totalProtein += log.totalProtein;
        totalCarbs += log.totalCarbs;
        totalFat += log.totalFat;
        totalWater += log.waterIntake;
        daysLogged++;
      }
      current.setDate(current.getDate() + 1);
    }

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalWater,
      daysLogged,
      avgCalories: daysLogged > 0 ? Math.round(totalCalories / daysLogged) : 0,
      avgProtein: daysLogged > 0 ? Math.round(totalProtein / daysLogged) : 0,
      avgCarbs: daysLogged > 0 ? Math.round(totalCarbs / daysLogged) : 0,
      avgFat: daysLogged > 0 ? Math.round(totalFat / daysLogged) : 0,
    };
  };

  return {
    profile,
    logs,
    goals,
    isLoading,
    saveProfile,
    addFoodEntry,
    removeFoodEntry,
    updateWaterIntake,
    getLogForDate,
    getCumulativeStats,
  };
};
