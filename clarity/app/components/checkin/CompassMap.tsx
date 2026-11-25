import { haptic } from '../../host';
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { ArrowLeft, AlertCircle, Volume2, VolumeX, Vibrate } from 'lucide-react';

interface CompassDot {
  id: string;
  x: number; // -1 to 1 (Protective to Connected)
  y: number; // -1 to 1 (High to Low energy)
}

export function CompassMap() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, setShowCrisisModal, userProfile, popNavigation } = useApp();
  const [dots, setDots] = useState<CompassDot[]>(currentCheckIn.compassPoint ? [{ id: 'restored', ...currentCheckIn.compassPoint }] : []);
  const compassRef = useRef<HTMLDivElement>(null);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Get feedback based on the most intense dot
  const getFeedback = (dots: CompassDot[]) => {
    if (dots.length === 0) return null;

    // Find dot with highest absolute energy (furthest from center vertically)
    const mostIntenseDot = dots.reduce((prev, current) => {
      return Math.abs(current.y) > Math.abs(prev.y) ? current : prev;
    });

    const { x, y } = mostIntenseDot;
    const isProtective = x > 0;
    const isHighEnergy = y < 0; // Note: y is inverted (top is negative)

    if (isHighEnergy && isProtective) {
      return "You're activated and braced. Watching, maybe ready to defend or react. That's a protection response.";
    } else if (!isHighEnergy && isProtective) {
      return "Low energy and guarded, maybe checked out or frozen. Your body's trying to keep you safe by shutting things down.";
    } else if (isHighEnergy && !isProtective) {
      return "You feel energized and engaged. Alert, motivated, charged.";
    } else {
      return "You feel soft and tired in a safe way. Coming down, letting go.";
    }
  };

  const getQuadrantLabel = (x: number, y: number) => {
    const isProtective = x > 0;
    const isHighEnergy = y < 0;

    if (isHighEnergy && isProtective) return "amped / on guard";
    if (!isHighEnergy && isProtective) return "numb / shut down";
    if (isHighEnergy && !isProtective) return "buzzing / engaged";
    return "soft / tired-safe";
  };

  const handleCompassClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compassRef.current) return;

    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Get click position relative to center
    const clickX = e.clientX - rect.left - centerX;
    const clickY = e.clientY - rect.top - centerY;
    
    // Convert to -1 to 1 range
    const normalizedX = Math.max(-1, Math.min(1, clickX / (centerX * 0.9)));
    const normalizedY = Math.max(-1, Math.min(1, clickY / (centerY * 0.9)));
    
    // Create new dot
    const newDot: CompassDot = {
      id: Date.now().toString(),
      x: normalizedX,
      y: normalizedY,
    };

    setDots(prev => [...prev, newDot]);

    // Calculate pulse intensity based on energy level
    const energyLevel = Math.abs(normalizedY);
    setPulseIntensity(energyLevel);

    // Haptic feedback if enabled
    if (userProfile.haptics) {
      const isHighEnergy = normalizedY < 0;
      if (isHighEnergy) {
        // Sharper buzz for high energy
        haptic();
      } else {
        // Softer thud for low energy
        haptic();
      }
    }

    // Determine quadrant for context storage
    const isProtective = normalizedX > 0;
    const isHighEnergy = normalizedY < 0;
    let quadrant: 'high-protected' | 'low-protected' | 'high-open' | 'low-open';
    
    if (isHighEnergy && isProtective) quadrant = 'high-protected';
    else if (!isHighEnergy && isProtective) quadrant = 'low-protected';
    else if (isHighEnergy && !isProtective) quadrant = 'high-open';
    else quadrant = 'low-open';

    updateCurrentCheckIn({ compassQuadrant: quadrant, compassPoint: { x: normalizedX, y: normalizedY } });
  };

  const handleNext = () => {
    if (dots.length > 0) {
      setScreen(popNavigation() ?? 'compass-body');
    }
  };

  const feedback = getFeedback(dots);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <div className="max-w-2xl mx-auto p-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('check-in-choice')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Atmosphere settings indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {userProfile.soundscape ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {userProfile.haptics && <Vibrate className="w-4 h-4" />}
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100">
            Where are you right now?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Put a dot where you feel yourself. Add another if you're split.
          </p>
        </div>

        {/* Compass */}
        <div className="relative">
          {/* Vertical axis label */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            High Energy
          </div>

          <div className="grid grid-cols-2 items-center gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,28rem)_minmax(0,1fr)]">
            {/* Horizontal axis labels */}
            <div 
              className="text-sm text-gray-500 dark:text-gray-400 sm:col-start-1 sm:row-start-1 sm:text-right sm:pr-1"
            >
              Connected
            </div>
            
            <div 
              className="text-right text-sm text-gray-500 dark:text-gray-400 sm:col-start-3 sm:row-start-1 sm:text-left sm:pl-1"
            >
              Protective
            </div>

            {/* Compass circle */}
            <div
              ref={compassRef}
              onClick={handleCompassClick}
              className="relative col-span-2 justify-self-center w-full aspect-square max-w-md cursor-crosshair sm:col-span-1 sm:col-start-2 sm:row-start-1"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
              }}
            >
              {/* Pulsing outer glow */}
              <div
                className="absolute inset-0 rounded-full border-4 border-purple-300 dark:border-purple-600 transition-all duration-1000"
                style={{
                  animation: `pulse-compass ${2 - pulseIntensity}s ease-in-out infinite`,
                  opacity: 0.3 + pulseIntensity * 0.4,
                }}
              />

              {/* Inner circle */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" />

              {/* Center cross lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600 -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 dark:bg-gray-600 -translate-y-1/2" />

              {/* Quadrant labels */}
              <div className="absolute top-[15%] right-[15%] text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">
                amped / on guard
              </div>
              <div className="absolute top-[15%] left-[15%] text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">
                buzzing / engaged
              </div>
              <div className="absolute bottom-[15%] left-[15%] text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">
                soft / tired-safe
              </div>
              <div className="absolute bottom-[15%] right-[15%] text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80px]">
                numb / shut down
              </div>

              {/* Placed dots */}
              {dots.map((dot) => {
                const posX = ((dot.x + 1) / 2) * 100; // Convert -1,1 to 0,100%
                const posY = ((dot.y + 1) / 2) * 100;
                const isHighEnergy = dot.y < 0;
                
                return (
                  <div
                    key={dot.id}
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                    }}
                  >
                    <div 
                      className={`w-full h-full rounded-full ${
                        isHighEnergy 
                          ? 'bg-purple-600 dark:bg-purple-400' 
                          : 'bg-purple-400 dark:bg-purple-500'
                      }`}
                      style={{
                        boxShadow: `0 0 ${isHighEnergy ? '20px' : '12px'} ${
                          isHighEnergy 
                            ? 'rgba(139, 92, 246, 0.6)' 
                            : 'rgba(139, 92, 246, 0.3)'
                        }`,
                        animation: `pulse-dot ${isHighEnergy ? '1s' : '2s'} ease-in-out infinite`,
                      }}
                    />
                  </div>
                );
              })}

              {/* Center point indicator */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Bottom axis label */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Low Energy
          </div>
        </div>

        {/* Dynamic feedback */}
        {feedback && (
          <div className="bg-purple-100/50 dark:bg-purple-900/20 rounded-3xl p-6 space-y-2">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {feedback}
            </p>
          </div>
        )}

        {/* Instructions */}
        {dots.length === 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Tap anywhere in the compass to place a dot
          </div>
        )}

        {/* Clear dots button */}
        {dots.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setDots([])}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all dots
            </button>
          </div>
        )}

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={dots.length === 0}
          className="w-full py-6 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
        >
          Next
        </Button>

        {/* Crisis support button */}
        <div className="text-center">
          <button
            onClick={() => setShowCrisisModal(true)}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-2 mx-auto"
          >
            <AlertCircle className="w-4 h-4" />
            I need help now
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse-compass {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
