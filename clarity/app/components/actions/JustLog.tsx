import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { ArrowLeft, Heart, Compass, Check, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { Screen } from '../../types';

export function JustLog() {
  const { setScreen, saveCheckIn, currentCheckIn, pushNavigation, hasCheckInData, updateCurrentCheckIn } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [note, setNote] = useState(currentCheckIn.journalEntry ?? '');
  const [showReview, setShowReview] = useState(false);

  const handleSave = () => {
    if (!hasCheckInData() && !note) {
      // Don't allow saving if no data
      return;
    }
    updateCurrentCheckIn({ journalEntry: note });
    saveCheckIn();
    setScreen('home');
  };

  const handleEditSection = (screen: Screen) => {
    pushNavigation('just-log');
    setScreen(screen);
  };

  const getSummaryItems = () => {
    const items = [];
    
    if (currentCheckIn.emotions && currentCheckIn.emotions.length > 0) {
      items.push({
        label: 'Emotions',
        value: currentCheckIn.emotions.slice(0, 3).join(', ') + (currentCheckIn.emotions.length > 3 ? '...' : '')
      });
    }
    
    if (currentCheckIn.compassQuadrant) {
      const quadrantLabel = 
        currentCheckIn.compassQuadrant === 'high-protected' ? 'High Energy / Protected' :
        currentCheckIn.compassQuadrant === 'low-protected' ? 'Low Energy / Protected' :
        currentCheckIn.compassQuadrant === 'high-open' ? 'High Energy / Open' :
        'Low Energy / Open';
      items.push({
        label: 'State',
        value: quadrantLabel
      });
    }
    
    if (currentCheckIn.activation !== undefined) {
      const level = currentCheckIn.activation - 5;
      const activationLabel = 
        level === 0 ? 'Manageable' :
        level < 0 ? (level <= -3 ? 'Shut down' : 'Low energy') :
        level >= 4 ? 'Overwhelmed' : level >= 3 ? 'Intense' : 'Heightened';
      items.push({
        label: 'Activation',
        value: activationLabel
      });
    }
    
    if (currentCheckIn.bodyZones && currentCheckIn.bodyZones.length > 0) {
      items.push({
        label: 'Body',
        value: currentCheckIn.bodyZones.length + ' area' + (currentCheckIn.bodyZones.length > 1 ? 's' : '')
      });
    }
    
    if (currentCheckIn.lifeDomains && currentCheckIn.lifeDomains.length > 0) {
      items.push({
        label: 'Life areas',
        value: currentCheckIn.lifeDomains.length + ' domain' + (currentCheckIn.lifeDomains.length > 1 ? 's' : '')
      });
    }
    
    return items;
  };

  const summaryItems = getSummaryItems();

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          onClick={() => setScreen('summary')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-2">
          <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
            Log Now
          </h2>
          <p className={`${getSubtextClasses()} transition-colors duration-700`}>
            Review & save - click any section to edit before saving
          </p>
        </div>

        {/* Optional Note Section */}
        <div className={`${getCardClasses()} backdrop-blur-xl border rounded-3xl p-6 space-y-4 shadow-lg`}>
          <label className={`text-sm uppercase tracking-wide ${getSubtextClasses()} opacity-60`}>
            Quick note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); updateCurrentCheckIn({ journalEntry: e.target.value }); }}
            placeholder="Add anything you want to remember about this moment..."
            rows={4}
            className={`w-full px-4 py-3 rounded-2xl border ${
              getCardClasses().includes('bg-white')
                ? 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                : 'border-gray-600 bg-gray-800 text-gray-100 placeholder:text-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-colors duration-700`}
          />
          <p className={`text-xs ${getSubtextClasses()} italic`}>
            This is completely optional. Your check-in data is already complete.
          </p>
        </div>

        {/* Review Section */}
        <div className={`${getCardClasses()} backdrop-blur-xl border rounded-3xl shadow-lg overflow-hidden`}>
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center">
                {currentCheckIn.emotions ? (
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                ) : (
                  <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div className="text-left">
                <div className={`${getTextClasses()} transition-colors duration-700`}>
                  Review what you're saving
                </div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  {summaryItems.length} items logged
                </div>
              </div>
            </div>
            {showReview ? (
              <ChevronUp className={`w-5 h-5 ${getSubtextClasses()}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${getSubtextClasses()}`} />
            )}
          </button>

          {showReview && (
            <div className="px-6 pb-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              {currentCheckIn.emotions && currentCheckIn.emotions.length > 0 && (
                <button
                  onClick={() => handleEditSection('emotions-select')}
                  className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-xs ${getSubtextClasses()}`}>Emotions</span>
                    <span className={`text-sm ${getTextClasses()}`}>
                      {currentCheckIn.emotions.slice(0, 3).join(', ')}
                      {currentCheckIn.emotions.length > 3 ? '...' : ''}
                    </span>
                  </div>
                  <Edit2 className={`w-4 h-4 ${getSubtextClasses()} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              )}
              
              {currentCheckIn.compassQuadrant && (
                <button
                  onClick={() => handleEditSection('compass-map')}
                  className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-xs ${getSubtextClasses()}`}>State</span>
                    <span className={`text-sm ${getTextClasses()}`}>
                      {currentCheckIn.compassQuadrant === 'high-protected' ? 'High Energy / Protected' :
                       currentCheckIn.compassQuadrant === 'low-protected' ? 'Low Energy / Protected' :
                       currentCheckIn.compassQuadrant === 'high-open' ? 'High Energy / Open' :
                       'Low Energy / Open'}
                    </span>
                  </div>
                  <Edit2 className={`w-4 h-4 ${getSubtextClasses()} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              )}
              
              {currentCheckIn.activation !== undefined && (
                <button
                  onClick={() => handleEditSection('emotions-activation')}
                  className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-xs ${getSubtextClasses()}`}>Activation</span>
                    <span className={`text-sm ${getTextClasses()}`}>
                      {(() => {
                        const level = currentCheckIn.activation as any - 5;
                        return level === 0 ? 'Manageable' :
                               level < 0 ? (level <= -3 ? 'Shut down' : 'Low energy') :
                               level >= 4 ? 'Overwhelmed' : level >= 3 ? 'Intense' : 'Heightened';
                      })()}
                    </span>
                  </div>
                  <Edit2 className={`w-4 h-4 ${getSubtextClasses()} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              )}
              
              {currentCheckIn.bodyZones && currentCheckIn.bodyZones.length > 0 && (
                <button
                  onClick={() => handleEditSection(currentCheckIn.emotions ? 'emotions-body' : 'compass-body')}
                  className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-xs ${getSubtextClasses()}`}>Body</span>
                    <span className={`text-sm ${getTextClasses()}`}>
                      {currentCheckIn.bodyZones.length} area{currentCheckIn.bodyZones.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <Edit2 className={`w-4 h-4 ${getSubtextClasses()} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              )}
              
              {currentCheckIn.lifeDomains && currentCheckIn.lifeDomains.length > 0 && (
                <button
                  onClick={() => handleEditSection(currentCheckIn.emotions ? 'emotions-domain' : 'compass-domain')}
                  className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-xs ${getSubtextClasses()}`}>Life areas</span>
                    <span className={`text-sm ${getTextClasses()}`}>
                      {currentCheckIn.lifeDomains.length} domain{currentCheckIn.lifeDomains.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <Edit2 className={`w-4 h-4 ${getSubtextClasses()} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </button>
              )}
              
              {note && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 px-3">
                  <span className={`text-xs ${getSubtextClasses()} block mb-2`}>Note</span>
                  <p className={`text-sm ${getTextClasses()} italic`}>"{note}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Privacy disclaimer and Save Button */}
        <div className="space-y-3">
          <div className={`flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800`}>
            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className={`text-xs ${getSubtextClasses()}`}>
              If using a shared device, others with access may be able to see what you save.
            </p>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!hasCheckInData() && !note}
            className="w-full py-6 rounded-full text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5 mr-2" />
            Save & Done
          </Button>
        </div>

        {!hasCheckInData() && !note && (
          <p className={`text-xs text-center ${getSubtextClasses()} italic`}>
            Add at least one piece of information to save your check-in
          </p>
        )}

        <p className={`text-sm text-center ${getSubtextClasses()} transition-colors duration-700`}>
          You can view your patterns anytime in Insights
        </p>
      </div>
    </div>
  );
}
