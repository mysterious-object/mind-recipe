import { playSoundscape } from '../../soundscape';
import { haptic } from '../../host';
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Theme, Vibe } from '../../types';
import { Volume2, Smartphone, ArrowLeft } from 'lucide-react';

export function OnboardingAtmosphere() {
  const { setScreen, userProfile, updateUserProfile, popNavigation } = useApp();
  const [theme, setTheme] = useState<Theme>(userProfile.theme);
  const [vibe, setVibe] = useState<Vibe>(userProfile.vibe);
  const [motion, setMotion] = useState(userProfile.motion);
  const [soundscape, setSoundscape] = useState(userProfile.soundscape);
  const [haptics, setHaptics] = useState(userProfile.haptics);

  const stopSample = useRef<(() => void) | null>(null);
  useEffect(() => () => stopSample.current?.(), []);
  const handleContinue = () => {
    updateUserProfile({ theme, vibe, motion, soundscape, haptics });
    setScreen(popNavigation() ?? 'onboarding-before-continue');
  };

  const handleSkip = () => {
    setScreen(popNavigation() ?? 'onboarding-before-continue');
  };

  const handlePlaySample = () => {
    stopSample.current?.(); stopSample.current = playSoundscape();
  };

  const handleTryHaptic = () => {
    if (true) {
      haptic();
    }
  };

  // Dynamic theme-based styling
  const getBackgroundClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-gradient-to-b from-slate-50 via-purple-50/30 to-white';
      case 'dim':
        return 'bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700';
      case 'dark':
        return 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950';
    }
  };

  const getTextClasses = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-900';
      case 'dim':
        return 'text-gray-100';
      case 'dark':
        return 'text-gray-100';
    }
  };

  const getSubtextClasses = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-600';
      case 'dim':
        return 'text-gray-300';
      case 'dark':
        return 'text-gray-300';
    }
  };

  const getMutedTextClasses = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-500';
      case 'dim':
        return 'text-gray-400';
      case 'dark':
        return 'text-gray-400';
    }
  };

  const getCardClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white/70 border-gray-200/50';
      case 'dim':
        return 'bg-gray-800/60 border-gray-600/30';
      case 'dark':
        return 'bg-gray-800/70 border-gray-700/50';
    }
  };

  // Dynamic vibe-based aura colors
  const getVibeAuraStyle = () => {
    const baseOpacity = theme === 'light' ? 0.3 : theme === 'dim' ? 0.25 : 0.4;
    
    switch (vibe) {
      case 'warm-glow':
        return {
          primary: `radial-gradient(circle, rgba(251, 146, 60, ${baseOpacity}), rgba(244, 114, 182, ${baseOpacity * 0.7}), transparent)`,
          secondary: `radial-gradient(circle, rgba(251, 113, 133, ${baseOpacity * 0.8}), rgba(252, 165, 165, ${baseOpacity * 0.5}), transparent)`,
          tertiary: `radial-gradient(circle, rgba(253, 186, 116, ${baseOpacity * 0.6}), transparent)`,
        };
      case 'deep-night':
        return {
          primary: `radial-gradient(circle, rgba(67, 56, 202, ${baseOpacity}), rgba(88, 28, 135, ${baseOpacity * 0.7}), transparent)`,
          secondary: `radial-gradient(circle, rgba(76, 29, 149, ${baseOpacity * 0.8}), rgba(67, 56, 202, ${baseOpacity * 0.5}), transparent)`,
          tertiary: `radial-gradient(circle, rgba(55, 48, 163, ${baseOpacity * 0.6}), transparent)`,
        };
      case 'ocean-slow':
        return {
          primary: `radial-gradient(circle, rgba(20, 184, 166, ${baseOpacity}), rgba(59, 130, 246, ${baseOpacity * 0.7}), transparent)`,
          secondary: `radial-gradient(circle, rgba(34, 211, 238, ${baseOpacity * 0.8}), rgba(56, 189, 248, ${baseOpacity * 0.5}), transparent)`,
          tertiary: `radial-gradient(circle, rgba(14, 165, 233, ${baseOpacity * 0.6}), transparent)`,
        };
      case 'soft-dawn':
        return {
          primary: `radial-gradient(circle, rgba(251, 207, 232, ${baseOpacity}), rgba(233, 213, 255, ${baseOpacity * 0.7}), transparent)`,
          secondary: `radial-gradient(circle, rgba(254, 215, 170, ${baseOpacity * 0.8}), rgba(252, 231, 243, ${baseOpacity * 0.5}), transparent)`,
          tertiary: `radial-gradient(circle, rgba(243, 232, 255, ${baseOpacity * 0.6}), transparent)`,
        };
    }
  };

  const vibeAura = getVibeAuraStyle();

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} flex items-center justify-center p-6 relative overflow-hidden transition-all duration-700`}>
      {/* Layered Organic Aura Background - Vibe-based colors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 - Primary vibe aura */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
          style={{
            background: vibeAura.primary,
            animation: motion ? 'float-gentle-1 20s ease-in-out infinite' : 'none',
          }}
        />
        {/* Blob 2 - Secondary vibe aura */}
        <div 
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-1000"
          style={{
            background: vibeAura.secondary,
            animation: motion ? 'float-gentle-2 25s ease-in-out 5s infinite' : 'none',
          }}
        />
        {/* Blob 3 - Tertiary vibe aura */}
        <div 
          className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full blur-3xl transition-all duration-1000"
          style={{
            background: vibeAura.tertiary,
            animation: motion ? 'float-gentle-3 30s ease-in-out 10s infinite' : 'none',
          }}
        />
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => setScreen(popNavigation() ?? 'onboarding-you')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            Choose how you want MindRecipe to feel.
          </h2>
          <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
            You can change this anytime.
          </p>
        </div>

        <div className="space-y-8">
          {/* SECTION 1: Theme */}
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg ${getTextClasses()} mb-1 transition-colors duration-700`}>Theme</h3>
              <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                Screen brightness and contrast
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Light Theme Preview */}
              <button
                onClick={() => setTheme('light')}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  theme === 'light' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102 shadow-sm'
                }`}
              >
                <div className="aspect-[9/16] bg-gradient-to-b from-slate-50 via-purple-50/30 to-white p-3 relative">
                  <div 
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full blur-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent)',
                    }}
                  />
                  <div className="relative z-10 space-y-1">
                    <div className="h-1.5 w-8 bg-gray-900 rounded-full" />
                    <div className="h-1 w-12 bg-gray-600 rounded-full" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-md border border-gray-200/50">
                    <div className="h-1 w-10 bg-purple-600 rounded-full mb-1" />
                    <div className="h-0.5 w-14 bg-gray-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-white py-2 px-3 text-center border-t border-gray-200">
                  <span className="text-sm text-gray-900">Light</span>
                </div>
              </button>

              {/* Dim Theme Preview */}
              <button
                onClick={() => setTheme('dim')}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  theme === 'dim' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102 shadow-sm'
                }`}
              >
                <div className="aspect-[9/16] bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 p-3 relative">
                  <div 
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full blur-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)',
                    }}
                  />
                  <div className="relative z-10 space-y-1">
                    <div className="h-1.5 w-8 bg-gray-100 rounded-full" />
                    <div className="h-1 w-12 bg-gray-400 rounded-full" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-gray-800/70 backdrop-blur-sm rounded-xl p-2 shadow-md border border-gray-600/30">
                    <div className="h-1 w-10 bg-purple-400 rounded-full mb-1" />
                    <div className="h-0.5 w-14 bg-gray-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-white py-2 px-3 text-center border-t border-gray-200">
                  <span className="text-sm text-gray-900">Dim</span>
                </div>
              </button>

              {/* Dark Theme Preview */}
              <button
                onClick={() => setTheme('dark')}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102 shadow-sm'
                }`}
              >
                <div className="aspect-[9/16] bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-3 relative">
                  <div 
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full blur-xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent)',
                    }}
                  />
                  <div className="relative z-10 space-y-1">
                    <div className="h-1.5 w-8 bg-gray-100 rounded-full" />
                    <div className="h-1 w-12 bg-gray-400 rounded-full" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 shadow-md border border-gray-700/50">
                    <div className="h-1 w-10 bg-purple-400 rounded-full mb-1" />
                    <div className="h-0.5 w-14 bg-gray-400 rounded-full" />
                  </div>
                </div>
                <div className="bg-white py-2 px-3 text-center border-t border-gray-200">
                  <span className="text-sm text-gray-900">Dark</span>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 2: Vibe */}
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg ${getTextClasses()} mb-1 transition-colors duration-700`}>Vibe</h3>
              <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                Color mood
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Warm Glow */}
              <button
                onClick={() => setVibe('warm-glow')}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                  vibe === 'warm-glow' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102'
                }`}
              >
                <div className="aspect-square relative bg-gradient-to-br from-orange-100 to-rose-100 p-6 flex items-center justify-center">
                  {/* Organic blob with warm colors */}
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.6), rgba(244, 114, 182, 0.4), transparent)',
                        animation: 'pulse-slow 4s ease-in-out infinite',
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(251, 113, 133, 0.5), rgba(252, 165, 165, 0.3), transparent)',
                        animation: 'pulse-slow 4s ease-in-out 1s infinite',
                      }}
                    />
                  </div>
                </div>
                <div className={`${getCardClasses()} backdrop-blur-sm py-3 px-4 text-center border-t transition-colors duration-700`}>
                  <span className={`text-sm ${getTextClasses()} transition-colors duration-700`}>Warm Glow</span>
                </div>
              </button>

              {/* Deep Night */}
              <button
                onClick={() => setVibe('deep-night')}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                  vibe === 'deep-night' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102'
                }`}
              >
                <div className="aspect-square relative bg-gradient-to-br from-indigo-950 to-purple-950 p-6 flex items-center justify-center">
                  {/* Organic blob with deep night colors */}
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(67, 56, 202, 0.7), rgba(88, 28, 135, 0.5), transparent)',
                        animation: 'pulse-slow 5s ease-in-out infinite',
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(76, 29, 149, 0.6), rgba(67, 56, 202, 0.4), transparent)',
                        animation: 'pulse-slow 5s ease-in-out 1.5s infinite',
                      }}
                    />
                  </div>
                </div>
                <div className={`${getCardClasses()} backdrop-blur-sm py-3 px-4 text-center border-t transition-colors duration-700`}>
                  <span className={`text-sm ${getTextClasses()} transition-colors duration-700`}>Deep Night</span>
                </div>
              </button>

              {/* Ocean Slow */}
              <button
                onClick={() => setVibe('ocean-slow')}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                  vibe === 'ocean-slow' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102'
                }`}
              >
                <div className="aspect-square relative bg-gradient-to-br from-teal-100 to-blue-100 p-6 flex items-center justify-center">
                  {/* Organic blob with ocean colors */}
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(20, 184, 166, 0.6), rgba(59, 130, 246, 0.4), transparent)',
                        animation: 'wave-drift 6s ease-in-out infinite',
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.5), rgba(56, 189, 248, 0.3), transparent)',
                        animation: 'wave-drift 6s ease-in-out 2s infinite',
                      }}
                    />
                  </div>
                </div>
                <div className={`${getCardClasses()} backdrop-blur-sm py-3 px-4 text-center border-t transition-colors duration-700`}>
                  <span className={`text-sm ${getTextClasses()} transition-colors duration-700`}>Ocean Slow</span>
                </div>
              </button>

              {/* Soft Dawn */}
              <button
                onClick={() => setVibe('soft-dawn')}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                  vibe === 'soft-dawn' 
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/30' 
                    : 'hover:scale-102'
                }`}
              >
                <div className="aspect-square relative bg-gradient-to-br from-pink-50 to-purple-50 p-6 flex items-center justify-center">
                  {/* Organic blob with soft dawn colors */}
                  <div className="relative w-full h-full">
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(251, 207, 232, 0.7), rgba(233, 213, 255, 0.5), transparent)',
                        animation: 'gentle-lift 5s ease-in-out infinite',
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(254, 215, 170, 0.6), rgba(252, 231, 243, 0.4), transparent)',
                        animation: 'gentle-lift 5s ease-in-out 1.5s infinite',
                      }}
                    />
                  </div>
                </div>
                <div className={`${getCardClasses()} backdrop-blur-sm py-3 px-4 text-center border-t transition-colors duration-700`}>
                  <span className={`text-sm ${getTextClasses()} transition-colors duration-700`}>Soft Dawn</span>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 3: Motion */}
          <div className={`${getCardClasses()} backdrop-blur-xl rounded-3xl p-6 border shadow-sm transition-all duration-700`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-lg ${getTextClasses()} mb-1 transition-colors duration-700`}>Background motion</h3>
                <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Soft breathing / wave movement
                </p>
              </div>
              <Switch
                checked={motion}
                onCheckedChange={setMotion}
                className="ml-4"
              />
            </div>
            <p className={`text-xs ${getMutedTextClasses()} mt-4 transition-colors duration-700`}>
              If motion bothers you, turn this off.
            </p>
          </div>

          {/* Soundscape */}
          <div className={`${getCardClasses()} backdrop-blur-xl rounded-3xl p-6 border shadow-sm transition-all duration-700`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg ${getTextClasses()} mb-1 transition-colors duration-700`}>Soundscape</h3>
                <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Gentle ambient audio during calming exercises
                </p>
              </div>
              <Switch
                checked={soundscape}
                onCheckedChange={setSoundscape}
                className="ml-4"
              />
            </div>

            {soundscape && (
              <div className={`flex items-center gap-3 mt-4 pt-4 border-t transition-all duration-700 ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div className="flex items-center gap-1 flex-1">
                  <div 
                    className="w-1 bg-purple-400 rounded-full"
                    style={{ 
                      height: '12px',
                      animation: 'wave-1 1.2s ease-in-out infinite',
                    }}
                  />
                  <div 
                    className="w-1 bg-purple-400 rounded-full"
                    style={{ 
                      height: '20px',
                      animation: 'wave-2 1.2s ease-in-out infinite',
                      animationDelay: '0.1s',
                    }}
                  />
                  <div 
                    className="w-1 bg-purple-400 rounded-full"
                    style={{ 
                      height: '16px',
                      animation: 'wave-3 1.2s ease-in-out infinite',
                      animationDelay: '0.2s',
                    }}
                  />
                  <div 
                    className="w-1 bg-purple-400 rounded-full"
                    style={{ 
                      height: '10px',
                      animation: 'wave-1 1.2s ease-in-out infinite',
                      animationDelay: '0.3s',
                    }}
                  />
                  <div 
                    className="w-1 bg-purple-400 rounded-full"
                    style={{ 
                      height: '18px',
                      animation: 'wave-2 1.2s ease-in-out infinite',
                      animationDelay: '0.4s',
                    }}
                  />
                </div>
                <button
                  onClick={handlePlaySample}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline"
                >
                  Play sample
                </button>
              </div>
            )}
          </div>

          {/* Haptics */}
          <div className={`${getCardClasses()} backdrop-blur-xl rounded-3xl p-6 border shadow-sm transition-all duration-700`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg ${getTextClasses()} mb-1 transition-colors duration-700`}>Haptics</h3>
                <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Tiny vibration to help you match your breath
                </p>
              </div>
              <Switch
                checked={haptics}
                onCheckedChange={setHaptics}
                className="ml-4"
              />
            </div>

            {haptics && (
              <div className={`flex items-center gap-3 mt-4 pt-4 border-t transition-all duration-700 ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400 relative z-10" />
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-purple-400 dark:border-purple-500"
                    style={{ animation: 'ripple-1 2s ease-out infinite' }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-purple-400 dark:border-purple-500"
                    style={{ animation: 'ripple-2 2s ease-out infinite', animationDelay: '0.5s' }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-purple-400 dark:border-purple-500"
                    style={{ animation: 'ripple-3 2s ease-out infinite', animationDelay: '1s' }}
                  />
                </div>
                <span className={`text-sm flex-1 transition-colors duration-700 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Gentle pulses with your rhythm
                </span>
                <button
                  onClick={handleTryHaptic}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline"
                >
                  Try it
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleContinue}
            className="w-full py-6 rounded-full text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all duration-300"
          >
            Continue
          </Button>

          <button
            onClick={handleSkip}
            className={`w-full text-sm transition-colors duration-700 ${
              theme === 'light' 
                ? 'text-gray-600 hover:text-gray-900' 
                : 'text-gray-400 hover:text-gray-100'
            }`}
          >
            Skip for now
          </button>

          <p className={`text-xs text-center leading-relaxed px-4 transition-colors duration-700 ${getMutedTextClasses()}`}>
            You're in control.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-gentle-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          33% {
            transform: translate(15px, -10px) scale(1.03);
            opacity: 0.85;
          }
          66% {
            transform: translate(-10px, 8px) scale(0.97);
            opacity: 0.82;
          }
        }

        @keyframes float-gentle-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          33% {
            transform: translate(-15px, 10px) scale(1.04);
            opacity: 0.78;
          }
          66% {
            transform: translate(10px, -12px) scale(0.96);
            opacity: 0.73;
          }
        }

        @keyframes float-gentle-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(12px, 12px) scale(1.05);
            opacity: 0.72;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes wave-drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(5px, -8px) scale(1.02);
          }
          66% {
            transform: translate(-5px, 8px) scale(0.98);
          }
        }

        @keyframes gentle-lift {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.95;
          }
          50% {
            transform: translateY(-5px) scale(1.03);
            opacity: 1;
          }
        }

        @keyframes wave-1 {
          0%, 100% {
            height: 12px;
          }
          50% {
            height: 8px;
          }
        }

        @keyframes wave-2 {
          0%, 100% {
            height: 20px;
          }
          50% {
            height: 12px;
          }
        }

        @keyframes wave-3 {
          0%, 100% {
            height: 16px;
          }
          50% {
            height: 10px;
          }
        }

        @keyframes ripple-1 {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes ripple-2 {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes ripple-3 {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
