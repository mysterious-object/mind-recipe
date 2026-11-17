import React from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { AppShell } from './AppShell';
import { 
  Activity
} from 'lucide-react';
import { CompassQuadrant } from '../types';

export function Home() {
  const { setScreen, userProfile, checkInHistory } = useApp();
  const { getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const displayName = userProfile.name || 'friend';


  // Get last check-in for personalization
  const lastCheckIn = checkInHistory.length > 0 ? checkInHistory[0] : null;
  const lastQuadrant = lastCheckIn?.compassQuadrant;
  const lastEmotions = lastCheckIn?.emotions || [];

  // Get aura properties based on last state
  const getAuraProperties = (quadrant?: CompassQuadrant) => {
    if (!quadrant) {
      return {
        blob1: 'rgba(139, 92, 246, 0.25)',
        blob2: 'rgba(99, 102, 241, 0.2)',
        blob3: 'rgba(168, 85, 247, 0.15)',
        pulse: '6s',
        orbs: [
          { color: 'rgba(139, 92, 246, 0.6)', size: 8 },
          { color: 'rgba(99, 102, 241, 0.5)', size: 6 },
          { color: 'rgba(168, 85, 247, 0.4)', size: 10 },
        ],
      };
    }

    switch (quadrant) {
      case 'high-protected':
        return {
          blob1: 'rgba(251, 191, 36, 0.3)',
          blob2: 'rgba(239, 68, 68, 0.2)',
          blob3: 'rgba(217, 119, 6, 0.25)',
          pulse: '3.5s',
          orbs: [
            { color: 'rgba(251, 191, 36, 0.7)', size: 10 },
            { color: 'rgba(245, 158, 11, 0.6)', size: 7 },
          ],
        };
      case 'low-protected':
        return {
          blob1: 'rgba(139, 92, 246, 0.15)',
          blob2: 'rgba(75, 85, 99, 0.2)',
          blob3: 'rgba(107, 114, 128, 0.18)',
          pulse: '8s',
          orbs: [
            { color: 'rgba(139, 92, 246, 0.4)', size: 6 },
            { color: 'rgba(107, 114, 128, 0.5)', size: 8 },
          ],
        };
      case 'high-open':
        return {
          blob1: 'rgba(251, 146, 60, 0.25)',
          blob2: 'rgba(252, 211, 77, 0.22)',
          blob3: 'rgba(251, 113, 133, 0.2)',
          pulse: '4s',
          orbs: [
            { color: 'rgba(251, 146, 60, 0.7)', size: 7 },
            { color: 'rgba(252, 211, 77, 0.6)', size: 9 },
            { color: 'rgba(251, 113, 133, 0.5)', size: 6 },
          ],
        };
      case 'low-open':
        return {
          blob1: 'rgba(94, 234, 212, 0.22)',
          blob2: 'rgba(59, 130, 246, 0.18)',
          blob3: 'rgba(167, 243, 208, 0.2)',
          pulse: '7s',
          orbs: [
            { color: 'rgba(94, 234, 212, 0.6)', size: 8 },
            { color: 'rgba(167, 243, 208, 0.5)', size: 7 },
          ],
        };
      default:
        return {
          blob1: 'rgba(139, 92, 246, 0.25)',
          blob2: 'rgba(99, 102, 241, 0.2)',
          blob3: 'rgba(168, 85, 247, 0.15)',
          pulse: '6s',
          orbs: [
            { color: 'rgba(139, 92, 246, 0.6)', size: 8 },
            { color: 'rgba(99, 102, 241, 0.5)', size: 6 },
            { color: 'rgba(168, 85, 247, 0.4)', size: 10 },
          ],
        };
    }
  };

  const auraProps = getAuraProperties(lastQuadrant);

  return (
    <AppShell title="Home" showBack={false}>
      <div className="max-w-2xl mx-auto px-6 py-8 pb-32 space-y-8">
        {/* Hero Block with Greeting + Aura */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          {/* Layered Organic Aura Background - respects motion preference */}
          <div className="absolute inset-0 overflow-hidden">
            {userProfile.motion ? (
              <>
                <div 
                  className="absolute -top-10 left-1/4 w-80 h-80 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${auraProps.blob1}, transparent)`,
                    animation: `float-blob-1 ${auraProps.pulse} ease-in-out infinite`,
                  }}
                />
                <div 
                  className="absolute top-5 right-1/4 w-64 h-64 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${auraProps.blob2}, transparent)`,
                    animation: `float-blob-2 ${parseFloat(auraProps.pulse) * 1.3}s ease-in-out infinite`,
                    animationDelay: '1s',
                  }}
                />
                <div 
                  className="absolute top-20 left-1/2 w-56 h-56 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${auraProps.blob3}, transparent)`,
                    animation: `float-blob-3 ${parseFloat(auraProps.pulse) * 1.5}s ease-in-out infinite`,
                    animationDelay: '2s',
                  }}
                />
                
                {auraProps.orbs.map((orb, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full blur-sm"
                    style={{
                      width: `${orb.size}px`,
                      height: `${orb.size}px`,
                      backgroundColor: orb.color,
                      top: `${20 + index * 20}%`,
                      left: `${15 + index * 25}%`,
                      animation: `drift-orb-${index + 1} ${10 + index * 3}s ease-in-out infinite`,
                      animationDelay: `${index * 2}s`,
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                <div 
                  className="absolute -top-10 left-1/4 w-80 h-80 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${auraProps.blob1}, transparent)`,
                  }}
                />
                <div 
                  className="absolute top-5 right-1/4 w-64 h-64 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${auraProps.blob2}, transparent)`,
                  }}
                />
                <div 
                  className="absolute top-20 left-1/2 w-56 h-56 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${auraProps.blob3}, transparent)`,
                  }}
                />
              </>
            )}
          </div>

          {/* Greeting Text */}
          <div className="relative z-10 text-center space-y-2">
            <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
              Hey, {displayName}
            </h2>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              {lastEmotions.length > 0 
                ? `Last time you felt ${lastEmotions[0].toLowerCase()}.`
                : 'Let\'s check in when you\'re ready.'}
            </p>
          </div>
        </div>

        {/* Primary Card: Check in */}
        <button
          type="button"
          onClick={() => {

            setScreen('check-in-choice');
          }}
          className={`w-full ${getCardClasses()} rounded-[1.25rem] p-8 shadow-lg border backdrop-blur-xl transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] text-left`}
        >
          {/* Soft body outline visual */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                Check in
              </h3>
              <p className={`${getSubtextClasses()} transition-colors duration-700`}>
                Let's check where you're at right now.
              </p>
              <p className={`text-sm ${getSubtextClasses()} opacity-70 transition-colors duration-700 leading-relaxed`}>
                We'll notice feelings, body signals, and what's weighing on you. You can stop to steady, shift, or log at any time.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 10px) scale(0.9); }
        }

        @keyframes float-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 15px) scale(1.05); }
          66% { transform: translate(20px, -30px) scale(0.95); }
        }

        @keyframes float-blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 25px) scale(1.08); }
        }

        @keyframes drift-orb-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(40px, 30px); opacity: 0.9; }
        }

        @keyframes drift-orb-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(-30px, 40px); opacity: 0.8; }
        }

        @keyframes drift-orb-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(50px, -20px); opacity: 0.7; }
        }
      `}</style>
    </AppShell>
  );
}
