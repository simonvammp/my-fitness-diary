import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FoodEntry } from '@/types/nutrition';
import { X } from 'lucide-react';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
}

const mealTypes: { value: FoodEntry['mealType']; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍎' },
];

export const AddFoodModal = ({ isOpen, onClose, onAdd }: AddFoodModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'lunch' as FoodEntry['mealType'],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.calories) {
      onAdd({
        name: formData.name,
        calories: parseInt(formData.calories) || 0,
        protein: parseInt(formData.protein) || 0,
        carbs: parseInt(formData.carbs) || 0,
        fat: parseInt(formData.fat) || 0,
        mealType: formData.mealType,
      });
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: 'lunch',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Add Food</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="food-name">Food Name</Label>
            <Input
              id="food-name"
              placeholder="e.g., Grilled Chicken Salad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label>Meal Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {mealTypes.map((meal) => (
                <button
                  key={meal.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, mealType: meal.value })}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    formData.mealType === meal.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-xl">{meal.icon}</span>
                  <span className="text-xs font-medium">{meal.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="0"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="0"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="0"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="0"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                className="h-12"
              />
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full" size="lg">
            Add Food
          </Button>
        </form>
      </div>
    </div>
  );
};
