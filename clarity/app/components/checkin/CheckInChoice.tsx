import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { ArrowLeft, Heart, Compass } from 'lucide-react';

export function CheckInChoice() {
  const { setScreen, setShowCrisisModal, resetCurrentCheckIn } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getSolidCardClasses, getHoverClasses } = useTheme();

  const handleChoice = (path: 'emotions' | 'compass') => {
    if (path === 'emotions') {
      setScreen('emotions-select');
    } else {
      setScreen('compass-map');
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-6 transition-colors duration-700`}>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          type="button"
          onClick={() => setScreen('home')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center space-y-2">
          <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
            How do you want to check in right now?
          </h2>
        </div>

        <div className="space-y-4">
          {/* Emotions Card */}
          <button
            onClick={() => handleChoice('emotions')}
            className={`w-full ${getSolidCardClasses()} rounded-3xl p-8 text-left ${getHoverClasses()} transition-all shadow-md hover:shadow-lg space-y-3 border`}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>Emotions</h3>
              </div>
            </div>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              Pick what you're feeling and how strong it is
            </p>
            <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
              Use words
            </p>
          </button>

          {/* Compass Card */}
          <button
            onClick={() => handleChoice('compass')}
            className={`w-full ${getSolidCardClasses()} rounded-3xl p-8 text-left ${getHoverClasses()} transition-all shadow-md hover:shadow-lg space-y-3 border`}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>Compass</h3>
              </div>
            </div>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              Show me where you are on the map
            </p>
            <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
              Open / Protected vs High / Low energy
            </p>
            
            {/* Mini compass preview */}
            <div className="pt-4">
              <div className="w-32 h-32 border-2 border-gray-300 dark:border-gray-600 rounded-xl relative">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="border-r border-b border-gray-300 dark:border-gray-600"></div>
                  <div className="border-b border-gray-300 dark:border-gray-600"></div>
                  <div className="border-r border-gray-300 dark:border-gray-600"></div>
                  <div></div>
                </div>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-gray-400">High</div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-400">Low</div>
                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-gray-400">O</div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-gray-400">P</div>
              </div>
            </div>
          </button>
        </div>

        {/* Bottom buttons */}
        <div className="space-y-3 text-center">
          <button
            onClick={() => setScreen('just-log')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            I just want to log
          </button>
          <div>
            <button
              onClick={() => setShowCrisisModal(true)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              I need help now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
