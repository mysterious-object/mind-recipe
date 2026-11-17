import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { ArrowLeft } from 'lucide-react';

export function OnboardingBeforeContinue() {
  const { setScreen } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses } = useTheme();

  const handleSetup = () => {

    setScreen('onboarding-safety');
  };

  const handleLater = () => {

    setScreen('home');
  };

  const handleBack = () => {

    setScreen('onboarding-atmosphere');
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} flex items-center justify-center p-6 transition-colors duration-700`}>
      <div className="max-w-lg w-full space-y-8">
        <button
          type="button"
          onClick={handleBack}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-4">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            Before we keep going…
          </h2>
          
          <div className={`space-y-4 ${getSubtextClasses()} transition-colors duration-700`}>
            <p>The next step is optional.</p>
            
            <p>
              It's just support preferences — who you trust, how you want help to show up, 
              and an optional code word.
            </p>
            
            <p>You can skip this and set it later in Settings.</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSetup}
            className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition-colors flex items-center justify-center"
          >
            Set it up now
          </button>

          <button
            type="button"
            onClick={handleLater}
            className="w-full py-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
