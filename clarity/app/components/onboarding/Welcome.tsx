import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import brandMark from '../../../../flutter/assets/branding/mind-recipe-mark.png';

export function Welcome() {
  const { setScreen } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getMutedTextClasses } = useTheme();

  const handleStart = () => {

    setScreen('onboarding-you');
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} flex items-center justify-center p-8 relative overflow-hidden transition-colors duration-700`}>
      {/* Layered Organic Aura Background - Very Slow Motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 - Primary purple aura */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.1), transparent)',
            animation: 'float-gentle-1 20s ease-in-out infinite',
          }}
        />
        {/* Blob 2 - Secondary indigo aura */}
        <div 
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08), transparent)',
            animation: 'float-gentle-2 25s ease-in-out infinite',
            animationDelay: '5s',
          }}
        />
        {/* Blob 3 - Tertiary soft violet aura */}
        <div 
          className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1), transparent)',
            animation: 'float-gentle-3 30s ease-in-out infinite',
            animationDelay: '10s',
          }}
        />
      </div>

      <div className="max-w-md w-full space-y-12 relative z-10">
        {/* Logo / App Name */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg">
            <img src={brandMark} alt="" className="w-full h-full rounded-full object-cover" />
          </div>
          <h1 className={`text-5xl tracking-tight ${getTextClasses()} transition-colors duration-700`}>
            Welcome to MindRecipe
          </h1>
          <p className={getSubtextClasses()}>by Context Field</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-center">
          {/* Description */}
          <div className="space-y-4 px-2">
            <p className={`text-lg ${getTextClasses()} leading-relaxed transition-colors duration-700`}>
              MindRecipe helps you notice what you're feeling, where you feel it in your body, and what might help next.
            </p>
            
            {/* Reassurance line */}
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              You're in control. You can skip anything.
            </p>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-7 rounded-full text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all duration-300 text-white flex items-center justify-center"
            >
              Okay, let's start
            </button>
          </div>

          {/* Legal / Safety Block - Small, Separated */}
          <div className="pt-8 px-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className={`text-xs ${getMutedTextClasses()} leading-relaxed transition-colors duration-700`}>
              MindRecipe is a wellness support app.<br />
              MindRecipe isn't therapy, medical care, or emergency response.<br />
              If you're in danger or think you might hurt yourself or someone else, please contact emergency services or a crisis hotline.
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations - Extremely Slow */}
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
      `}</style>
    </div>
  );
}
