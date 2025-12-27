import { useNutritionStore } from '@/hooks/useNutritionStore';
import { Button } from '@/components/ui/button';
import { User, Scale, Ruler, Target, Activity, Flame, Beef, Wheat, Droplet } from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (page: 'dashboard' | 'calendar' | 'stats' | 'profile') => void;
  onEditProfile: () => void;
}

const activityLabels = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Active',
  very_active: 'Very Active',
};

const goalLabels = {
  lose: 'Lose Weight',
  maintain: 'Maintain Weight',
  gain: 'Build Muscle',
};

export const ProfileView = ({ onNavigate, onEditProfile }: ProfileViewProps) => {
  const { profile, goals } = useNutritionStore();

  if (!profile || !goals) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-4xl font-bold text-primary-foreground mb-4 shadow-glow">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">{goalLabels[profile.goal]}</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold mb-4">Your Profile</h2>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-semibold">{profile.age} years</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-semibold">{profile.weight} kg</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-semibold">{profile.height} cm</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Activity Level</p>
              <p className="font-semibold">{activityLabels[profile.activityLevel]}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Goal</p>
              <p className="font-semibold">{goalLabels[profile.goal]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold mb-4">Your Daily Goals</h2>
        <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className="font-bold text-lg">{goals.calories} kcal</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-xl p-3 text-center">
              <Beef className="w-5 h-5 mx-auto mb-1 text-[hsl(280,70%,55%)]" />
              <p className="font-bold">{goals.protein}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <Wheat className="w-5 h-5 mx-auto mb-1 text-warning" />
              <p className="font-bold">{goals.carbs}g</p>
              <p className="text-xs text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <Droplet className="w-5 h-5 mx-auto mb-1 text-[hsl(200,80%,55%)]" />
              <p className="font-bold">{goals.fat}g</p>
              <p className="text-xs text-muted-foreground">Fat</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Water</p>
              <p className="font-bold text-lg">{(goals.water / 1000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6">
        <Button variant="outline" className="w-full" onClick={onEditProfile}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
