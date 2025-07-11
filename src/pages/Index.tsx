
import React, { useState } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleOnboardingComplete = (profile: any) => {
    setUserProfile(profile);
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard userProfile={userProfile} />;
};

export default Index;
