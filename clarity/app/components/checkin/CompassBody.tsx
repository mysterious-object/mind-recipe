import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { BodyMap } from '../BodyMap';
import { BodyZone } from '../../types';

export function CompassBody() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, popNavigation } = useApp();
  const [bodyZones, setBodyZones] = useState<BodyZone[]>(currentCheckIn.bodyZones || []);

  // Determine activation level based on compass quadrant
  const getActivationFromQuadrant = () => {
    if (!currentCheckIn.compassQuadrant) return 'medium';
    if (currentCheckIn.compassQuadrant.includes('high')) return 'high';
    return 'low';
  };

  const toggleZone = (zone: BodyZone) => {
    setBodyZones(prev =>
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const handleNext = () => {
    updateCurrentCheckIn({ bodyZones });
    setScreen(popNavigation() ?? 'compass-domain');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          onClick={() => setScreen('compass-map')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100">
            Where do you feel this most in your body?
          </h2>
        </div>

        <BodyMap
          selectedZones={bodyZones}
          onZoneToggle={toggleZone}
          activationLevel={getActivationFromQuadrant()}
        />

        <Button
          onClick={handleNext}
          disabled={bodyZones.length === 0}
          className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
