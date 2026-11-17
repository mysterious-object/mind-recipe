import { LifeDomain } from '../../types';

export const DOMAIN_OPTIONS: Record<LifeDomain, string[]> = {
  emotional: [
    'Relationship conflict',
    'Processing grief or loss',
    'Feeling overwhelmed',
    'Past trauma surfacing',
    'Feeling disconnected from myself',
    'Emotions feel too big',
    'Feeling proud of myself',
    'Experiencing joy or connection'
  ],
  physical: [
    'Chronic pain or discomfort',
    'Illness or symptoms',
    'Sleep issues',
    'Energy or fatigue',
    'Physical injury or recovery',
    'Medication effects',
    'Feeling physically strong',
    'Body feeling good today'
  ],
  social: [
    'Conflict with someone',
    'Loneliness or isolation',
    'Boundary issues',
    'Social anxiety or overwhelm',
    'Family stress or tension',
    'Feeling misunderstood',
    'Meaningful conversation',
    'Feeling supported and seen'
  ],
  spiritual: [
    'Questioning beliefs',
    'Disconnection from purpose',
    'Searching for meaning',
    'Moral or ethical conflict',
    'Seeking deeper connection',
    'Spiritual practice feeling empty',
    'Feeling aligned with values',
    'Sense of peace or gratitude'
  ],
  occupational: [
    'Work stress or pressure',
    'Job insecurity or uncertainty',
    'Burnout or exhaustion',
    'Conflict at work',
    'Career uncertainty',
    'Work-life balance',
    'Accomplishment at work',
    'Enjoying my work today'
  ],
  intellectual: [
    'Brain fog or difficulty focusing',
    'Lack of mental stimulation',
    'Information overload',
    'Creative block',
    'Learning challenges',
    'Decision paralysis or fatigue',
    'Learning something new',
    'Mental clarity and focus'
  ],
  environmental: [
    'Living situation stress',
    'Noise or crowding',
    'Safety concerns',
    'Clutter or disorganization',
    'Weather or seasonal effects',
    'Lack of nature or outdoor space',
    'Comfortable peaceful space',
    'Enjoying my surroundings'
  ],
  financial: [
    'Money stress or worry',
    'Debt concerns',
    'Job loss or income drop',
    'Unexpected expense',
    'Financial insecurity',
    'Planning or budgeting struggles',
    'Financial goal progress',
    'Feeling secure about money'
  ]
};
