import { TechniquePractice } from './TechniquePractice';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { ArrowLeft, Clock, Sparkles, TrendingUp, Home } from 'lucide-react';

interface Technique {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  recommended: boolean;
  matchPercentage?: number;
  tags: string[];
}

const TECHNIQUES: Technique[] = [
  {
    id: '54321',
    name: '5-4-3-2-1 Technique',
    description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste',
    duration: 5,
    recommended: true,
    matchPercentage: 70,
    tags: ['Anxiety', 'Overwhelm'],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Breathe in a square pattern to calm your nervous system',
    duration: 3,
    recommended: false,
    tags: ['Stress', 'Tension'],
  },
  {
    id: 'body-grounding',
    name: 'Body Grounding',
    description: 'Feel your connection to the earth',
    duration: 4,
    recommended: false,
    tags: ['Disconnection', 'Dissociation'],
  },
  {
    id: 'pmr',
    name: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups',
    duration: 5,
    recommended: false,
    tags: ['Physical tension', 'Stress'],
  },
];

export function ShiftStateNew() {
  const { setScreen, popNavigation } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  const handleStartTechnique = (techniqueId: string) => {
    setSelectedTechnique(techniqueId);
  };

  const handleShowInsights = () => {
    // Navigate to insights about why this technique was recommended
    setScreen('insights');
  };

  const recommendedTechnique = TECHNIQUES.find(t => t.recommended);

  if (selectedTechnique) return <TechniquePractice id={selectedTechnique} name={TECHNIQUES.find(t => t.id === selectedTechnique)!.name} onClose={() => setSelectedTechnique(null)} />;

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} transition-colors duration-700`}>
      <div className="max-w-3xl mx-auto p-6 py-8 space-y-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const returnScreen = popNavigation();
              setScreen(returnScreen || 'options-choice');
            }}
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
        <div className="space-y-3">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            Shift
          </h2>
          <p className={`${getSubtextClasses()} transition-colors duration-700`}>
            Choose a grounding technique to shift your state
          </p>
        </div>

        {/* Suggested practice */}
        {recommendedTechnique && (
          <div className={`${getCardClasses()} rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20`}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${getTextClasses()}`}>
                      Suggested practice
                    </h3>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Sensory grounding
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-medium mb-2 ${getTextClasses()}`}>
                  {recommendedTechnique.name}
                </h4>
                <p className={`text-sm ${getSubtextClasses()} mb-3`}>
                  Try noticing your surroundings, one sense at a time.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className={`text-sm ${getSubtextClasses()}`}>
                    {recommendedTechnique.duration} min
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  {recommendedTechnique.tags.map((tag, index) => (
                    <React.Fragment key={tag}>
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                        {tag}
                      </span>
                      {index < recommendedTechnique.tags.length - 1 && <span>,</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleStartTechnique(recommendedTechnique.id)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 py-6 rounded-full"
                >
                  Start: {recommendedTechnique.name}
                </Button>
                <Button
                  onClick={handleShowInsights}
                  variant="outline"
                  className="px-6 py-6 rounded-full border-purple-300 dark:border-purple-700"
                >
                  <TrendingUp className="w-5 h-5" />
                  Show Insights
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* All Techniques */}
        <div className="space-y-3">
          <h3 className={`text-lg font-medium ${getTextClasses()}`}>
            All Techniques
          </h3>
          <div className="space-y-3">
            {TECHNIQUES.map((technique) => (
              <button
                key={technique.id}
                onClick={() => handleStartTechnique(technique.id)}
                className={`
                  w-full ${getCardClasses()} rounded-2xl p-5 text-left hover:shadow-md transition-all
                  ${technique.recommended ? 'border-2 border-purple-300 dark:border-purple-700' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${getTextClasses()}`}>
                        {technique.name}
                      </h4>
                      {technique.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                          Suggested
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${getSubtextClasses()} mb-3`}>
                      {technique.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className={`text-sm ${getSubtextClasses()}`}>
                          {technique.duration} min
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {technique.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${getCardClasses()} border-t p-6 shadow-lg backdrop-blur-xl`}>
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button
            onClick={() => setScreen('options-choice')}
            variant="outline"
            className="flex-1 py-6 rounded-full text-lg"
          >
            Skip
          </Button>
          <Button
            onClick={() => setScreen('just-log')}
            variant="outline"
            className="flex-1 py-6 rounded-full text-lg"
          >
            Log Now
          </Button>
        </div>
      </div>
    </div>
  );
}
