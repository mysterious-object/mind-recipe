import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { ArrowLeft, Wind, Sparkles, BookOpen, Check, Heart, Compass, Activity, User, Dumbbell, Users, Sparkles as SparklesIcon, Briefcase, Brain, Home, DollarSign } from 'lucide-react';

const AFFIRMATIONS = [
  "Of course this feels like a lot.",
  "Your reaction makes sense.",
  "Nothing about this makes you weak.",
  "It's valid to feel this way.",
  "You're not overreacting.",
  "It's okay to need support here.",
  "Anyone in your position could feel this way.",
  "You don't have to apologize for this.",
];

export function Summary() {
  const { setScreen, currentCheckIn, setShowCrisisModal, userProfile } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();

  // Get a random affirmation that stays consistent for this session
  const affirmation = useMemo(() => {
    const index = Math.floor(Math.random() * AFFIRMATIONS.length);
    return AFFIRMATIONS[index];
  }, []);

  const getSummaryText = () => {
    // Build a more coherent narrative based on what the user shared
    const hasEmotions = currentCheckIn.emotions && currentCheckIn.emotions.length > 0;
    const hasBody = currentCheckIn.bodyZones && currentCheckIn.bodyZones.length > 0;
    const hasDomains = currentCheckIn.lifeDomains && currentCheckIn.lifeDomains.length > 0;
    const hasActivation = currentCheckIn.activation !== undefined;

    // Start with emotional state
    let summary = '';
    
    if (hasEmotions) {
      const emotionCount = currentCheckIn.emotions!.length;
      const emotionWords = currentCheckIn.emotions!.slice(0, 3);
      
      if (emotionCount === 1) {
        summary = `I hear you're feeling ${emotionWords[0]} right now`;
      } else if (emotionCount === 2) {
        summary = `I hear you're experiencing ${emotionWords[0]} and ${emotionWords[1]}`;
      } else {
        summary = `I hear you're experiencing ${emotionWords.slice(0, -1).join(', ')}, and ${emotionWords[emotionWords.length - 1]}—plus ${emotionCount - 3} other feelings`;
      }
    } else {
      summary = "I hear there's a lot happening for you right now";
    }

    // Add body sensations if present
    if (hasBody) {
      const zones = currentCheckIn.bodyZones.filter(z => z !== 'numb');
      const isNumb = currentCheckIn.bodyZones.includes('numb');
      
      if (zones.length > 0) {
        const zoneNames = zones.map(z => {
          if (z === 'head') return 'your head';
          if (z === 'throat') return 'your throat';
          if (z === 'chest') return 'your chest';
          if (z === 'stomach') return 'your stomach';
          if (z === 'pelvis') return 'your pelvis';
          if (z === 'limbs') return 'your arms and legs';
          return z;
        });
        
        if (zones.length === 1) {
          summary += `, and you're sensing it in ${zoneNames[0]}`;
        } else if (zones.length === 2) {
          summary += `, and you're sensing it in ${zoneNames[0]} and ${zoneNames[1]}`;
        } else {
          summary += `, and you're sensing it throughout ${zoneNames.slice(0, -1).join(', ')}, and ${zoneNames[zoneNames.length - 1]}`;
        }
      } else if (isNumb) {
        summary += `, though parts of you feel numb or shut down`;
      }
    }

    // Connect to life domains
    if (hasDomains) {
      const domains = currentCheckIn.lifeDomains.map(d => {
        if (d === 'occupational') return 'work';
        if (d === 'financial') return 'money and finances';
        if (d === 'social') return 'your relationships';
        if (d === 'physical') return 'your physical health';
        if (d === 'emotional') return 'emotional processing';
        if (d === 'intellectual') return 'mental engagement';
        if (d === 'environmental') return 'your environment';
        if (d === 'spiritual') return 'spiritual life';
        return d;
      });
      
      if (domains.length === 1) {
        summary += `. This seems connected to ${domains[0]}`;
      } else if (domains.length === 2) {
        summary += `. This seems connected to ${domains[0]} and ${domains[1]}`;
      } else {
        summary += `. This seems connected to multiple areas of your life: ${domains.slice(0, -1).join(', ')}, and ${domains[domains.length - 1]}`;
      }
    }

    summary += '. ';

    // Add compassionate close
    if (hasEmotions || hasBody || hasDomains) {
      summary += "That's a lot to be carrying. You don't have to hold all of this alone.";
    } else {
      summary += "Whatever you're going through, you don't have to navigate it alone.";
    }

    return summary;
  };

  const isHighActivation = () => {
    return currentCheckIn.activationType === 'too-much' ||
           currentCheckIn.compassQuadrant?.includes('high-protected');
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          type="button"
          onClick={() => setScreen(currentCheckIn.emotions ? 'emotions-domain' : 'compass-domain')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-2">
          <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
            What I'm hearing
          </h2>
        </div>

        {/* Visual Check-in Summary */}
        <div className={`${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 shadow-lg space-y-4`}>
          {/* Path indicator */}
          <div className="flex items-center gap-2">
            {currentCheckIn.emotions ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                </div>
                <span className={`text-sm ${getSubtextClasses()}`}>Emotions Check-in</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center">
                  <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`text-sm ${getSubtextClasses()}`}>Compass Check-in</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emotions/State */}
            <div className="space-y-2">
              <div className={`text-xs uppercase tracking-wide ${getSubtextClasses()} opacity-60`}>
                {currentCheckIn.emotions ? 'Emotions' : 'Quadrant'}
              </div>
              <div className="flex flex-wrap gap-2">
                {currentCheckIn.emotions && currentCheckIn.emotions.length > 0 ? (
                  currentCheckIn.emotions!.slice(0, 4).map((emotion, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-sm bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 text-pink-900 dark:text-pink-100"
                    >
                      {emotion}
                    </span>
                  ))
                ) : currentCheckIn.compassQuadrant ? (
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    currentCheckIn.compassQuadrant === 'high-protected' ? 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 text-red-900 dark:text-red-100' :
                    currentCheckIn.compassQuadrant === 'low-protected' ? 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-900 dark:text-gray-100' :
                    currentCheckIn.compassQuadrant === 'high-open' ? 'bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/40 text-orange-900 dark:text-orange-100' :
                    'bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-900 dark:text-teal-100'
                  }`}>
                    {currentCheckIn.compassQuadrant === 'high-protected' ? 'High Energy / Protected' :
                     currentCheckIn.compassQuadrant === 'low-protected' ? 'Low Energy / Protected' :
                     currentCheckIn.compassQuadrant === 'high-open' ? 'High Energy / Open' :
                     'Low Energy / Open'}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Activation Level */}
            {currentCheckIn.activation !== undefined && (
              <div className="space-y-2">
                <div className={`text-xs uppercase tracking-wide ${getSubtextClasses()} opacity-60`}>
                  Nervous System
                </div>
                <div className="flex items-center gap-3">
                  {(() => {
                    const level = currentCheckIn.activation - 5; // Convert 0-10 back to -5 to +5
                    const getActivationColor = () => {
                      if (level === 0) return 'from-green-400 to-teal-400';
                      if (level < 0) {
                        if (level <= -4) return 'from-gray-400 to-slate-500';
                        if (level <= -2) return 'from-blue-300 to-gray-400';
                        return 'from-cyan-400 to-blue-400';
                      } else {
                        if (level <= 2) return 'from-yellow-400 to-orange-400';
                        if (level <= 4) return 'from-orange-400 to-red-400';
                        return 'from-red-500 to-rose-600';
                      }
                    };
                    const getActivationLabel = () => {
                      if (level === 0) return 'Manageable';
                      if (level < 0) return level <= -3 ? 'Shut down' : 'Low energy';
                      return level >= 4 ? 'Overwhelmed' : level >= 3 ? 'Intense' : 'Heightened';
                    };
                    return (
                      <>
                        <div 
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getActivationColor()} flex items-center justify-center shadow-md`}
                        >
                          <span className="text-white font-bold text-sm">
                            {level > 0 ? `+${level}` : level}
                          </span>
                        </div>
                        <span className={`text-sm ${getTextClasses()}`}>
                          {getActivationLabel()}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Body Zones */}
            {currentCheckIn.bodyZones && currentCheckIn.bodyZones.length > 0 && (
              <div className="space-y-2">
                <div className={`text-xs uppercase tracking-wide ${getSubtextClasses()} opacity-60`}>
                  Body Sensations
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentCheckIn.bodyZones.map((zone, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-900 dark:text-purple-100"
                    >
                      {zone === 'head' ? 'Head' :
                       zone === 'throat' ? 'Throat' :
                       zone === 'chest' ? 'Chest' :
                       zone === 'stomach' ? 'Stomach' :
                       zone === 'pelvis' ? 'Pelvis' :
                       zone === 'limbs' ? 'Arms/Legs' :
                       'Numb'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Life Domains */}
            {currentCheckIn.lifeDomains && currentCheckIn.lifeDomains.length > 0 && (
              <div className="space-y-2">
                <div className={`text-xs uppercase tracking-wide ${getSubtextClasses()} opacity-60`}>
                  Life Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentCheckIn.lifeDomains.map((domain, idx) => {
                    const getDomainConfig = () => {
                      switch (domain) {
                        case 'emotional': return { icon: Heart, color: 'from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40', text: 'text-pink-900 dark:text-pink-100', label: 'Emotional' };
                        case 'physical': return { icon: Dumbbell, color: 'from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40', text: 'text-red-900 dark:text-red-100', label: 'Physical' };
                        case 'social': return { icon: Users, color: 'from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40', text: 'text-blue-900 dark:text-blue-100', label: 'Social' };
                        case 'spiritual': return { icon: SparklesIcon, color: 'from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40', text: 'text-purple-900 dark:text-purple-100', label: 'Spiritual' };
                        case 'occupational': return { icon: Briefcase, color: 'from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40', text: 'text-orange-900 dark:text-orange-100', label: 'Work' };
                        case 'intellectual': return { icon: Brain, color: 'from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40', text: 'text-green-900 dark:text-green-100', label: 'Intellectual' };
                        case 'environmental': return { icon: Home, color: 'from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40', text: 'text-teal-900 dark:text-teal-100', label: 'Environment' };
                        case 'financial': return { icon: DollarSign, color: 'from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40', text: 'text-yellow-900 dark:text-yellow-100', label: 'Financial' };
                        default: return { icon: Activity, color: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700', text: 'text-gray-900 dark:text-gray-100', label: domain };
                      }
                    };
                    const config = getDomainConfig();
                    const Icon = config.icon;
                    return (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-full text-xs bg-gradient-to-br ${config.color} ${config.text} flex items-center gap-1.5`}
                      >
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <div className={`${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 space-y-4 shadow-lg`}>
          <p className={`text-lg ${getTextClasses()} leading-relaxed transition-colors duration-700`}>
            {getSummaryText()}
          </p>
          
          {/* Validating affirmation */}
          <p className={`text-base ${getSubtextClasses()} italic transition-colors duration-700`}>
            {affirmation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => setScreen('steady-me')}
            className={`w-full ${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 text-left hover:shadow-xl transition-all shadow-lg space-y-2`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-200 dark:from-teal-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center shadow-md">
                <Wind className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <div className={`text-lg ${getTextClasses()} transition-colors duration-700`}>Steady me</div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Help me breathe without talking.
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setScreen('shift-state')}
            className={`w-full ${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 text-left hover:shadow-xl transition-all shadow-lg space-y-2`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/40 dark:to-indigo-800/40 rounded-2xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className={`text-lg ${getTextClasses()} transition-colors duration-700`}>Shift my state</div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Help me feel calmer, more awake, or more steady.
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setScreen('understand-explore')}
            className={`w-full ${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 text-left hover:shadow-xl transition-all shadow-lg space-y-2`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-800/40 rounded-2xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className={`text-lg ${getTextClasses()} transition-colors duration-700`}>Reflect/Explore</div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Journal, guided prompts, or learn more
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setScreen('just-log')}
            className={`w-full ${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 text-left hover:shadow-xl transition-all shadow-lg space-y-2`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center shadow-md">
                <Check className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className={`text-lg ${getTextClasses()} transition-colors duration-700`}>Log Now</div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Review & save - click sections to edit
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Crisis button if needed */}
        {isHighActivation() && (
          <button
            onClick={() => setShowCrisisModal(true)}
            className="w-full bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-900 dark:text-rose-100 rounded-full py-5 hover:shadow-xl transition-all shadow-md border border-rose-200 dark:border-rose-800"
          >
            Reach someone safe
          </button>
        )}
      </div>
    </div>
  );
}
