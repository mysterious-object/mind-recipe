import { haptic } from '../../host';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export function EmotionsActivation() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, userProfile, popNavigation } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [level, setLevel] = useState<number>((currentCheckIn.activation ?? 5) - 5);

  const handleNext = () => {
    // Map -5 to 5 scale to activation type for backwards compatibility
    let activationType: 'helpful' | 'neutral' | 'too-much';
    if (level <= -3) {
      activationType = 'too-much'; // Numb/shut down is also "too much"
    } else if (level <= 2) {
      activationType = 'neutral';
    } else {
      activationType = 'too-much'; // Overwhelming
    }
    
    updateCurrentCheckIn({ 
      activationType,
      activation: level + 5 // Convert -5 to 5 into 0 to 10 for storage
    });
    const returnScreen = popNavigation();
    if (returnScreen === 'just-log' || returnScreen === 'check-in-review') {
      setScreen(returnScreen);
    } else {
      setScreen('emotions-body');
    }
  };

  const handleSkip = () => {
    updateCurrentCheckIn({ 
      activationType: undefined,
      activation: undefined
    });
    const returnScreen = popNavigation();
    if (returnScreen === 'just-log' || returnScreen === 'check-in-review') {
      setScreen(returnScreen);
    } else {
      setScreen('emotions-body');
    }
  };

  const handleLog = () => {
    let activationType: 'helpful' | 'neutral' | 'too-much';
    if (level <= -3) {
      activationType = 'too-much';
    } else if (level <= 2) {
      activationType = 'neutral';
    } else {
      activationType = 'too-much';
    }
    
    updateCurrentCheckIn({ 
      activationType,
      activation: level + 5
    });
    setScreen('just-log');
  };

  const handleSelect = (value: number) => {
    setLevel(value);
    updateCurrentCheckIn({ activation: value + 5 });
    if (userProfile.haptics) {
      haptic();
    }
  };

  const getIntensityLabel = (value: number) => {
    const labels: Record<number, string> = {
      '-5': 'Completely shut down',
      '-4': 'Very numb',
      '-3': 'Disconnected',
      '-2': 'Low energy',
      '-1': 'A bit flat',
      '0': 'Balanced',
      '1': 'Present',
      '2': 'Engaged',
      '3': 'Energized',
      '4': 'Very activated',
      '5': 'Overwhelmed',
    };
    return labels[value] || 'Balanced';
  };

  const getIntensityColor = (value: number) => {
    if (value === 0) return 'from-green-400 to-teal-400';
    if (value < 0) {
      // Negative = numb/checked out (blue to gray)
      if (value <= -4) return 'from-gray-400 to-slate-500';
      if (value <= -2) return 'from-blue-300 to-gray-400';
      return 'from-cyan-400 to-blue-400';
    } else {
      // Positive = activated/overwhelmed (yellow to red)
      if (value <= 2) return 'from-yellow-400 to-orange-400';
      if (value <= 4) return 'from-orange-400 to-red-400';
      return 'from-red-500 to-rose-600';
    }
  };

  const getIntensityDescription = (value: number) => {
    if (value === 0) return 'Right in the middle—alert but grounded';
    if (value < 0) return 'Shut down, numb, or disconnected';
    return 'Activated, revved up, or overwhelmed';
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          onClick={() => setScreen('emotions-select')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
              How's your nervous system energy?
            </h2>
            <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
              -5 is numb/shut down, 0 is manageable, +5 is overwhelmed
            </p>
          </div>

          {/* Visual intensity indicator */}
          <div className={`${getCardClasses()} backdrop-blur-xl border rounded-3xl p-8 space-y-6 shadow-lg transition-colors duration-700`}>
            {/* Current level display */}
            <div className="text-center space-y-4">
              <div 
                className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getIntensityColor(level)} flex items-center justify-center shadow-2xl transition-all duration-300`}
                style={{
                  transform: `scale(${0.8 + (Math.abs(level) / 25)})`,
                }}
              >
                <span className="text-5xl font-bold text-white">
                  {level > 0 ? `+${level}` : level}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className={`text-xl font-medium ${getTextClasses()} transition-colors duration-700`}>
                  {getIntensityLabel(level)}
                </div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  {getIntensityDescription(level)}
                </div>
              </div>
            </div>

            {/* Interactive scale */}
            <div className="space-y-4">
              {/* Number buttons grid */}
              <div className="grid grid-cols-11 gap-1.5">
                {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSelect(num)}
                    className={`
                      aspect-square rounded-xl transition-all font-medium text-sm md:text-base
                      ${level === num
                        ? 'bg-gradient-to-br shadow-lg scale-110 text-white ' + 
                          (num === 0 ? 'from-green-500 to-teal-500' :
                           num < 0 
                             ? (num <= -4 ? 'from-gray-500 to-slate-600' : 
                                num <= -2 ? 'from-blue-400 to-gray-500' : 
                                'from-cyan-500 to-blue-500')
                             : (num <= 2 ? 'from-yellow-500 to-orange-500' : 
                                num <= 4 ? 'from-orange-500 to-red-500' : 
                                'from-red-600 to-rose-600'))
                        : `${getCardClasses()} hover:bg-gray-100 dark:hover:bg-gray-700 ${getTextClasses()}`
                      }
                    `}
                  >
                    {num > 0 ? `+${num}` : num}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="px-2">
                <input
                  type="range"
                  min="-5"
                  max="5"
                  value={level}
                  onChange={(e) => handleSelect(parseInt(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      rgb(107, 114, 128) 0%, 
                      rgb(148, 163, 184) 20%, 
                      rgb(56, 189, 248) 40%, 
                      rgb(34, 197, 94) 50%, 
                      rgb(250, 204, 21) 60%, 
                      rgb(251, 146, 60) 75%, 
                      rgb(239, 68, 68) 90%, 
                      rgb(225, 29, 72) 100%)`,
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-xs opacity-70">
                <span className={getSubtextClasses()}>-5<br/>Numb</span>
                <span className={`${getSubtextClasses()} text-center`}>0<br/>Manageable</span>
                <span className={`${getSubtextClasses()} text-right`}>+5<br/>Overwhelmed</span>
              </div>
            </div>

            {/* Helper text */}
            <div className={`text-xs ${getSubtextClasses()} text-center transition-colors duration-700 pt-2 border-t border-gray-200 dark:border-gray-700`}>
              This is about your nervous system state—not about whether you're "good" or "bad"
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleNext}
            className="w-full py-6 rounded-full text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Next
          </Button>
          
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={handleSkip}
              className={`${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
            >
              Skip
            </button>

            <button
              onClick={handleLog}
              className={`${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
            >
              Log Now
            </button>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid #8B5CF6;
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid #8B5CF6;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
