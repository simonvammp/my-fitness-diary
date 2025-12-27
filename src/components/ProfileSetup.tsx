import { useState } from 'react';
import { UserProfile } from '@/types/nutrition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Target, Activity, Ruler, Scale } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '' as UserProfile['gender'] | '',
    activityLevel: '' as UserProfile['activityLevel'] | '',
    goal: '' as UserProfile['goal'] | '',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (formData.name && formData.age && formData.weight && formData.height && 
        formData.gender && formData.activityLevel && formData.goal) {
      onComplete({
        name: formData.name,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender as UserProfile['gender'],
        activityLevel: formData.activityLevel as UserProfile['activityLevel'],
        goal: formData.goal as UserProfile['goal'],
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name && formData.age;
      case 2: return formData.weight && formData.height && formData.gender;
      case 3: return formData.activityLevel;
      case 4: return formData.goal;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Step {step} of 4</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24">
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Let's get started</h1>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <Scale className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Body measurements</h1>
              <p className="text-muted-foreground">We'll use this to calculate your needs</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 175"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`h-12 rounded-xl border-2 font-medium capitalize transition-all ${
                        formData.gender === g
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <Activity className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Activity level</h1>
              <p className="text-muted-foreground">How active are you on a typical day?</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                { value: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                { value: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week' },
                { value: 'very_active', label: 'Very Active', desc: 'Very hard exercise, physical job' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFormData({ ...formData, activityLevel: level.value as UserProfile['activityLevel'] })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.activityLevel === level.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className={`font-semibold ${formData.activityLevel === level.value ? 'text-primary' : ''}`}>
                    {level.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{level.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Your goal</h1>
              <p className="text-muted-foreground">What do you want to achieve?</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'lose', label: 'Lose Weight', desc: 'Reduce body fat while preserving muscle', emoji: '📉' },
                { value: 'maintain', label: 'Maintain Weight', desc: 'Keep your current weight stable', emoji: '⚖️' },
                { value: 'gain', label: 'Build Muscle', desc: 'Gain muscle mass and strength', emoji: '💪' },
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setFormData({ ...formData, goal: goal.value as UserProfile['goal'] })}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    formData.goal === goal.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <p className={`font-semibold ${formData.goal === goal.value ? 'text-primary' : ''}`}>
                        {goal.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{goal.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              variant="gradient"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1"
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="gradient"
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1"
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
