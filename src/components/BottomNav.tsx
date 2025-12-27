import { Home, Calendar, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Page = 'dashboard' | 'calendar' | 'stats' | 'profile';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; icon: React.ElementType; label: string }[] = [
  { page: 'dashboard', icon: Home, label: 'Home' },
  { page: 'calendar', icon: Calendar, label: 'Calendar' },
  { page: 'stats', icon: BarChart3, label: 'Stats' },
  { page: 'profile', icon: User, label: 'Profile' },
];

export const BottomNav = ({ currentPage, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border px-6 pb-6 pt-3 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ page, icon: Icon, label }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-all',
                isActive && 'bg-primary/10'
              )}>
                <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
