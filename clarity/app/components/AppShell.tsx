import { openExternal } from '../host';
import { haptic } from '../host';
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { ChevronLeft, Home as HomeIcon, Shield, Phone, MessageSquare } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { SteadyMe } from './actions/SteadyMe';
import { TopNav } from './TopNav';
import type { Screen } from '../types';

interface AppShellProps {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  showBack?: boolean;
  className?: string;
}

export function AppShell({ 
  title, 
  children, 
  onBack, 
  backLabel = 'Back',
  showBack = true,
  className = ''
}: AppShellProps) {
  const { setScreen, userProfile, markMoment, reportError } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showSteadyMe, setShowSteadyMe] = useState(false);
  const [steadyMeReturnTo, setSteadyMeReturnTo] = useState<'home' | 'help-modal'>('home');
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const held = useRef(false);
  const cancelHold = () => { if (holdTimer.current) clearTimeout(holdTimer.current); holdTimer.current = null; };
  useEffect(() => cancelHold, []);
  const handleHelpPressStart = () => {
    cancelHold(); held.current = false;
    holdTimer.current = setTimeout(() => {
      held.current = true;
      if (userProfile.haptics) haptic();
      setSteadyMeReturnTo('home'); setShowSteadyMe(true);
    }, 600);
  };
  const handleHelpClick = () => { if (!held.current) { if (userProfile.crisisPreference === 'crisis-first') setShowSupportModal(true); else setShowHelpModal(true); } held.current = false; };

  const handleSteadyMe = () => {

    setShowHelpModal(false);
    setSteadyMeReturnTo('help-modal');
    setShowSteadyMe(true);
  };

  const handleGetSupport = () => {

    setShowHelpModal(false);
    setShowSupportModal(true);
  };

  const handleMarkMoment = () => { markMoment(); setShowHelpModal(false); };

  const handleCloseSteadyMe = () => {
    setShowSteadyMe(false);
    if (steadyMeReturnTo === 'help-modal') {
      setShowHelpModal(true);
    }
  };

  if (showSteadyMe) {
    return <SteadyMe returnTo={steadyMeReturnTo} onClose={handleCloseSteadyMe} onOpenSupport={() => {
      setShowSteadyMe(false);
      setShowSupportModal(true);
    }} />;
  }

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} flex flex-col transition-colors duration-700`}>
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className={`flex-1 ${className}`}>
        {children}
      </div>

      {/* Bottom Crisis Strip - Sticky */}
      <footer aria-label="Support options" className="sticky bottom-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-2 md:py-4 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Help has its own row so it cannot cover page content. */}
          <button
            type="button"
            onPointerDown={handleHelpPressStart}
            onPointerUp={cancelHold}
            onPointerCancel={cancelHold}
            onPointerLeave={cancelHold}
            onClick={handleHelpClick}
            className="relative ml-auto text-white rounded-full px-5 py-3 shadow-2xl transition-all flex items-center gap-2 group overflow-hidden min-h-[48px]"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.95) 0%, rgba(251, 113, 133, 0.9) 50%, rgba(244, 114, 182, 0.95) 100%)',
              boxShadow: '0 12px 32px rgba(251, 146, 60, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            }}
            aria-label="Help now - tap or press and hold"
          >
            <div
              className="absolute inset-0 bg-white/15 rounded-full pointer-events-none"
              style={{ animation: 'soft-glow-pulse 3s ease-in-out infinite' }}
            />

            <div className="relative z-10 flex items-center gap-1">
              <span className="font-medium">Help now</span>
            </div>
          </button>
          {/* Crisis Buttons */}
          <div className="flex gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => {
                void openExternal('tel:988').catch(reportError);
              }}
              className="flex-1 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all min-h-[44px] flex items-center justify-center gap-1 md:gap-2"
              aria-label="Call 988 Suicide and Crisis Lifeline"
            >
              <Phone className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">Call 988 - Suicide & Crisis Lifeline</span>
              <span className="text-xs font-medium sm:hidden">Call 988</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                void openExternal('sms:988').catch(reportError);
              }}
              className="flex-1 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all min-h-[44px] flex items-center justify-center gap-1 md:gap-2"
              aria-label="Text 988"
            >
              <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">Text 988</span>
            </button>
          </div>

          {/* Crisis Resources & Disclaimer - Compact on mobile */}
          <div className={`text-[10px] md:text-xs ${getSubtextClasses()} leading-relaxed transition-colors duration-700 text-center space-y-0.5 md:space-y-1`}>
            <p className="hidden md:block">
              <strong>Crisis Text Line:</strong> Text "HELLO" to 741741 | <strong>SAMHSA:</strong> 1-800-662-4357 | <strong>Resources:</strong>{' '}
              <a 
                href="https://www.findhelp.org" onClick={event => { event.preventDefault(); void openExternal("https://www.findhelp.org").catch(reportError); }} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                FindHelp.org
              </a>
            </p>
            <p className="md:hidden">
              <strong>Crisis Text:</strong> 741741 | <a 
                href="https://www.findhelp.org" onClick={event => { event.preventDefault(); void openExternal("https://www.findhelp.org").catch(reportError); }} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                FindHelp.org
              </a>
            </p>
            <p className="text-[9px] md:text-xs opacity-75">
              Not a replacement for professional care. In crisis, contact emergency services.
            </p>
          </div>
        </div>
      </footer>

      {/* Help Modal - "I've got you." */}
      <Sheet open={showHelpModal} onOpenChange={setShowHelpModal}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-2xl">I've got you.</SheetTitle>
            <SheetDescription>
              Choose what feels best right now.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-3 py-4">
            <Button
              type="button"
              onClick={handleSteadyMe}
              className="w-full h-auto min-h-[56px] py-6 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex flex-col items-start gap-1 shadow-lg"
              aria-label="Start breathing exercise"
            >
              <div className="font-medium text-lg">Steady me</div>
              <div className="text-sm text-teal-50 opacity-90">
                Help me breathe without talking.
              </div>
            </Button>

            <Button
              type="button"
              onClick={handleGetSupport}
              className="w-full h-auto min-h-[56px] py-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex flex-col items-start gap-1 shadow-lg"
              aria-label="Get support from contacts or crisis lines"
            >
              <div className="font-medium text-lg">Help me get support</div>
              <div className="text-sm text-rose-50 opacity-90">
                Show me my trusted contacts or crisis lines.
              </div>
            </Button>

            <Button
              type="button"
              onClick={handleMarkMoment}
              variant="outline"
              className="w-full h-auto min-h-[56px] py-6 rounded-2xl flex flex-col items-start gap-1"
              aria-label="Log this moment quietly"
            >
              <div className="font-medium text-lg">Just mark this moment</div>
              <div className="text-sm opacity-70">
                I'll remember this quietly for you.
              </div>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Support Modal - shows trusted contacts, 988, emergency */}
      <Sheet open={showSupportModal} onOpenChange={setShowSupportModal}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-2xl">Support options</SheetTitle>
            <SheetDescription>
              Choose who to reach out to.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-3 py-4">
            {/* Trusted Contact */}
            {userProfile.trustedContacts && userProfile.trustedContacts.length > 0 ? (
              <Button
                type="button"
                onClick={() => {
                  const contact = userProfile.trustedContacts[0];

                  void openExternal(`tel:${contact.number}`).catch(reportError);
                  setShowSupportModal(false);
                }}
                className="w-full h-auto min-h-[56px] py-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex flex-col items-start gap-1 shadow-lg"
                aria-label={`Contact ${userProfile.trustedContacts[0].name}`}
              >
                <div className="font-medium text-lg">
                  {userProfile.trustedContacts[0].name}
                </div>
                <div className="text-sm text-purple-50 opacity-90">
                  Trusted contact
                </div>
              </Button>
            ) : null}

            {/* 988 Lifeline */}
            <Button
              type="button"
              onClick={() => {

                void openExternal('tel:988').catch(reportError);
                setShowSupportModal(false);
              }}
              className="w-full h-auto min-h-[56px] py-6 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex flex-col items-start gap-1 shadow-lg"
              aria-label="Contact 988 Lifeline"
            >
              <div className="font-medium text-lg">988 Lifeline</div>
              <div className="text-sm text-teal-50 opacity-90">
                24/7 crisis support • Call, text, or chat
              </div>
            </Button>

            {/* Emergency Services */}
            <Button
              type="button"
              onClick={() => {

                void openExternal('tel:911').catch(reportError);
                setShowSupportModal(false);
              }}
              className="w-full h-auto min-h-[56px] py-6 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white flex flex-col items-start gap-1 shadow-lg"
              aria-label="Contact emergency services"
            >
              <div className="font-medium text-lg">Emergency services</div>
              <div className="text-sm text-rose-50 opacity-90">
                Call 911 (US) or local number
              </div>
            </Button>

            {/* Cancel */}
            <Button
              type="button"
              onClick={() => setShowSupportModal(false)}
              variant="outline"
              className="w-full h-auto min-h-[44px] py-5 rounded-2xl"
              aria-label="Cancel and close"
            >
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Animations */}
      <style>{`
        @keyframes soft-glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
