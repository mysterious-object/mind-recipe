// Types for MindRecipe app

export type Theme = 'light' | 'dark' | 'dim';
export type Vibe = 'warm-glow' | 'deep-night' | 'ocean-slow' | 'soft-dawn';
export type Pronouns = 'she/her' | 'he/him' | 'they/them' | 'custom';
export type CrisisPreference = 'calm-first' | 'crisis-first';
export type Activation = number;
export type ActivationType = 'helpful' | 'neutral' | 'too-much';
export type BodyZone = 'head' | 'throat' | 'chest' | 'stomach' | 'pelvis' | 'limbs' | 'numb';
export type LifeDomain = 'emotional' | 'physical' | 'social' | 'spiritual' | 'occupational' | 'intellectual' | 'environmental' | 'financial';
export type CompassQuadrant = 'high-protected' | 'low-protected' | 'high-open' | 'low-open';
export type RegulationGoal = 'calmer' | 'more-awake' | 'more-steady';
export type SafeWordAction = 'contact-trusted' | 'show-crisis' | 'log-silently' | 'steady-me';

export interface TrustedContact {
  id: string;
  name: string;
  number: string;
}

export interface CustomEmotion {
  id: string;
  label: string;
  color: string;
  group: 'wound-up' | 'heavy' | 'hurt' | 'okay' | 'content' | 'joyful' | 'proud';
}

export interface UserProfile {
  name: string;
  pronouns: Pronouns;
  customPronouns?: string;
  theme: Theme;
  vibe: Vibe;
  motion: boolean;
  soundscape: boolean;
  haptics: boolean;
  trustedContacts: TrustedContact[];
  crisisPreference?: CrisisPreference;
  safeWord?: {
    word: string;
    action: SafeWordAction;
  };
  customEmotions?: CustomEmotion[];
  trackCodeWord?: boolean;
  appLock?: boolean;
  journalLock?: boolean;
}

export interface DomainDetails {
  issues?: string[];
  note?: string;
}

export interface CheckInEntry {
  id: string;
  timestamp: string;
  emotions?: string[];
  activation?: Activation;
  activationType?: ActivationType;
  bodyZones: BodyZone[];
  lifeDomains: LifeDomain[];
  domainDetails?: Partial<Record<LifeDomain, DomainDetails>>;
  compassQuadrant?: CompassQuadrant;
  journalEntry?: string;
  actionTaken?: string;
  tags?: string[];
  isCodeWord?: boolean;
}

export type Screen = 
  | 'welcome'
  | 'onboarding-you'
  | 'onboarding-atmosphere'
  | 'onboarding-before-continue'
  | 'onboarding-safety'
  | 'home'
  | 'check-in-choice'
  | 'emotions-select'
  | 'emotions-activation'
  | 'emotions-body'
  | 'emotions-domain'
  | 'compass-map'
  | 'compass-body'
  | 'compass-domain'
  | 'summary'
  | 'check-in-review'
  | 'options-choice'
  | 'steady-me'
  | 'shift-state'
  | 'shift-state-old'
  | 'understand'
  | 'understand-explore'
  | 'just-log'
  | 'insights'
  | 'learn'
  | 'connect'
  | 'settings';
