import { FoodEntry } from '@/types/nutrition';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface FoodEntryCardProps {
  entry: FoodEntry;
  onDelete: () => void;
}

const mealIcons: Record<FoodEntry['mealType'], string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export const FoodEntryCard = ({ entry, onDelete }: FoodEntryCardProps) => {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl">
        {mealIcons[entry.mealType]}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{entry.name}</h4>
        <p className="text-sm text-muted-foreground">
          {format(new Date(entry.timestamp), 'h:mm a')}
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold text-primary">{entry.calories} cal</p>
        <p className="text-xs text-muted-foreground">
          P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
        </p>
      </div>

      <button
        onClick={onDelete}
        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </button>
    </div>
  );
};
