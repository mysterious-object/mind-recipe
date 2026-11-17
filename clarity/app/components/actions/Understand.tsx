import { isNative, nativeRequest } from '../../host';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Mic } from 'lucide-react';

export function Understand() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, saveCheckIn, reportError } = useApp();
  const [journalEntry, setJournalEntry] = useState(currentCheckIn.journalEntry || '');
  const [listening, setListening] = useState(false);
  const [showReframe, setShowReframe] = useState(false);

  const getPrompt = () => {
    if (currentCheckIn.emotions?.includes('guilty') || currentCheckIn.emotions?.includes('ashamed')) {
      return "You're so tired and you feel guilty for resting. Tell me about that voice.";
    }
    if (currentCheckIn.emotions?.includes('numb')) {
      return "You're feeling numb and shut down. What does that numbness protect you from feeling?";
    }
    if ((currentCheckIn.activation ?? 0) >= 7) {
      return "There's so much energy in your body right now. What is it trying to tell you?";
    }
    if (currentCheckIn.lifeDomains.includes('financial')) {
      return "Money stress is heavy. What feels most overwhelming about it right now?";
    }
    return "What's happening in your world right now? Just let it out.";
  };

  const getReframe = () => {
    if (currentCheckIn.emotions?.includes('guilty')) {
      return "It's valid to need rest AND still want to feel productive. You're not failing.";
    }
    if (currentCheckIn.emotions?.includes('numb')) {
      return "Shutting down doesn't mean you're lazy. It means your nervous system is trying to protect you. That's wisdom.";
    }
    return "You're allowed to feel multiple things at once. Complexity is human.";
  };

  const handleSave = () => {
    updateCurrentCheckIn({ journalEntry });
    setShowReframe(true);
  };

  const handleComplete = () => {
    saveCheckIn();
    setScreen('home');
  };

  if (showReframe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-3xl p-8 space-y-4">
            <p className="text-lg text-green-900 dark:text-green-100">
              {getReframe()}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl text-gray-900 dark:text-gray-100">
              Want a tiny next step for today?
            </h3>

            <div className="space-y-3">
              <button onClick={handleComplete} className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="text-gray-900 dark:text-gray-100">Shower + stretch for 2 minutes</div>
              </button>
              <button onClick={handleComplete} className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="text-gray-900 dark:text-gray-100">Answer one message, not all of them</div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleComplete}
              className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700"
            >
              Save this
            </Button>
            <button
              onClick={handleComplete}
              className="w-full py-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Save without a next step
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100">
            Let's make sense of this.
          </h2>
        </div>

        <div className="bg-purple-100/50 dark:bg-purple-900/20 rounded-2xl p-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {getPrompt()}
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={journalEntry}
            onChange={(e) => { setJournalEntry(e.target.value); updateCurrentCheckIn({ journalEntry: e.target.value }); }}
            placeholder="Write or speak your thoughts..."
            className="min-h-64 text-lg rounded-2xl"
          />

          <button disabled={!isNative() || listening} onClick={async () => {
            setListening(true);
            try { const text = await nativeRequest<string>('dictate'); if (text) { const next = journalEntry + (journalEntry ? '\n' : '') + text; setJournalEntry(next); updateCurrentCheckIn({ journalEntry: next }); } }
            catch (error) { reportError(error); } finally { setListening(false); }
          }} className="w-full p-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-3">
            <Mic className="w-5 h-5" />
            <span>{listening ? 'Listening…' : 'Dictate a note'}</span>
          </button>
        </div>

        {/* Learn More Cards */}
        <div className="space-y-3">
          <h3 className="text-gray-900 dark:text-gray-100">Learn more:</h3>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => setScreen('learn')} className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div className="text-sm text-gray-900 dark:text-gray-100">
                Why shutting down doesn't mean you're lazy
              </div>
            </button>
            <button onClick={() => setScreen('learn')} className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div className="text-sm text-gray-900 dark:text-gray-100">
                Why your chest gets tight around money stress
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              If using a shared device, others with access may be able to see what you save.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!journalEntry.trim()}
            className="w-full py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
