import { insightSummary } from '../insightSummary';
import { isNative, nativeRequest, shareText } from '../host';
import type { Screen } from '../types';
import React from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/button';
import { ArrowLeft, Lock, Download, User, Shield } from 'lucide-react';
import { Switch } from './ui/switch';

export function Settings() {
  const { setScreen, userProfile, updateUserProfile, pushNavigation, reportError, checkInHistory, flushChanges } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getSolidCardClasses, getCardClasses } = useTheme();

  const edit = (screen: Screen) => { pushNavigation('settings'); setScreen(screen); };
  const toggleLock = async (key: 'appLock' | 'journalLock', enabled: boolean) => {
    try { if (await nativeRequest<boolean>('authenticate')) updateUserProfile({ [key]: enabled }); }
    catch (error) { reportError(error); }
  };
  const exportData = async () => {
    try {
      if (userProfile.journalLock && !(await nativeRequest<boolean>('authenticate'))) return;
      await shareText(insightSummary(checkInHistory));
    } catch (error) { reportError(error); }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} p-6 transition-colors duration-700`}>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          type="button"
          onClick={() => setScreen('home')}
          className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
          Safety & Privacy
        </h2>

        {/* Profile Section */}
        <div className={`${getSolidCardClasses()} rounded-3xl p-6 space-y-4 border transition-colors duration-700`}>
          <div className={`flex items-center gap-3 ${getTextClasses()} transition-colors duration-700`}>
            <User className="w-5 h-5" />
            <h3 className="text-xl">Profile</h3>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center justify-between p-4 ${getCardClasses()} rounded-2xl border transition-colors duration-700`}>
              <div>
                <div className={`${getTextClasses()} transition-colors duration-700`}>Name</div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>{userProfile.name}</div>
              </div>
              <button onClick={() => edit('onboarding-you')} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                Edit
              </button>
            </div>

            <div className={`flex items-center justify-between p-4 ${getCardClasses()} rounded-2xl border transition-colors duration-700`}>
              <div>
                <div className={`${getTextClasses()} transition-colors duration-700`}>Pronouns</div>
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>{userProfile.pronouns}</div>
              </div>
              <button onClick={() => edit('onboarding-you')} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                Edit
              </button>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={() => edit('onboarding-atmosphere')}>Change atmosphere</Button>
        {isNative() && <Button variant="outline" onClick={() => void flushChanges().then(() => nativeRequest('signOut')).catch(reportError)}>Sign out</Button>}
        {/* Safety Section */}
        <div className={`${getSolidCardClasses()} rounded-3xl p-6 space-y-4 border transition-colors duration-700`}>
          <div className={`flex items-center gap-3 ${getTextClasses()} transition-colors duration-700`}>
            <Shield className="w-5 h-5" />
            <h3 className="text-xl">Safety Settings</h3>
          </div>

          <div className="space-y-3">
            <div className={`p-4 ${getCardClasses()} rounded-2xl border transition-colors duration-700`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${getTextClasses()} transition-colors duration-700`}>Trusted Contacts</div>
                <button onClick={() => edit('onboarding-safety')} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  Edit
                </button>
              </div>
              {userProfile.trustedContacts && userProfile.trustedContacts.length > 0 ? (
                <div className="space-y-2">
                  {userProfile.trustedContacts.map((contact, index) => (
                    <div key={contact.id} className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                      {index + 1}. {contact.name} - {contact.number}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Not set
                </div>
              )}
            </div>

            <div className={`p-4 ${getCardClasses()} rounded-2xl border transition-colors duration-700`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${getTextClasses()} transition-colors duration-700`}>Crisis Preference</div>
                <button onClick={() => edit('onboarding-safety')} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  Edit
                </button>
              </div>
              <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                {userProfile.crisisPreference === 'calm-first' 
                  ? 'Help me calm my body first'
                  : 'Show crisis support first'}
              </div>
            </div>

            <div className={`p-4 ${getCardClasses()} rounded-2xl border transition-colors duration-700`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${getTextClasses()} transition-colors duration-700`}>Safe Word</div>
                <button onClick={() => edit('onboarding-safety')} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  Edit
                </button>
              </div>
              {userProfile.safeWord ? (
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  "{userProfile.safeWord.word}"
                </div>
              ) : (
                <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  Not set
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <Lock className="w-5 h-5" />
            <h3 className="text-xl">Privacy</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900 dark:text-gray-100">Require Face/PIN to open app</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Added security when opening MindRecipe</div>
              </div>
              <Switch aria-label="appLock" disabled={!isNative()} checked={Boolean(userProfile.appLock)} onCheckedChange={value => void toggleLock('appLock', value)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900 dark:text-gray-100">Lock my Journal</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Require Face/PIN to view entries</div>
              </div>
              <Switch aria-label="journalLock" disabled={!isNative()} checked={Boolean(userProfile.journalLock)} onCheckedChange={value => void toggleLock('journalLock', value)} />
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <Download className="w-5 h-5" />
            <h3 className="text-xl">Your Data</h3>
          </div>

          <Button onClick={() => void exportData()} variant="outline" className="w-full">
            Download my Insight Summary
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share with a therapist, coach, or re-entry program.
          </p>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            MindRecipe offers support, reflection, and skills training. MindRecipe does not provide diagnosis, 
            therapy, or emergency response. If you are in danger or think you might harm yourself or 
            someone else, please contact local emergency services or a crisis hotline immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
