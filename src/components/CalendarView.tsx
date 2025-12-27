import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  onNavigate: (page: 'dashboard' | 'calendar' | 'stats' | 'profile') => void;
}

export const CalendarView = ({ onNavigate }: CalendarViewProps) => {
  const { goals, getLogForDate } = useNutritionStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedLog = getLogForDate(selectedDate);

  const getCaloriePercentage = (date: Date) => {
    const log = getLogForDate(date);
    if (!log || !goals) return 0;
    return Math.min((log.totalCalories / goals.calories) * 100, 100);
  };

  const getColorForPercentage = (percentage: number) => {
    if (percentage === 0) return 'bg-muted';
    if (percentage < 50) return 'bg-warning/60';
    if (percentage < 80) return 'bg-warning';
    if (percentage <= 110) return 'bg-success';
    return 'bg-destructive';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">Food Calendar</h1>
        <p className="text-muted-foreground">Track your daily nutrition history</p>
      </div>

      {/* Month Navigation */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-lg">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-4 border border-border">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const percentage = getCaloriePercentage(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const log = getLogForDate(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative',
                    !isCurrentMonth && 'opacity-30',
                    isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
                    isToday && !isSelected && 'ring-2 ring-muted-foreground/30'
                  )}
                >
                  <span className={cn(
                    'font-medium z-10',
                    isSelected && 'text-primary'
                  )}>
                    {format(day, 'd')}
                  </span>
                  {log && log.entries.length > 0 && (
                    <div
                      className={cn(
                        'absolute bottom-1 w-2 h-2 rounded-full',
                        getColorForPercentage(percentage)
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <span className="text-xs text-muted-foreground">{'<50%'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">50-80%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">On target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Over</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      <div className="px-6">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold mb-4">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>

          {selectedLog && selectedLog.entries.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-xl font-bold text-primary">{selectedLog.totalCalories}</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xl font-bold">{selectedLog.totalProtein}g</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-xl font-bold">{selectedLog.totalCarbs}g</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-xl font-bold">{selectedLog.totalFat}g</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedLog.entries.length} meal{selectedLog.entries.length !== 1 ? 's' : ''} logged
                </p>
                <div className="space-y-2">
                  {selectedLog.entries.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="font-medium">{entry.name}</span>
                      <span className="text-muted-foreground">{entry.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-muted-foreground">No meals logged for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
