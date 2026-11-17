import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Welcome } from './components/onboarding/Welcome';
import { OnboardingYou } from './components/onboarding/OnboardingYou';
import { OnboardingAtmosphere } from './components/onboarding/OnboardingAtmosphere';
import { OnboardingBeforeContinue } from './components/onboarding/OnboardingBeforeContinue';
import { OnboardingSafety } from './components/onboarding/OnboardingSafety';
import { Home } from './components/Home';
import { CheckInChoice } from './components/checkin/CheckInChoice';
import { EmotionsSelect } from './components/checkin/EmotionsSelect';
import { EmotionsActivation } from './components/checkin/EmotionsActivation';
import { EmotionsBody } from './components/checkin/EmotionsBody';
import { EmotionsDomain } from './components/checkin/EmotionsDomain';
import { CompassMap } from './components/checkin/CompassMap';
import { CompassBody } from './components/checkin/CompassBody';
import { CompassDomain } from './components/checkin/CompassDomain';
import { Summary } from './components/checkin/Summary';
import { CheckInReview } from './components/checkin/CheckInReview';
import { OptionsChoice } from './components/checkin/OptionsChoice';
import { SteadyMe } from './components/actions/SteadyMe';
import { ShiftStateNew } from './components/actions/ShiftStateNew';
import { Understand } from './components/actions/Understand';
import { UnderstandExplore } from './components/actions/UnderstandExplore';
import { JustLog } from './components/actions/JustLog';
import { Insights } from './components/Insights';
import { Learn } from './components/Learn';
import { Connect } from './components/Connect';
import { Settings } from './components/Settings';
import { CrisisModal } from './components/CrisisModal';

function AppContent() {
  const { screen, setScreen, popNavigation } = useApp();

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <Welcome />;
      case 'onboarding-you':
        return <OnboardingYou />;
      case 'onboarding-atmosphere':
        return <OnboardingAtmosphere />;
      case 'onboarding-before-continue':
        return <OnboardingBeforeContinue />;
      case 'onboarding-safety':
        return <OnboardingSafety />;
      case 'home':
        return <Home />;
      case 'check-in-choice':
        return <CheckInChoice />;
      case 'emotions-select':
        return <EmotionsSelect />;
      case 'emotions-activation':
        return <EmotionsActivation />;
      case 'emotions-body':
        return <EmotionsBody />;
      case 'emotions-domain':
        return <EmotionsDomain />;
      case 'compass-map':
        return <CompassMap />;
      case 'compass-body':
        return <CompassBody />;
      case 'compass-domain':
        return <CompassDomain />;
      case 'summary':
        return <Summary />;
      case 'check-in-review':
        return <CheckInReview />;
      case 'options-choice':
        return <OptionsChoice />;
      case 'steady-me':
        return <SteadyMe returnTo="home" onClose={() => setScreen(popNavigation() ?? 'home')} />;
      case 'shift-state':
        return <ShiftStateNew />;
      case 'shift-state-old':
        return <ShiftStateNew />;
      case 'understand':
        return <Understand />;
      case 'understand-explore':
        return <UnderstandExplore />;
      case 'just-log':
        return <JustLog />;
      case 'insights':
        return <Insights />;
      case 'learn':
        return <Learn />;
      case 'connect':
        return <Connect />;
      case 'settings':
        return <Settings />;
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      {renderScreen()}
      <CrisisModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
