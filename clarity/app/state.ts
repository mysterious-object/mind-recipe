import type { UserProfile, CheckInEntry, Screen, BodyZone, LifeDomain, CompassQuadrant, RegulationGoal, ActivationType } from './types';

export interface CurrentCheckIn {
  id: string;
  emotions?: string[];
  activation?: number;
  activationType?: ActivationType;
  bodyZones: BodyZone[];
  lifeDomains: LifeDomain[];
  domainDetails?: Partial<Record<LifeDomain, { issues?: string[]; note?: string }>>;
  compassQuadrant?: CompassQuadrant;
  compassPoint?: { x: number; y: number };
  regulationGoal?: RegulationGoal;
  journalEntry?: string;
}

export interface Snapshot {
  version: 1;
  profile: UserProfile;
  screen: Screen;
  onboardingComplete: boolean;
  draft: CurrentCheckIn;
  history: CheckInEntry[];
  navigationStack: Screen[];
}

export const newDraft = (): CurrentCheckIn => ({
  id: `check-in-${Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16).padStart(8, '0')).join('')}`,
  bodyZones: [],
  lifeDomains: [],
});

export function initialSnapshot(saved?: Partial<Snapshot> | null): Snapshot {
  const profile: UserProfile = {
    name: '', pronouns: 'they/them', theme: 'light', vibe: 'soft-dawn',
    motion: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    soundscape: false, haptics: true, trustedContacts: [], customEmotions: [],
    trackCodeWord: false, ...saved?.profile,
  };
  return {
    version: 1, profile, screen: saved?.screen ?? 'welcome',
    onboardingComplete: saved?.onboardingComplete ?? false,
    draft: saved?.draft ?? newDraft(), history: saved?.history ?? [],
    navigationStack: saved?.navigationStack ?? [],
  };
}

export function hasData(draft: CurrentCheckIn): boolean {
  return Boolean(draft.emotions?.length || draft.compassQuadrant ||
    draft.activation !== undefined || draft.bodyZones.length || draft.lifeDomains.length ||
    draft.journalEntry?.trim());
}

export function withSavedCheckIn(snapshot: Snapshot, tags?: string[]): Snapshot {
  const entry: CheckInEntry = { ...snapshot.draft, timestamp: new Date().toISOString(), tags };
  return {
    ...snapshot,
    history: [entry, ...snapshot.history.filter(item => item.id !== entry.id)],
    draft: newDraft(), navigationStack: [],
  };
}

export function withCompletedSession(snapshot: Snapshot): Snapshot {
  const saved = hasData(snapshot.draft) ? withSavedCheckIn(snapshot) : snapshot;
  return { ...saved, screen: 'home', navigationStack: [] };
}

export function dayOrdinal(timestamp: string): number {
  const date = new Date(timestamp);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
}

export function streaks(history: CheckInEntry[], today = new Date()): { current: number; longest: number } {
  const days = [...new Set(history.map(item => dayOrdinal(item.timestamp)))].sort((a, b) => b - a);
  const todayDay = dayOrdinal(today.toISOString());
  let current = 0, longest = 0, run = 0;
  days.forEach((day, index) => {
    run = index > 0 && days[index - 1] - day === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    if (day === todayDay - current) current++;
  });
  return { current, longest };
}
