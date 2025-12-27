import { useState } from 'react';
import { format } from 'date-fns';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import { MacroRing } from '@/components/MacroRing';
import { FoodEntryCard } from '@/components/FoodEntryCard';
import { AddFoodModal } from '@/components/AddFoodModal';
import { Plus, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FoodEntry } from '@/types/nutrition';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'calendar' | 'stats' | 'profile') => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { profile, goals, getLogForDate, addFoodEntry, removeFoodEntry, updateWaterIntake } = useNutritionStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const todayLog = getLogForDate(selectedDate);
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const handleAddFood = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    addFoodEntry(entry, selectedDate);
  };

  const handleAddWater = () => {
    updateWaterIntake(250, selectedDate);
  };

  if (!profile || !goals) return null;

  const currentCalories = todayLog?.totalCalories || 0;
  const currentProtein = todayLog?.totalProtein || 0;
  const currentCarbs = todayLog?.totalCarbs || 0;
  const currentFat = todayLog?.totalFat || 0;
  const currentWater = todayLog?.waterIntake || 0;

  const waterGlasses = Math.floor(currentWater / 250);
  const waterGoalGlasses = Math.ceil(goals.water / 250);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground">Hello,</p>
            <h1 className="text-2xl font-bold">{profile.name} 👋</h1>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground"
          >
            {profile.name.charAt(0).toUpperCase()}
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between bg-card rounded-2xl p-4 border border-border">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-semibold">
              {isToday ? 'Today' : format(selectedDate, 'EEEE')}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, 'MMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => changeDate(1)}
            disabled={isToday}
            className="p-2 hover:bg-muted rounded-xl transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Calorie Ring */}
      <div className="px-6 py-8">
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <div className="flex justify-center mb-6">
            <MacroRing
              current={currentCalories}
              goal={goals.calories}
              label="Calories"
              unit=" kcal"
              color="primary"
              size="lg"
            />
          </div>

          {/* Macro Rings */}
          <div className="flex justify-around">
            <MacroRing
              current={currentProtein}
              goal={goals.protein}
              label="Protein"
              unit="g"
              color="protein"
              size="sm"
            />
            <MacroRing
              current={currentCarbs}
              goal={goals.carbs}
              label="Carbs"
              unit="g"
              color="carbs"
              size="sm"
            />
            <MacroRing
              current={currentFat}
              goal={goals.fat}
              label="Fat"
              unit="g"
              color="fat"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Water Intake</p>
                <p className="text-sm text-muted-foreground">
                  {currentWater}ml / {goals.water}ml
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddWater}>
              <Plus className="w-4 h-4 mr-1" /> 250ml
            </Button>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: waterGoalGlasses }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i < waterGlasses ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Food Log */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Today's Food</h2>
          <Button variant="gradient" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Food
          </Button>
        </div>

        {todayLog?.entries.length ? (
          <div className="space-y-3">
            {todayLog.entries.map((entry) => (
              <FoodEntryCard
                key={entry.id}
                entry={entry}
                onDelete={() => removeFoodEntry(format(selectedDate, 'yyyy-MM-dd'), entry.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium">No meals logged yet</p>
            <p className="text-sm text-muted-foreground">Tap the + button to add your first meal</p>
          </div>
        )}
      </div>

      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddFood}
      />
    </div>
  );
};
