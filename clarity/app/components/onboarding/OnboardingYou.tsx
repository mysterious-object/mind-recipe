import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../ui/input';
import { ArrowLeft } from 'lucide-react';
import { Pronouns } from '../../types';

export function OnboardingYou() {
  const { setScreen, userProfile, updateUserProfile, popNavigation } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses } = useTheme();
  const [name, setName] = useState(userProfile.name);
  const [pronouns, setPronouns] = useState<Pronouns>(userProfile.pronouns);
  const [customPronouns, setCustomPronouns] = useState(userProfile.customPronouns || '');

  const handleContinue = () => {
    updateUserProfile({ 
      name, 
      pronouns,
      customPronouns: pronouns === 'custom' ? customPronouns : undefined
    });
    setScreen(popNavigation() ?? 'onboarding-atmosphere');
  };

  const handleBack = () => {
    setScreen(popNavigation() ?? 'welcome');
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

        <div className="space-y-2">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            What should I call you?
          </h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Name / nickname
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full text-lg p-6 rounded-2xl"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Pronouns
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['she/her', 'he/him', 'they/them', 'custom'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPronouns(option)}
                  className={`p-4 rounded-2xl transition-all ${
                    pronouns === option
                      ? 'bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {pronouns === 'custom' && (
              <Input
                type="text"
                value={customPronouns}
                onChange={(e) => setCustomPronouns(e.target.value)}
                placeholder="Enter your pronouns"
                className="w-full p-4 rounded-2xl mt-3"
              />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!name.trim()}
          className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50 text-white transition-colors flex items-center justify-center"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
