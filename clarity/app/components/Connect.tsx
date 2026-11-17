import { openExternal, shareText } from '../host';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { AppShell } from './AppShell';
import { 
  Plus, 
  MessageCircle as MessageIcon, 
  Phone, 
  Share2, 
  MoreHorizontal,
  ExternalLink,
  Users
} from 'lucide-react';

type ConnectTab = 'personal' | 'clarity' | 'support';

export function Connect() {
  const { setScreen, userProfile, reportError, setShowCrisisModal } = useApp();
  const { getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [activeTab, setActiveTab] = useState<ConnectTab>('personal');

  return (
    <AppShell 
      title="Connect"
      onBack={() => setScreen('home')}
      backLabel="Home"
    >
      <div className="max-w-2xl mx-auto px-6 py-8 pb-32 space-y-6">
        {/* Segmented Control */}
        <div className={`inline-flex ${getCardClasses()} rounded-full p-1.5 shadow-lg border backdrop-blur-xl transition-colors duration-700`}>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : `${getSubtextClasses()} hover:opacity-70`
            }`}
          >
            Personal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clarity')}
            className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
              activeTab === 'clarity'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : `${getSubtextClasses()} hover:opacity-70`
            }`}
          >
            MindRecipe
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`px-6 py-2.5 rounded-full transition-all duration-300 ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : `${getSubtextClasses()} hover:opacity-70`
            }`}
          >
            Support
          </button>
        </div>

        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            {/* Trusted Contacts Card */}
            <div className={`${getCardClasses()} rounded-[1.25rem] p-8 shadow-lg border backdrop-blur-xl transition-colors duration-700 space-y-6`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                  Trusted Contacts
                </h3>
                <button
                  type="button"
                  onClick={() => setScreen('settings')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:opacity-90 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add contact
                </button>
              </div>

              {userProfile.trustedContacts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <Users className={`w-10 h-10 ${getSubtextClasses()}`} />
                  </div>
                  <p className={`${getSubtextClasses()} transition-colors duration-700`}>
                    No trusted contacts yet. Add someone safe to reach out to.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProfile.trustedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`${getCardClasses()} rounded-2xl p-5 border backdrop-blur-sm transition-colors duration-700`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                          <span className="text-lg">
                            {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>

                        {/* Name and actions */}
                        <div className="flex-1 min-w-0">
                          <div className={`${getTextClasses()} transition-colors duration-700 mb-3`}>
                            {contact.name}
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                void openExternal(`sms:${contact.number}`).catch(reportError);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:opacity-80 transition-all text-sm"
                            >
                              <MessageIcon className="w-4 h-4" />
                              Message
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void openExternal(`tel:${contact.number}`).catch(reportError);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:opacity-80 transition-all text-sm"
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void shareText(`${contact.name}: ${contact.number}`).catch(reportError);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:opacity-80 transition-all text-sm"
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                          </div>
                        </div>

                        {/* More Options */}
                        <button
                          type="button"
                          onClick={() => {
                            setScreen('settings');
                          }}
                          className={`w-10 h-10 rounded-full ${getCardClasses()} flex items-center justify-center ${getSubtextClasses()} hover:opacity-70 transition-all border`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Messages Card */}
            <div className={`${getCardClasses()} rounded-[1.25rem] p-8 shadow-lg border backdrop-blur-xl transition-colors duration-700 space-y-4`}>
              <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700 mb-6`}>
                Quick Messages
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    void shareText("I'm not okay—can you check in?").catch(reportError);
                  }}
                  className="p-6 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 text-rose-900 dark:text-rose-100 rounded-2xl hover:opacity-90 transition-all shadow-md text-left"
                >
                  <MessageIcon className="w-6 h-6 mb-3" />
                  <div className="font-medium mb-1">I'm not okay—can you check in?</div>
                  <div className="text-sm opacity-70">Tap to share</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void shareText("I'm safe now—thank you.").catch(reportError);
                  }}
                  className="p-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-900 dark:text-emerald-100 rounded-2xl hover:opacity-90 transition-all shadow-md text-left"
                >
                  <Share2 className="w-6 h-6 mb-3" />
                  <div className="font-medium mb-1">I'm safe now—thank you.</div>
                  <div className="text-sm opacity-70">Tap to share</div>
                </button>
              </div>
            </div>

            {/* Footer Link */}
            <button
              type="button"
              onClick={() => setScreen('settings')}
              className={`w-full text-center py-4 ${getSubtextClasses()} hover:opacity-70 transition-all flex items-center justify-center gap-2`}
            >
              Manage Safety & Code Word
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MindRecipe Tab */}
        {activeTab === 'clarity' && (
          <div className="space-y-6">
            <div className={`${getCardClasses()} rounded-[1.25rem] p-8 shadow-lg border backdrop-blur-xl transition-colors duration-700`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <Users className={`w-7 h-7 ${getSubtextClasses()}`} />
                </div>
                <div>
                  <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                    Requests & Groups
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm mt-1">
                    Coming soon
                  </div>
                </div>
              </div>

              <div className={`space-y-3 opacity-50 ${getSubtextClasses()} transition-colors duration-700`}>
                <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>

              <p className={`text-sm ${getSubtextClasses()} leading-relaxed mt-6 transition-colors duration-700`}>
                Real people. Real regulation. Safe places to not feel crazy. Soon: shared practices, lived experience, and monthly guidance from trusted coaches.
              </p>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            {/* Hotlines Card */}
            <div className={`${getCardClasses()} rounded-[1.25rem] p-8 shadow-lg border backdrop-blur-xl transition-colors duration-700 space-y-4`}>
              <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700 mb-6`}>
                Hotlines
              </h3>

              <button
                type="button"
                onClick={() => {
                  setShowCrisisModal(true);
                }}
                className={`w-full p-5 rounded-2xl border ${getCardClasses()} hover:opacity-90 transition-all backdrop-blur-sm text-left`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className={`${getTextClasses()} mb-1 transition-colors duration-700`}>
                      988 Lifeline
                    </div>
                    <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                      24/7 crisis support • Call, text, or chat
                    </div>
                  </div>
                  <ExternalLink className={`w-5 h-5 ${getSubtextClasses()}`} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  void openExternal('tel:911').catch(reportError);
                }}
                className={`w-full p-5 rounded-2xl border ${getCardClasses()} hover:opacity-90 transition-all backdrop-blur-sm text-left`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className={`${getTextClasses()} mb-1 transition-colors duration-700`}>
                      Local emergency services
                    </div>
                    <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                      Call 911 (US) or local number
                    </div>
                  </div>
                  <ExternalLink className={`w-5 h-5 ${getSubtextClasses()}`} />
                </div>
              </button>
            </div>

            {/* Resources Card */}
            <div className={`${getCardClasses()} rounded-[1.25rem] p-8 shadow-lg border backdrop-blur-xl transition-colors duration-700 space-y-4`}>
              <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700 mb-6`}>
                Resources
              </h3>

              <button
                type="button"
                onClick={() => {
                  void openExternal('https://988lifeline.org').catch(reportError);
                }}
                className={`w-full p-5 rounded-2xl border ${getCardClasses()} hover:opacity-90 transition-all backdrop-blur-sm text-left`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className={`${getTextClasses()} mb-1 transition-colors duration-700`}>
                      Find local crisis centers
                    </div>
                    <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                      Search by location
                    </div>
                  </div>
                  <ExternalLink className={`w-5 h-5 ${getSubtextClasses()}`} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  void openExternal('https://988lifeline.org/help-yourself/').catch(reportError);
                }}
                className={`w-full p-5 rounded-2xl border ${getCardClasses()} hover:opacity-90 transition-all backdrop-blur-sm text-left`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className={`${getTextClasses()} mb-1 transition-colors duration-700`}>
                      Safety planning guide
                    </div>
                    <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                      Step-by-step crisis plan
                    </div>
                  </div>
                  <ExternalLink className={`w-5 h-5 ${getSubtextClasses()}`} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  void openExternal('https://www.findhelp.org').catch(reportError);
                }}
                className={`w-full p-5 rounded-2xl border ${getCardClasses()} hover:opacity-90 transition-all backdrop-blur-sm text-left`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className={`${getTextClasses()} mb-1 transition-colors duration-700`}>
                      FindHelp.org
                    </div>
                    <div className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                      Local resources & community support
                    </div>
                  </div>
                  <ExternalLink className={`w-5 h-5 ${getSubtextClasses()}`} />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
