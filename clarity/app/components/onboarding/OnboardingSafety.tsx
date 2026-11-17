import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { CrisisPreference, SafeWordAction, TrustedContact } from '../../types';

export function OnboardingSafety() {
  const { setScreen, updateUserProfile, userProfile, popNavigation } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getMutedTextClasses, getCardClasses } = useTheme();
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(userProfile.trustedContacts.length ? userProfile.trustedContacts : [{ id: '1', name: '', number: '' }]);
  const [crisisPreference, setCrisisPreference] = useState<CrisisPreference>(userProfile.crisisPreference ?? 'calm-first');
  const [safeWord, setSafeWord] = useState(userProfile.safeWord?.word ?? '');
  const [safeWordActions, setSafeWordActions] = useState<SafeWordAction[]>(userProfile.safeWord ? [userProfile.safeWord.action] : []);

  const handleSave = () => {
    // Only save contacts that have both name and number
    const validContacts = trustedContacts.filter(c => c.name.trim() && c.number.trim());
    
    updateUserProfile({
      trustedContacts: validContacts,
      crisisPreference,
      safeWord: safeWord ? { word: safeWord, action: safeWordActions[0] || 'log-silently' } : undefined,
    });
    setScreen(popNavigation() ?? 'home');
  };

  const toggleSafeWordAction = (action: SafeWordAction) => {
    setSafeWordActions(prev => 
      prev.includes(action) ? [] : [action]
    );
  };

  const addContact = () => {
    setTrustedContacts(prev => [...prev, { 
      id: Date.now().toString(), 
      name: '', 
      number: '' 
    }]);
  };

  const removeContact = (id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
  };

  const updateContact = (id: string, field: 'name' | 'number', value: string) => {
    setTrustedContacts(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-6 overflow-y-auto transition-colors duration-700`}>
      <div className="max-w-lg mx-auto py-8 space-y-8">
        <button
          type="button"
          onClick={() => setScreen(popNavigation() ?? 'onboarding-before-continue')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-2">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            Support options
          </h2>
          <p className={`text-sm ${getMutedTextClasses()} transition-colors duration-700`}>
            (you can change this any time)
          </p>
        </div>

        <div className="space-y-6">
          {/* Trusted Contacts */}
          <div className="space-y-4">
            <div>
              <label className={`${getTextClasses()} transition-colors duration-700`}>
                Trusted Contacts (optional)
              </label>
              <p className={`text-sm ${getSubtextClasses()} mt-1 transition-colors duration-700`}>
                People you'd want me to offer to reach out to if you're overwhelmed.
              </p>
            </div>

            <div className="space-y-4">
              {trustedContacts.map((contact, index) => (
                <div 
                  key={contact.id} 
                  className={`${getCardClasses()} backdrop-blur-xl rounded-3xl p-5 border transition-all duration-700`}
                >
                  <div className="space-y-3">
                    {/* Header with remove button for 2+ contacts */}
                    {trustedContacts.length > 1 && (
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${getMutedTextClasses()} transition-colors duration-700`}>
                          Contact {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeContact(contact.id)}
                          className={`p-1 rounded-full ${getSubtextClasses()} hover:opacity-70 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200`}
                          aria-label="Remove contact"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <Input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full p-4 rounded-2xl"
                    />
                    <Input
                      type="tel"
                      value={contact.number}
                      onChange={(e) => updateContact(contact.id, 'number', e.target.value)}
                      placeholder="Phone number"
                      className="w-full p-4 rounded-2xl"
                    />
                  </div>
                </div>
              ))}
              
              {/* Add more button */}
              <button
                onClick={addContact}
                className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-2 ${
                  getCardClasses()
                } hover:border-purple-400 dark:hover:border-purple-500`}
              >
                <Plus className="w-4 h-4" />
                <span className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Add another contact
                </span>
              </button>
            </div>
          </div>

          {/* Crisis Preference */}
          <div className="space-y-3">
            <label className={`${getTextClasses()} transition-colors duration-700`}>
              When you're overwhelmed, what feels better first?
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setCrisisPreference('calm-first')}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  crisisPreference === 'calm-first'
                    ? 'bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Help me calm my body first
              </button>
              <button
                onClick={() => setCrisisPreference('crisis-first')}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  crisisPreference === 'crisis-first'
                    ? 'bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Show crisis support first
              </button>
            </div>
          </div>

          {/* Safe Word */}
          <div className="space-y-3">
            <label className={`${getTextClasses()} transition-colors duration-700`}>
              Create a code word (optional)
            </label>
            <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
              Type or dictate this word as a journal note to use your chosen support option.
            </p>
            <Input
              type="text"
              value={safeWord}
              onChange={(e) => setSafeWord(e.target.value)}
              placeholder="Your code word"
              className="w-full p-4 rounded-2xl"
            />

            {safeWord && (
              <div className="space-y-2 pl-4">
                <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>When I use this word:</p>
                <div className="space-y-2">
                  {[
                    { value: 'contact-trusted' as SafeWordAction, label: 'Offer to contact my trusted person' },
                    { value: 'show-crisis' as SafeWordAction, label: 'Show me crisis options' },
                    { value: 'steady-me' as SafeWordAction, label: 'Take me to Steady Me (grounding)' },
                    { value: 'log-silently' as SafeWordAction, label: 'Log it silently' },
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={safeWordActions.includes(option.value)}
                        onCheckedChange={() => toggleSafeWordAction(option.value)}
                      />
                      <span className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Save and continue
          </Button>

          <button
            type="button"
            onClick={() => setScreen('home')}
            className={`w-full py-4 transition-all ${getSubtextClasses()} hover:opacity-70`}
          >
            Skip for now
          </button>
        </div>

        <p className={`text-xs text-center pt-4 ${getMutedTextClasses()} transition-colors duration-700`}>
          MindRecipe offers support and skills, but it isn't therapy, medical care, or emergency response. 
          If you're in danger or think you might harm yourself or someone else, please contact local 
          emergency services or a crisis hotline.
        </p>
      </div>
    </div>
  );
}
