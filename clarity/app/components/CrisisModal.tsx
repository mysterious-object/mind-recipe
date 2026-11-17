import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { openExternal } from '../host';
import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export function CrisisModal() {
  const { showCrisisModal, setShowCrisisModal, userProfile, reportError } = useApp();

  const contact = userProfile.trustedContacts[0];
  const open = (url: string) => void openExternal(url).catch(reportError);
  if (!showCrisisModal) return null;

  return (
    <Dialog open={showCrisisModal} onOpenChange={setShowCrisisModal}>
      <DialogContent className="bg-white dark:bg-gray-900 rounded-3xl max-w-[calc(100%-2rem)] sm:max-w-md p-6 space-y-6 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <DialogTitle className="text-xl">Get Support</DialogTitle>

        </div>

        <div className="space-y-3">
          {contact && (
            <>
              <button onClick={() => open(`tel:${contact.number}`)} className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Call {contact.name}</div>
                  <div className="text-sm opacity-70">{contact.number}</div>
                </div>
              </button>

              <button onClick={() => open(`sms:${contact.number}`)} className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Text {contact.name}</div>
                </div>
              </button>
            </>
          )}

          <button onClick={() => open('tel:988')} className="w-full bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">988 Lifeline</div>
              <div className="text-sm opacity-70">24/7 US crisis support</div>
            </div>
          </button>

          <button onClick={() => open('tel:911')} className="w-full bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Local Emergency</div>
              <div className="text-sm opacity-70">911</div>
            </div>
          </button>

          {userProfile.safeWord && contact && (
            <button onClick={() => open(`sms:${contact?.number ?? ''}?body=${encodeURIComponent(userProfile.safeWord?.word ?? '')}`)} className="w-full bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 rounded-2xl p-4 flex items-center gap-3 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Send Safe-Word Check-In</div>
              </div>
            </button>
          )}
        </div>

        <Button
          onClick={() => setShowCrisisModal(false)}
          variant="outline"
          className="w-full"
        >
          Stay here with MindRecipe
        </Button>

        <DialogDescription className="text-xs text-center text-gray-500 dark:text-gray-400">
          MindRecipe is not emergency response.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
