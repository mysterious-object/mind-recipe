import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { ArrowLeft, Heart, Dumbbell, Users, Sparkles, Briefcase, Brain, Home, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { LifeDomain, DomainDetails } from '../../types';
import { DOMAIN_OPTIONS } from './domainOptions';

const DOMAINS = [
  { id: 'emotional' as LifeDomain, label: 'Emotional', icon: Heart, color: 'pink' },
  { id: 'physical' as LifeDomain, label: 'Physical', icon: Dumbbell, color: 'red' },
  { id: 'social' as LifeDomain, label: 'Social', icon: Users, color: 'blue' },
  { id: 'spiritual' as LifeDomain, label: 'Spiritual', icon: Sparkles, color: 'purple' },
  { id: 'occupational' as LifeDomain, label: 'Occupational', icon: Briefcase, color: 'orange' },
  { id: 'intellectual' as LifeDomain, label: 'Intellectual', icon: Brain, color: 'green' },
  { id: 'environmental' as LifeDomain, label: 'Environmental', icon: Home, color: 'teal' },
  { id: 'financial' as LifeDomain, label: 'Financial', icon: DollarSign, color: 'yellow' },
];

export function EmotionsDomain() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, popNavigation } = useApp();
  const [selected, setSelected] = useState<LifeDomain[]>(currentCheckIn.lifeDomains || []);
  const [expandedDomain, setExpandedDomain] = useState<LifeDomain | null>(null);
  const [domainDetails, setDomainDetails] = useState<Partial<Record<LifeDomain, DomainDetails>>>(
    currentCheckIn.domainDetails || {} as Partial<Record<LifeDomain, DomainDetails>>
  );

  const toggleDomain = (domain: LifeDomain) => {
    setSelected(prev => {
      const newSelected = prev.includes(domain) 
        ? prev.filter(d => d !== domain) 
        : [...prev, domain];
      
      // If deselecting, also collapse if expanded
      if (!newSelected.includes(domain) && expandedDomain === domain) {
        setExpandedDomain(null);
      }
      
      return newSelected;
    });
  };

  const toggleExpanded = (domain: LifeDomain, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDomain(expandedDomain === domain ? null : domain);
  };

  const toggleIssue = (domain: LifeDomain, issue: string) => {
    setDomainDetails(prev => {
      const currentIssues = prev[domain]?.issues || [];
      const newIssues = currentIssues.includes(issue)
        ? currentIssues.filter(i => i !== issue)
        : [...currentIssues, issue];
      
      return {
        ...prev,
        [domain]: {
          ...prev[domain],
          issues: newIssues
        }
      };
    });
  };

  const updateNote = (domain: LifeDomain, note: string) => {
    setDomainDetails(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        note
      }
    }));
  };

  const handleNext = () => {
    updateCurrentCheckIn({ 
      lifeDomains: selected,
      domainDetails 
    });
    const returnScreen = popNavigation();
    if (returnScreen === 'just-log' || returnScreen === 'check-in-review') {
      setScreen(returnScreen);
    } else {
      setScreen('check-in-review');
    }
  };

  const handleSkip = () => {
    updateCurrentCheckIn({ 
      lifeDomains: [],
      domainDetails: {} 
    });
    const returnScreen = popNavigation();
    if (returnScreen === 'just-log' || returnScreen === 'check-in-review') {
      setScreen(returnScreen);
    } else {
      setScreen('check-in-review');
    }
  };

  const handleLog = () => {
    updateCurrentCheckIn({ 
      lifeDomains: selected,
      domainDetails 
    });
    setScreen('just-log');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 pb-32">
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          onClick={() => setScreen('emotions-body')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100">
            What part of life may be connected to this right now?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pick all that apply. We're not blaming you or your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOMAINS.map(domain => {
            const Icon = domain.icon;
            const isSelected = selected.includes(domain.id);
            const isExpanded = expandedDomain === domain.id;
            
            const colorClasses = {
              pink: { 
                bg: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30',
                border: 'border-pink-400 dark:border-pink-600',
                icon: 'text-pink-600 dark:text-pink-400',
                checkbox: 'accent-pink-600'
              },
              red: { 
                bg: 'from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30',
                border: 'border-red-400 dark:border-red-600',
                icon: 'text-red-600 dark:text-red-400',
                checkbox: 'accent-red-600'
              },
              blue: { 
                bg: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
                border: 'border-blue-400 dark:border-blue-600',
                icon: 'text-blue-600 dark:text-blue-400',
                checkbox: 'accent-blue-600'
              },
              purple: { 
                bg: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30',
                border: 'border-purple-400 dark:border-purple-600',
                icon: 'text-purple-600 dark:text-purple-400',
                checkbox: 'accent-purple-600'
              },
              orange: { 
                bg: 'from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30',
                border: 'border-orange-400 dark:border-orange-600',
                icon: 'text-orange-600 dark:text-orange-400',
                checkbox: 'accent-orange-600'
              },
              green: { 
                bg: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
                border: 'border-green-400 dark:border-green-600',
                icon: 'text-green-600 dark:text-green-400',
                checkbox: 'accent-green-600'
              },
              teal: { 
                bg: 'from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30',
                border: 'border-teal-400 dark:border-teal-600',
                icon: 'text-teal-600 dark:text-teal-400',
                checkbox: 'accent-teal-600'
              },
              yellow: { 
                bg: 'from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30',
                border: 'border-yellow-400 dark:border-yellow-600',
                icon: 'text-yellow-600 dark:text-yellow-400',
                checkbox: 'accent-yellow-600'
              }
            }[domain.color] ?? { bg: 'from-gray-100 to-gray-200', border: 'border-gray-400', icon: 'text-gray-600', checkbox: 'accent-gray-600' };
            
            return (
              <div key={domain.id} className="space-y-2">
                <button
                  onClick={() => toggleDomain(domain.id)}
                  className={`w-full p-6 rounded-2xl transition-all text-left space-y-3 min-h-[120px] relative ${
                    isSelected
                      ? `bg-gradient-to-br ${colorClasses.bg} border-2 ${colorClasses.border} shadow-lg`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${isSelected ? colorClasses.icon : ''}`} />
                  <div className={`font-medium ${isSelected ? 'text-gray-900 dark:text-gray-100' : ''}`}>
                    {domain.label}
                  </div>
                  
                  {/* Expand button - always show */}
                  <div
                    onClick={(e) => {
                      if (!isSelected) {
                        toggleDomain(domain.id);
                      }
                      toggleExpanded(domain.id, e);
                    }}
                    className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700' 
                        : 'bg-gray-200/60 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isSelected && isExpanded && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700 space-y-4 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        What specifically? (optional)
                      </p>
                      
                      {/* Multiple choice options */}
                      <div className="space-y-2">
                        {DOMAIN_OPTIONS[domain.id].map(option => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={domainDetails[domain.id]?.issues?.includes(option) || false}
                              onChange={() => toggleIssue(domain.id, option)}
                              className={`w-4 h-4 rounded ${colorClasses.checkbox}`}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>

                      {/* Custom note */}
                      <div className="pt-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-2">
                          Your own note or keyword
                        </label>
                        <input
                          type="text"
                          value={domainDetails[domain.id]?.note || ''}
                          onChange={(e) => updateNote(domain.id, e.target.value)}
                          placeholder="Add a quick note..."
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 italic pt-2">
                        You can always add or edit these details later in the Insights tab
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              If using a shared device, others with access may be able to see what you save.
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={selected.length === 0}
            className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
          >
            Continue
          </Button>
          
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={handleSkip}
              className="text-gray-600 dark:text-gray-400 hover:opacity-70 transition-all duration-200"
            >
              Skip
            </button>

            <button
              onClick={handleLog}
              className="text-gray-600 dark:text-gray-400 hover:opacity-70 transition-all duration-200"
            >
              Log Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
