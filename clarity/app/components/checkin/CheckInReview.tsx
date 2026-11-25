import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { Heart, Activity, MapPin, Target, ChevronDown, ChevronUp, Sparkles, Home, ArrowLeft } from 'lucide-react';

export function CheckInReview() {
  const { setScreen, currentCheckIn, userProfile, pushNavigation } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0;
    let total = currentCheckIn.compassQuadrant ? 3 : 4; // emotions, activation, body, domains

    if (currentCheckIn.compassQuadrant) completed++;
    else if (currentCheckIn.emotions && currentCheckIn.emotions.length > 0) completed++;
    if (!currentCheckIn.compassQuadrant && currentCheckIn.activation !== undefined) completed++;
    if (currentCheckIn.bodyZones && currentCheckIn.bodyZones.length > 0) completed++;
    if (currentCheckIn.lifeDomains && currentCheckIn.lifeDomains.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  const handleEditSection = (section: string) => {
    pushNavigation('check-in-review');
    switch (section) {
      case 'emotions':
        setScreen('emotions-select');
        break;
      case 'activation':
        setScreen('emotions-activation');
        break;
      case 'body':
        setScreen(currentCheckIn.compassQuadrant ? 'compass-body' : 'emotions-body');
        break;
      case 'domains':
        setScreen(currentCheckIn.compassQuadrant ? 'compass-domain' : 'emotions-domain');
        break;
    }
  };

  const handleShowRecommendations = () => {
    setScreen('options-choice');
  };

  const handleViewAllOptions = () => {
    setScreen('options-choice');
  };

  const getActivationLabel = (activation: number) => {
    const labels: Record<number, string> = {
      '0': 'Completely shut down',
      '1': 'Very numb',
      '2': 'Disconnected',
      '3': 'Low energy',
      '4': 'A bit flat',
      '5': 'Balanced',
      '6': 'Present',
      '7': 'Engaged',
      '8': 'Energized',
      '9': 'Very activated',
      '10': 'Overwhelmed',
    };
    return labels[activation] || 'Not set';
  };

  const getPersonalizedReflection = () => {
    const emotions = currentCheckIn.emotions || [];
    const activation = currentCheckIn.activation;
    const domains = currentCheckIn.lifeDomains || [];

    // Context-aware reflections
    if (emotions.includes('proud') || emotions.includes('confident') || emotions.includes('capable')) {
      return "I see you're feeling proud and capable right now. That's wonderful to acknowledge.";
    }
    
    if (activation !== undefined) {
      const level = activation - 5; // Convert back to -5 to +5
      if (level <= -3 && level >= -5) {
        return "I notice you're feeling quite shut down and low energy. It's okay to feel this way.";
      }
      if (level >= 3 && level <= 5) {
        return "I see you're feeling highly activated and energized right now.";
      }
      if (emotions.includes('anxious') || emotions.includes('overwhelmed')) {
        return "I see you're feeling on guard and wired. You're not alone in this.";
      }
    }

    if (emotions.length > 3) {
      return "I see you're experiencing a mix of emotions right now. That's completely valid.";
    }

    return "Thank you for checking in with yourself today.";
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} transition-colors duration-700`}>
      <div className="max-w-3xl mx-auto p-6 py-8 space-y-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('check-in-choice')}
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

        {currentCheckIn.compassQuadrant && <button className={`${getCardClasses()} rounded-3xl p-6 w-full text-left`} onClick={() => { pushNavigation('check-in-review'); setScreen('compass-map'); }}>
          <span className={`text-sm ${getSubtextClasses()}`}>Compass · tap to edit</span>
          <p className={getTextClasses()}>{currentCheckIn.compassQuadrant.replace('high-', 'High energy / ').replace('low-', 'Low energy / ')}</p>
        </button>}
        {/* Title */}
        <div className="space-y-3 text-center">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            Your Holistic Assessment
          </h2>
          <p className={`${getSubtextClasses()} transition-colors duration-700`}>
            Review your complete emotional and physical state
          </p>
        </div>

        {/* Completion Card */}
        <div className={`${getCardClasses()} rounded-3xl p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${getSubtextClasses()}`}>{currentCheckIn.compassQuadrant ? 'Compass check-in completion' : 'Assessment Completion'}</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {completion}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className={`text-xs ${getSubtextClasses()}`}>
              {currentCheckIn.compassQuadrant ? 'Based on compass position, body zones and life domains.' : 'More data provides better insights'}
            </p>
          </div>
        </div>

        {/* Assessment Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Emotions */}
          <button
            onClick={() => handleEditSection('emotions')}
            className={`${getCardClasses()} rounded-2xl p-5 text-left hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <span className={`font-medium ${getTextClasses()}`}>Emotions</span>
            </div>
            {currentCheckIn.emotions && currentCheckIn.emotions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {currentCheckIn.emotions.slice(0, 3).map((emotion) => (
                  <span key={emotion} className="text-sm px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">
                    {emotion}
                  </span>
                ))}
                {currentCheckIn.emotions.length > 3 && (
                  <span className="text-sm px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">
                    +{currentCheckIn.emotions.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <p className={`text-sm ${getSubtextClasses()}`}>{currentCheckIn.compassQuadrant ? 'Optional on the compass path' : 'Not selected'}</p>
            )}
          </button>

          {/* Activation Level */}
          <button
            onClick={() => handleEditSection('activation')}
            className={`${getCardClasses()} rounded-2xl p-5 text-left hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className={`font-medium ${getTextClasses()}`}>Activation Level</span>
            </div>
            {currentCheckIn.activation !== undefined ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {currentCheckIn.activation - 5}/10
                </div>
                <p className={`text-sm ${getSubtextClasses()}`}>
                  {getActivationLabel(currentCheckIn.activation)}
                </p>
              </div>
            ) : (
              <p className={`text-sm ${getSubtextClasses()}`}>{currentCheckIn.compassQuadrant ? 'Optional on the compass path' : 'Not selected'}</p>
            )}
          </button>

          {/* Body Sensations */}
          <button
            onClick={() => handleEditSection('body')}
            className={`${getCardClasses()} rounded-2xl p-5 text-left hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className={`font-medium ${getTextClasses()}`}>Body Sensations</span>
            </div>
            {currentCheckIn.bodyZones && currentCheckIn.bodyZones.length > 0 ? (
              <p className={`text-sm ${getTextClasses()}`}>
                {currentCheckIn.bodyZones.length} area{currentCheckIn.bodyZones.length !== 1 ? 's' : ''} mapped
              </p>
            ) : (
              <p className={`text-sm ${getSubtextClasses()}`}>No body areas mapped</p>
            )}
          </button>

          {/* Wellness Dimensions */}
          <button
            onClick={() => handleEditSection('domains')}
            className={`${getCardClasses()} rounded-2xl p-5 text-left hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className={`font-medium ${getTextClasses()}`}>Wellness Dimensions</span>
            </div>
            {currentCheckIn.lifeDomains && currentCheckIn.lifeDomains.length > 0 ? (
              <p className={`text-sm ${getTextClasses()}`}>
                {currentCheckIn.lifeDomains.length} dimension{currentCheckIn.lifeDomains.length !== 1 ? 's' : ''} connected
              </p>
            ) : (
              <p className={`text-sm ${getSubtextClasses()}`}>No dimensions connected</p>
            )}
          </button>
        </div>

        {/* Quick Recommendations */}
        <div className={`${getCardClasses()} rounded-3xl overflow-hidden`}>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className={`font-medium ${getTextClasses()}`}>Quick Recommendations</span>
            </div>
            {showRecommendations ? (
              <ChevronUp className={`w-5 h-5 ${getSubtextClasses()}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${getSubtextClasses()}`} />
            )}
          </button>
          
          {showRecommendations && (
            <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-sm ${getSubtextClasses()} mb-4`}>
                {getPersonalizedReflection()}
              </p>
              <p className={`text-sm ${getSubtextClasses()}`}>
                Click to view personalized recommendations based on your assessment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${getCardClasses()} border-t p-3 sm:p-6 shadow-lg backdrop-blur-xl`}>
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-2 sm:gap-3">
          <Button
            onClick={handleShowRecommendations}
            variant="outline"
            className="h-auto min-h-[44px] whitespace-normal px-2 py-2.5 text-sm leading-tight sm:px-5 sm:py-4 sm:text-lg rounded-full border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400"
          >
            <Sparkles className="hidden sm:block w-5 h-5 mr-2" />
            Show Recommendations
          </Button>
          <Button
            onClick={handleViewAllOptions}
            className="h-auto min-h-[44px] whitespace-normal px-2 py-2.5 text-sm leading-tight sm:px-5 sm:py-4 sm:text-lg rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            View All Options
          </Button>
        </div>
      </div>
    </div>
  );
}
