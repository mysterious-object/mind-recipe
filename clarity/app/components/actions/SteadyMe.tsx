import { playSoundscape } from '../../soundscape';
import { haptic } from '../../host';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../hooks/useTheme';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';

interface SteadyMeProps {
  returnTo: 'home' | 'help-modal';
  onClose: () => void;
  onOpenSupport?: () => void;
}

const BREATH_PHRASES = [
  { in: { main: 'In', sub: "I'm right here." }, out: { main: 'Out', sub: "Let it drop." } },
  { in: { main: 'Breathe in', sub: "I'm right here." }, out: { main: 'Let it go', sub: "Let it drop." } },
  { in: { main: 'Fill', sub: "I'm right here." }, out: { main: 'Soften', sub: "Let it drop." } },
];

export function SteadyMe({ returnTo, onClose, onOpenSupport }: SteadyMeProps) {
  const { userProfile, markMoment, setShowCrisisModal } = useApp();
  const { getVibeColors } = useTheme();
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathCycles, setBreathCycles] = useState(0);
  const [showNextSheet, setShowNextSheet] = useState(false);
  const [prompted, setPrompted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => { if (userProfile.soundscape) return playSoundscape(300); }, [userProfile.soundscape]);

  const vibeColors = getVibeColors(userProfile.vibe);
  const currentPhrase = BREATH_PHRASES[phraseIndex];

  useEffect(() => {
    const inhaleTime = 4000;
    const exhaleTime = 5500;

    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('exhale');
      } else {
        setPhase('inhale');
        setBreathCycles(prev => prev + 1);
        // Rotate phrases every 3 cycles
        if ((breathCycles + 1) % 3 === 0) {
          setPhraseIndex((prev) => (prev + 1) % BREATH_PHRASES.length);
        }
      }
    }, phase === 'inhale' ? inhaleTime : exhaleTime);

    // Haptics - respects user preference
    if (userProfile.haptics) {
      if (phase === 'inhale') {
        haptic(); // tiny tap at start of In
      } else {
        haptic(); // longer, softer release during Out
      }
    }

    return () => clearTimeout(timer);
  }, [phase, userProfile.haptics, breathCycles]);

  // Show "Next?" sheet after 2 complete cycles
  useEffect(() => {
    if (breathCycles >= 2 && !prompted) {
      setPrompted(true);
      setShowNextSheet(true);
    }
  }, [breathCycles, prompted]);

  const orbScale = phase === 'inhale' ? 1.08 : 0.92;
  const haloOpacity = phase === 'inhale' ? 0.5 : 0.25;

  const handleMarkMoment = () => {
    markMoment();
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleGetSupport = () => {
    setShowNextSheet(false);
    if (onOpenSupport && typeof onOpenSupport === 'function') {
      onOpenSupport();
    } else {
      setShowCrisisModal(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: vibeColors.background,
      }}
    >
      {/* Background aura - respects motion preference */}
      {userProfile.motion ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${vibeColors.blob1}, transparent)`,
              top: '10%',
              left: '20%',
            }}
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${vibeColors.blob2}, transparent)`,
              top: '40%',
              right: '15%',
            }}
            animate={{
              x: [0, -25, 0],
              y: [0, 20, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${vibeColors.blob1}, transparent)`,
              top: '10%',
              left: '20%',
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${vibeColors.blob2}, transparent)`,
              top: '40%',
              right: '15%',
            }}
          />
        </div>
      )}

      {/* Center breathing orb */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative">
          {/* Outer halo */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              width: '320px',
              height: '320px',
              left: '50%',
              top: '50%',
              marginLeft: '-160px',
              marginTop: '-160px',
              background: `radial-gradient(circle, ${vibeColors.orbGlow}, transparent)`,
            }}
            animate={{
              opacity: haloOpacity,
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : 5.5,
              ease: [0.445, 0.05, 0.55, 0.95], // easeInOutSine
            }}
          />

          {/* Main orb */}
          <motion.div
            className="relative rounded-full shadow-2xl flex flex-col items-center justify-center"
            style={{
              width: '220px',
              height: '220px',
              background: vibeColors.orbCore,
              boxShadow: `0 0 60px ${vibeColors.orbGlow}, 0 0 100px ${vibeColors.orbGlow}40`,
            }}
            animate={{
              scale: orbScale,
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : 5.5,
              ease: [0.445, 0.05, 0.55, 0.95], // easeInOutSine
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-2"
              >
                <div className="text-4xl font-light text-white">
                  {phase === 'inhale' ? currentPhrase.in.main : currentPhrase.out.main}
                </div>
                <div className="text-sm text-white/80">
                  {phase === 'inhale' ? currentPhrase.in.sub : currentPhrase.out.sub}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* I'm Okay / Back button at bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center px-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 shadow-2xl border-2 border-gray-300 dark:border-gray-600 transition-all hover:scale-105 min-h-[56px] font-medium text-lg"
        >
          <X className="w-5 h-5" />
          <span>I'm okay / Back</span>
        </button>
      </div>

      {/* "Next?" sheet after 2 cycles */}
      <Sheet open={showNextSheet} onOpenChange={setShowNextSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-xl">Next?</SheetTitle>
            <SheetDescription>
              Choose what feels best right now.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-3 py-4">
            <Button
              onClick={() => setShowNextSheet(false)}
              className="w-full h-auto py-5 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg"
            >
              Keep breathing
            </Button>

            <Button
              onClick={handleGetSupport}
              className="w-full h-auto py-5 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg"
            >
              Help me get support
            </Button>

            <Button
              onClick={handleMarkMoment}
              className="w-full h-auto py-5 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 shadow-lg"
            >
              Just mark this moment
            </Button>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mt-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                I can sit with you, help your body settle, or show you support options. I can't call for you automatically, and I'm not an emergency service.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
