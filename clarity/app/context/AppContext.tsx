import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { UserProfile, CheckInEntry, Screen } from '../types';
import { initialSnapshot, newDraft, hasData, withSavedCheckIn, type CurrentCheckIn, type Snapshot } from '../state';
import { loadSnapshot, saveSnapshot, nativeRequest, isNative } from '../host';

interface AppContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  currentCheckIn: CurrentCheckIn;
  updateCurrentCheckIn: (updates: Partial<CurrentCheckIn>) => void;
  resetCurrentCheckIn: () => void;
  checkInHistory: CheckInEntry[];
  saveCheckIn: (tags?: string[]) => void;
  finishCheckIn: () => void;
  showCrisisModal: boolean;
  setShowCrisisModal: (show: boolean) => void;
  navigationStack: Screen[];
  pushNavigation: (screen: Screen) => void;
  popNavigation: () => Screen | undefined;
  clearNavigation: () => void;
  hasCheckInData: () => boolean;
  markMoment: () => void;
  reportError: (error: unknown) => void;
  flushChanges: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const state = useRef<Snapshot | null>(null);
  const writes = useRef(Promise.resolve());
  const [error, setError] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const reportError = (cause: unknown) => setError(cause instanceof Error ? cause.message : 'Please try again.');

  useEffect(() => {
    let active = true;
    loadSnapshot().then(saved => {
      if (!active) return;
      state.current = initialSnapshot(saved);
      setSnapshot(state.current);
    }).catch(reportError);
    return () => { active = false; };
  }, []);

  const persist = (value: Snapshot) => {
    writes.current = writes.current.catch(() => {}).then(() => saveSnapshot(value));
    writes.current.catch(() => setError('Your changes could not be saved. Please retry before closing.'));
  };
  const update = (transform: (current: Snapshot) => Snapshot) => {
    if (!state.current) return;
    const next = transform(state.current);
    state.current = next;
    setSnapshot(next);
    persist(next);
  };
  const setScreen = (screen: Screen) => {
    update(current => ({ ...current, screen,
      onboardingComplete: current.onboardingComplete || screen === 'home' }));
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!snapshot) return;
    document.documentElement.classList.toggle('dark', snapshot.profile.theme !== 'light');
    document.documentElement.classList.toggle('reduce-motion', !snapshot.profile.motion);
    window.mindRecipeBack = () => {
      if (showCrisisModal) setShowCrisisModal(false);
      else setScreen(snapshot.onboardingComplete ? 'home' : 'welcome');
    };
    if (isNative()) void nativeRequest('screen', snapshot.screen).catch(reportError);
    return () => { delete window.mindRecipeBack; };
  }, [snapshot?.screen, snapshot?.profile.theme, snapshot?.profile.motion, showCrisisModal]);

  const updateDraft = (updates: Partial<CurrentCheckIn>) => {
    const previous = state.current!;
    update(current => ({ ...current, draft: { ...current.draft, ...updates } }));
    const code = previous.profile.safeWord;
    if (!code || !updates.journalEntry || updates.journalEntry === previous.draft.journalEntry ||
        updates.journalEntry.trim().toLocaleLowerCase() !== code.word.trim().toLocaleLowerCase()) return;
    if (code.action === 'steady-me') {
      update(current => ({ ...current, navigationStack: [...current.navigationStack, current.screen], screen: 'steady-me' }));
    } else if (code.action === 'log-silently') {
      update(current => ({ ...current, history: [{ ...newDraft(), timestamp: new Date().toISOString(), tags: ['code-word'], isCodeWord: true }, ...current.history] }));
    } else setShowCrisisModal(true);
  };

  const retry = () => {
    setError('');
    if (state.current) persist(state.current);
    else window.location.reload();
  };

  return <>
    {error && <div role="alert" className="fixed top-0 inset-x-0 z-[100] bg-red-50 text-red-900 p-4 shadow-lg">
      {error} <button className="underline font-semibold" onClick={retry}>Retry</button>
      <button className="ml-4 underline" onClick={() => setError('')}>Dismiss</button>
    </div>}
    {!snapshot ? <div role="status" className="p-8">Opening MindRecipe…</div> :
      <AppContext.Provider value={{
        screen: snapshot.screen, setScreen, userProfile: snapshot.profile,
        updateUserProfile: updates => update(current => ({ ...current, profile: { ...current.profile, ...updates } })),
        currentCheckIn: snapshot.draft,
        updateCurrentCheckIn: updateDraft,
        resetCurrentCheckIn: () => update(current => ({ ...current, draft: newDraft() })),
        checkInHistory: snapshot.history,
        saveCheckIn: tags => update(current => withSavedCheckIn(current, tags)),
        finishCheckIn: () => {
          update(current => ({
            ...(hasData(current.draft) ? withSavedCheckIn(current) : current),
            screen: 'home', navigationStack: [],
          }));
          window.scrollTo(0, 0);
        },
        showCrisisModal, setShowCrisisModal,
        navigationStack: snapshot.navigationStack,
        pushNavigation: screen => update(current => ({ ...current, navigationStack: [...current.navigationStack, screen] })),
        popNavigation: () => {
          const screen = state.current?.navigationStack.at(-1);
          update(current => ({ ...current, navigationStack: current.navigationStack.slice(0, -1) }));
          return screen;
        },
        clearNavigation: () => update(current => ({ ...current, navigationStack: [] })),
        hasCheckInData: () => hasData(state.current!.draft),
        markMoment: () => update(current => ({ ...current, history: [{
          ...newDraft(), timestamp: new Date().toISOString(), tags: ['distress-moment'],
        }, ...current.history] })),
        reportError, flushChanges: () => writes.current,
      }}>{children}</AppContext.Provider>}
  </>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('AppProvider is required.');
  return context;
}
