import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { Wind, BookOpen, Sparkles, Users, Zap, Home, ArrowLeft } from 'lucide-react';

export function OptionsChoice() {
  const { setScreen, pushNavigation, finishCheckIn } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();

  const handleOption = (option: string) => {
    pushNavigation('options-choice');
    switch (option) {
      case 'experience':
        setScreen('steady-me');
        break;
      case 'reflect-open':
        setScreen('understand');
        break;
      case 'reflect-guided':
        setScreen('understand-explore');
        break;
      case 'connect':
        setScreen('connect');
        break;
      case 'shift':
        setScreen('shift-state');
        break;
    }
  };

  const options = [
    {
      id: 'experience',
      icon: Wind,
      label: 'Experience',
      description: 'Be present through sound, breath, or meditation',
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
    },
    {
      id: 'reflect-open',
      icon: BookOpen,
      label: 'Reflect (Open)',
      description: 'Free-form journaling',
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      id: 'reflect-guided',
      icon: Sparkles,
      label: 'Reflect (Guided)',
      description: 'Suggested journal prompts',
      gradient: 'from-violet-400 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
    },
    {
      id: 'connect',
      icon: Users,
      label: 'Connect',
      description: 'Reach out for support',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
    {
      id: 'shift',
      icon: Zap,
      label: 'Shift',
      description: 'Suggested techniques',
      gradient: 'from-orange-400 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    },
  ];

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} transition-colors duration-700`}>
      <div className="max-w-4xl mx-auto p-6 py-8 space-y-8 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('check-in-review')}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => setScreen('home')}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-3 text-center">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            What would you like to do?
          </h2>
          <p className={`${getSubtextClasses()} transition-colors duration-700`}>
            Choose an action based on your personalized assessment
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleOption(option.id)}
                className={`${getCardClasses()} rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                {/* Gradient Header */}
                <div className={`h-24 bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                  <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <div className={`p-5 bg-gradient-to-br ${option.bgGradient}`}>
                  <h3 className={`text-lg font-medium mb-2 ${getTextClasses()}`}>
                    {option.label}
                  </h3>
                  <p className={`text-sm ${getSubtextClasses()}`}>
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${getCardClasses()} border-t p-6 shadow-lg backdrop-blur-xl`}>
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={finishCheckIn}
            variant="outline"
            className="w-full h-auto min-h-[44px] whitespace-normal px-4 py-3 text-base leading-tight rounded-full sm:py-4 sm:text-lg"
          >
            Complete Session & Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
