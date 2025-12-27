import { useState } from 'react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import { TrendingUp, TrendingDown, Minus, Flame, Beef, Wheat, Droplet } from 'lucide-react';

type TimeRange = 'week' | 'month' | 'all';

interface StatsViewProps {
  onNavigate: (page: 'dashboard' | 'calendar' | 'stats' | 'profile') => void;
}

export const StatsView = ({ onNavigate }: StatsViewProps) => {
  const { goals, getCumulativeStats, logs } = useNutritionStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const getDateRange = () => {
    const today = new Date();
    switch (timeRange) {
      case 'week':
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case 'month':
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case 'all':
        const allDates = Object.keys(logs).sort();
        return {
          start: allDates.length > 0 ? new Date(allDates[0]) : subDays(today, 30),
          end: today
        };
    }
  };

  const { start, end } = getDateRange();
  const stats = getCumulativeStats(start, end);

  const getTrend = (current: number, goal: number) => {
    const diff = ((current - goal) / goal) * 100;
    if (Math.abs(diff) < 10) return { icon: Minus, color: 'text-muted-foreground', label: 'On track' };
    if (diff > 0) return { icon: TrendingUp, color: 'text-destructive', label: 'Over target' };
    return { icon: TrendingDown, color: 'text-warning', label: 'Under target' };
  };

  const calorieTrend = goals ? getTrend(stats.avgCalories, goals.calories) : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">Statistics</h1>
        <p className="text-muted-foreground">Your cumulative nutrition data</p>
      </div>

      {/* Time Range Selector */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-1.5 border border-border flex gap-1">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Days Logged</p>
              <p className="text-3xl font-bold">{stats.daysLogged}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Flame className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold mb-4">Cumulative Totals</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Calories</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalCalories.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Avg: {stats.avgCalories.toLocaleString()}/day
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(280,70%,55%,0.1)] flex items-center justify-center">
                <Beef className="w-5 h-5 text-[hsl(280,70%,55%)]" />
              </div>
              <span className="text-sm text-muted-foreground">Protein</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalProtein.toLocaleString()}g</p>
            <p className="text-sm text-muted-foreground mt-1">
              Avg: {stats.avgProtein}g/day
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Wheat className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Carbs</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalCarbs.toLocaleString()}g</p>
            <p className="text-sm text-muted-foreground mt-1">
              Avg: {stats.avgCarbs}g/day
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(200,80%,55%,0.1)] flex items-center justify-center">
                <Droplet className="w-5 h-5 text-[hsl(200,80%,55%)]" />
              </div>
              <span className="text-sm text-muted-foreground">Fat</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalFat.toLocaleString()}g</p>
            <p className="text-sm text-muted-foreground mt-1">
              Avg: {stats.avgFat}g/day
            </p>
          </div>
        </div>
      </div>

      {/* Performance */}
      {goals && stats.daysLogged > 0 && (
        <div className="px-6">
          <h2 className="font-semibold mb-4">Performance vs Goals</h2>
          <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
            {[
              { label: 'Calories', avg: stats.avgCalories, goal: goals.calories, unit: '' },
              { label: 'Protein', avg: stats.avgProtein, goal: goals.protein, unit: 'g' },
              { label: 'Carbs', avg: stats.avgCarbs, goal: goals.carbs, unit: 'g' },
              { label: 'Fat', avg: stats.avgFat, goal: goals.fat, unit: 'g' },
            ].map((item) => {
              const percentage = Math.round((item.avg / item.goal) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.avg}{item.unit} / {item.goal}{item.unit} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentage > 110 ? 'bg-destructive' :
                        percentage >= 80 ? 'bg-success' :
                        'bg-warning'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
