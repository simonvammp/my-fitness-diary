import { cn } from '@/lib/utils';

interface MacroRingProps {
  current: number;
  goal: number;
  label: string;
  unit: string;
  color: 'primary' | 'protein' | 'carbs' | 'fat';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  primary: 'stroke-primary',
  protein: 'stroke-[hsl(280,70%,55%)]',
  carbs: 'stroke-[hsl(38,92%,50%)]',
  fat: 'stroke-[hsl(200,80%,55%)]',
};

const bgColorMap = {
  primary: 'stroke-primary/20',
  protein: 'stroke-[hsl(280,70%,55%,0.2)]',
  carbs: 'stroke-[hsl(38,92%,50%,0.2)]',
  fat: 'stroke-[hsl(200,80%,55%,0.2)]',
};

export const MacroRing = ({ current, goal, label, unit, color, size = 'md' }: MacroRingProps) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  const sizes = {
    sm: { outer: 60, stroke: 6, textSize: 'text-sm' },
    md: { outer: 100, stroke: 8, textSize: 'text-xl' },
    lg: { outer: 140, stroke: 10, textSize: 'text-3xl' },
  };

  const { outer, stroke, textSize } = sizes[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg className="transform -rotate-90" width={outer} height={outer}>
          <circle
            className={bgColorMap[color]}
            strokeWidth={stroke}
            fill="transparent"
            r={radius}
            cx={outer / 2}
            cy={outer / 2}
          />
          <circle
            className={cn(colorMap[color], 'transition-all duration-500 ease-out')}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={outer / 2}
            cy={outer / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', textSize)}>{current}</span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground">/ {goal}{unit}</span>
          )}
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
