import { useState, useEffect } from 'react';
import { useNutritionStore } from '@/hooks/useNutritionStore';
import { ProfileSetup } from '@/components/ProfileSetup';
import { Dashboard } from '@/components/Dashboard';
import { CalendarView } from '@/components/CalendarView';
import { StatsView } from '@/components/StatsView';
import { ProfileView } from '@/components/ProfileView';
import { BottomNav } from '@/components/BottomNav';
import { UserProfile } from '@/types/nutrition';

type Page = 'dashboard' | 'calendar' | 'stats' | 'profile';

const Index = () => {
  const { profile, isLoading, saveProfile } = useNutritionStore();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!isLoading && !profile) {
      setShowSetup(true);
    }
  }, [isLoading, profile]);

  const handleProfileComplete = (newProfile: UserProfile) => {
    saveProfile(newProfile);
    setShowSetup(false);
  };

  const handleEditProfile = () => {
    setShowSetup(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (showSetup || !profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <div className="dark">
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'calendar' && <CalendarView onNavigate={setCurrentPage} />}
      {currentPage === 'stats' && <StatsView onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && (
        <ProfileView onNavigate={setCurrentPage} onEditProfile={handleEditProfile} />
      )}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;
