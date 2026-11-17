import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, BookOpen, MessageCircle, Lightbulb, Sparkles } from 'lucide-react';

type ExploreMode = 'choice' | 'journal' | 'prompts' | 'learn';

export function UnderstandExplore() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, saveCheckIn } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [mode, setMode] = useState<ExploreMode>('choice');
  const [journalEntry, setJournalEntry] = useState(currentCheckIn.journalEntry || '');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showReframe, setShowReframe] = useState(false);

  const getPrompts = () => {
    const prompts: string[] = [];
    
    if (currentCheckIn.emotions?.includes('guilty') || currentCheckIn.emotions?.includes('ashamed')) {
      prompts.push("What would you say to a friend feeling this way?");
      prompts.push("What permission do you need to give yourself right now?");
      prompts.push("Where did you learn that you weren't allowed to need things?");
    }
    
    if (currentCheckIn.emotions?.includes('numb') || currentCheckIn.bodyZones?.includes('numb')) {
      prompts.push("If your numbness could talk, what would it be protecting you from?");
      prompts.push("When did you first learn to shut down instead of feel?");
      prompts.push("What would it be like to let one small feeling in?");
    }
    
    if (currentCheckIn.activation && currentCheckIn.activation > 7) {
      prompts.push("If all this energy could speak, what would it say?");
      prompts.push("What boundary wants to be set but hasn't been?");
      prompts.push("What are you most afraid will happen if you let this feeling move through you?");
    }
    
    if (currentCheckIn.lifeDomains?.includes('financial')) {
      prompts.push("What does financial security mean to you, beyond the money itself?");
      prompts.push("What are you most afraid of when you think about money?");
      prompts.push("What small step would ease even 5% of this stress?");
    }
    
    if (currentCheckIn.lifeDomains?.includes('social')) {
      prompts.push("What do you need from your relationships that you're not asking for?");
      prompts.push("When do you feel most yourself around others?");
      prompts.push("What would change if you believed you were enough, just as you are?");
    }
    
    // Default prompts
    if (prompts.length === 0) {
      prompts.push("What's weighing on you most right now?");
      prompts.push("What do you need that you're not giving yourself?");
      prompts.push("If you could say one thing without consequences, what would it be?");
    }
    
    return prompts;
  };

  const getRecommendedTopics = () => {
    const topics: Array<{ title: string; description: string }> = [];
    
    if (currentCheckIn.emotions?.includes('anxious') || currentCheckIn.emotions?.includes('overwhelmed')) {
      topics.push({
        title: "Understanding Anxiety",
        description: "Learn about your nervous system and why anxiety happens"
      });
      topics.push({
        title: "Grounding Techniques",
        description: "Practical tools for when you're feeling overwhelmed"
      });
    }
    
    if (currentCheckIn.emotions?.includes('numb') || currentCheckIn.bodyZones?.includes('numb')) {
      topics.push({
        title: "Dissociation & Freeze Response",
        description: "Why we shut down and how to come back gently"
      });
      topics.push({
        title: "Reconnecting with Your Body",
        description: "Safe ways to feel again without flooding"
      });
    }
    
    if (currentCheckIn.lifeDomains?.includes('social')) {
      topics.push({
        title: "Boundaries 101",
        description: "How to protect your energy without guilt"
      });
      topics.push({
        title: "Attachment Styles",
        description: "Understanding your relationship patterns"
      });
    }
    
    // Default
    if (topics.length === 0) {
      topics.push({
        title: "Emotional Regulation Basics",
        description: "Understanding and working with your feelings"
      });
      topics.push({
        title: "Self-Compassion",
        description: "Being kind to yourself when things are hard"
      });
    }
    
    return topics;
  };

  const getReframe = () => {
    if (currentCheckIn.emotions?.includes('guilty') || currentCheckIn.emotions?.includes('ashamed')) {
      return "Guilt often shows up when we're bumping against old rules that don't serve us anymore. You're allowed to outgrow what you were taught. You're allowed to need different things now.";
    }
    if (currentCheckIn.emotions?.includes('numb')) {
      return "Shutting down doesn't mean you're broken or lazy. It means your nervous system is protecting you the only way it knows how. That's wisdom, even if it doesn't feel like it.";
    }
    if (currentCheckIn.activation && currentCheckIn.activation > 7) {
      return "All that energy in your body is information, not a problem. Your system is trying to tell you something important—maybe about a boundary, maybe about a need. You're not overreacting.";
    }
    return "You're allowed to feel multiple things at once. Complexity isn't confusion—it's being human.";
  };

  const handleSaveJournal = () => {
    updateCurrentCheckIn({ journalEntry });
    setShowReframe(true);
  };

  const handleComplete = () => {
    saveCheckIn();
    setScreen('home');
  };

  const prompts = getPrompts();
  const topics = getRecommendedTopics();

  // Mode selection screen
  if (mode === 'choice') {
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          <button
            onClick={() => setScreen('home')}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="space-y-2">
            <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
              Understand & Explore
            </h2>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              Choose how you'd like to process what you're feeling
            </p>
          </div>

          <div className="space-y-4">
            {/* Open Journaling */}
            <button
              onClick={() => setMode('journal')}
              className={`w-full ${getCardClasses()} rounded-3xl p-8 text-left hover:shadow-xl transition-all shadow-lg space-y-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                  Open Journaling
                </div>
              </div>
              <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                Write freely about what's on your mind
              </p>
            </button>

            {/* Guided Prompts */}
            <button
              onClick={() => setMode('prompts')}
              className={`w-full ${getCardClasses()} rounded-3xl p-8 text-left hover:shadow-xl transition-all shadow-lg space-y-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                  Guided Prompts
                </div>
              </div>
              <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                Suggested questions based on what you're experiencing
              </p>
            </button>

            {/* Learn More */}
            <button
              onClick={() => setMode('learn')}
              className={`w-full ${getCardClasses()} rounded-3xl p-8 text-left hover:shadow-xl transition-all shadow-lg space-y-3`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <div className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                  Learn More
                </div>
              </div>
              <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                Recommended articles and resources for what you're going through
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Journaling mode
  if (mode === 'journal' && !showReframe) {
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          <button
            onClick={() => setMode('choice')}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="space-y-2">
            <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
              What's happening in your world right now?
            </h2>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              Just let it out. No judgment, no perfect words needed.
            </p>
          </div>

          <Textarea
            value={journalEntry}
            onChange={(e) => { setJournalEntry(e.target.value); updateCurrentCheckIn({ journalEntry: e.target.value }); }}
            placeholder="Start writing..."
            className={`min-h-[300px] ${getCardClasses()} transition-colors duration-700 text-base`}
            autoFocus
          />

          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className={`text-xs ${getSubtextClasses()}`}>
                If using a shared device, others with access may be able to see what you save.
              </p>
            </div>

            <Button
              onClick={handleSaveJournal}
              disabled={!journalEntry.trim()}
              className="w-full py-6 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
            >
              Save & Reflect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prompts mode
  if (mode === 'prompts') {
    if (!selectedPrompt) {
      return (
        <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
          <div className="max-w-2xl mx-auto py-8 space-y-8">
            <button
              onClick={() => setMode('choice')}
              className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-6 h-6 ${getTextClasses()}`} />
                <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
                  Choose a prompt
                </h2>
              </div>
              <p className={`${getSubtextClasses()} transition-colors duration-700`}>
                These are curated based on what you shared in your check-in
              </p>
            </div>

            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`w-full ${getCardClasses()} rounded-2xl p-6 text-left hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600`}
                >
                  <p className={`${getTextClasses()} transition-colors duration-700`}>
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Writing with selected prompt
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          <button
            onClick={() => setSelectedPrompt(null)}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to prompts
          </button>

          <div className={`${getCardClasses()} rounded-2xl p-6 border-l-4 border-purple-500 transition-colors duration-700`}>
            <p className={`text-lg ${getTextClasses()} italic transition-colors duration-700`}>
              {selectedPrompt}
            </p>
          </div>

          <Textarea
            value={journalEntry}
            onChange={(e) => { setJournalEntry(e.target.value); updateCurrentCheckIn({ journalEntry: e.target.value }); }}
            placeholder="Take your time..."
            className={`min-h-[300px] ${getCardClasses()} transition-colors duration-700 text-base`}
            autoFocus
          />

          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className={`text-xs ${getSubtextClasses()}`}>
                If using a shared device, others with access may be able to see what you save.
              </p>
            </div>

            <Button
              onClick={handleSaveJournal}
              disabled={!journalEntry.trim()}
              className="w-full py-6 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
            >
              Save & Reflect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Learn mode
  if (mode === 'learn') {
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          <button
            onClick={() => setMode('choice')}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="space-y-2">
            <h2 className={`text-2xl ${getTextClasses()} transition-colors duration-700`}>
              Recommended for you
            </h2>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              Based on what you're experiencing right now
            </p>
          </div>

          <div className="space-y-4">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => {

                  setScreen('learn');
                }}
                className={`w-full ${getCardClasses()} rounded-2xl p-6 text-left hover:shadow-lg transition-all`}
              >
                <div className={`${getTextClasses()} mb-2 transition-colors duration-700 font-medium`}>
                  {topic.title}
                </div>
                <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                  {topic.description}
                </p>
              </button>
            ))}
          </div>

          <div className="pt-4">
            <Button
              onClick={() => setScreen('learn')}
              variant="outline"
              className="w-full py-4 rounded-full"
            >
              Browse all topics
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Reframe screen (after journaling)
  if (showReframe) {
    return (
      <div className={`min-h-screen ${getBackgroundClasses()} p-6 pb-32 transition-colors duration-700`}>
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          <div className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 space-y-4 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Reflection</span>
            </div>
            <p className={`text-lg ${getTextClasses()} leading-relaxed transition-colors duration-700`}>
              {getReframe()}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
              Want a tiny next step for today?
            </h3>

            <div className="space-y-3">
              <button className={`w-full ${getCardClasses()} rounded-2xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
                <div className={`${getTextClasses()} transition-colors duration-700`}>
                  Shower + stretch for 2 minutes
                </div>
              </button>
              <button className={`w-full ${getCardClasses()} rounded-2xl p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
                <div className={`${getTextClasses()} transition-colors duration-700`}>
                  Answer one message, not all of them
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleComplete}
              className="w-full py-6 rounded-full bg-purple-600 hover:bg-purple-700"
            >
              Save this
            </Button>
            <button
              onClick={handleComplete}
              className={`w-full py-4 ${getSubtextClasses()} hover:opacity-70 transition-all`}
            >
              Save without a next step
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
