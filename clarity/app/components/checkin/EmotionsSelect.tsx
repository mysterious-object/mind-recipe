import { haptic } from '../../host';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';
import { ArrowLeft, Plus, Star, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Emotion {
  id: string;
  label: string;
  group: 'wound-up' | 'heavy' | 'hurt' | 'okay' | 'content' | 'joyful' | 'proud';
  isCustom?: boolean;
}

interface EmotionGroup {
  id: 'wound-up' | 'heavy' | 'hurt' | 'okay' | 'content' | 'joyful' | 'proud';
  label: string;
  description: string;
  dotColor: string;
  gradient: string;
  icon: string;
  emotions: Emotion[];
  initialVisible: number;
}

const EMOTION_GROUPS: EmotionGroup[] = [
  {
    id: 'wound-up',
    label: 'Wound up',
    description: 'Tense, activated energy',
    dotColor: '#F97316',
    gradient: 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    icon: '⚡',
    emotions: [
      { id: 'angry', label: 'Angry', group: 'wound-up' },
      { id: 'frustrated', label: 'Frustrated', group: 'wound-up' },
      { id: 'stressed', label: 'Stressed', group: 'wound-up' },
      { id: 'overwhelmed', label: 'Overwhelmed', group: 'wound-up' },
      { id: 'anxious', label: 'Anxious', group: 'wound-up' },
      { id: 'wired', label: 'Wired', group: 'wound-up' },
      { id: 'irritable', label: 'Irritable', group: 'wound-up' },
    ],
    initialVisible: 4,
  },
  {
    id: 'heavy',
    label: 'Heavy',
    description: 'Low energy, shut down',
    dotColor: '#9333EA',
    gradient: 'from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30',
    icon: '🌙',
    emotions: [
      { id: 'exhausted', label: 'Exhausted', group: 'heavy' },
      { id: 'numb', label: 'Numb', group: 'heavy' },
      { id: 'empty', label: 'Empty', group: 'heavy' },
      { id: 'stuck', label: 'Stuck', group: 'heavy' },
      { id: 'hopeless', label: 'Hopeless', group: 'heavy' },
      { id: 'ashamed', label: 'Ashamed', group: 'heavy' },
      { id: 'checked-out', label: 'Checked out', group: 'heavy' },
    ],
    initialVisible: 4,
  },
  {
    id: 'hurt',
    label: 'Hurt',
    description: 'Alone, disconnected',
    dotColor: '#3B82F6',
    gradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
    icon: '💧',
    emotions: [
      { id: 'sad', label: 'Sad', group: 'hurt' },
      { id: 'lonely', label: 'Lonely', group: 'hurt' },
      { id: 'hurt', label: 'Hurt', group: 'hurt' },
      { id: 'rejected', label: 'Rejected', group: 'hurt' },
      { id: 'missing', label: 'Missing someone', group: 'hurt' },
    ],
    initialVisible: 4,
  },
  {
    id: 'okay',
    label: 'Calm',
    description: 'Steady, grounded',
    dotColor: '#14B8A6',
    gradient: 'from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30',
    icon: '🍃',
    emotions: [
      { id: 'calm', label: 'Calm', group: 'okay' },
      { id: 'peaceful', label: 'Peaceful', group: 'okay' },
      { id: 'centered', label: 'Centered', group: 'okay' },
      { id: 'relieved', label: 'Relieved', group: 'okay' },
      { id: 'grounded', label: 'Grounded', group: 'okay' },
      { id: 'soft', label: 'Soft', group: 'okay' },
      { id: 'kinda-okay', label: 'Kinda okay', group: 'okay' },
    ],
    initialVisible: 4,
  },
  {
    id: 'content',
    label: 'Grateful',
    description: 'Warm, connected',
    dotColor: '#10B981',
    gradient: 'from-green-100 to-lime-100 dark:from-green-900/30 dark:to-lime-900/30',
    icon: '🌱',
    emotions: [
      { id: 'grateful', label: 'Grateful', group: 'content' },
      { id: 'content', label: 'Content', group: 'content' },
      { id: 'satisfied', label: 'Satisfied', group: 'content' },
      { id: 'warm', label: 'Warm', group: 'content' },
      { id: 'loved', label: 'Loved', group: 'content' },
      { id: 'safe', label: 'Safe', group: 'content' },
      { id: 'appreciated', label: 'Appreciated', group: 'content' },
    ],
    initialVisible: 4,
  },
  {
    id: 'joyful',
    label: 'Joyful',
    description: 'Excited, energized',
    dotColor: '#F59E0B',
    gradient: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
    icon: '✨',
    emotions: [
      { id: 'happy', label: 'Happy', group: 'joyful' },
      { id: 'joyful', label: 'Joyful', group: 'joyful' },
      { id: 'excited', label: 'Excited', group: 'joyful' },
      { id: 'playful', label: 'Playful', group: 'joyful' },
      { id: 'energized', label: 'Energized', group: 'joyful' },
      { id: 'inspired', label: 'Inspired', group: 'joyful' },
      { id: 'alive', label: 'Alive', group: 'joyful' },
    ],
    initialVisible: 4,
  },
  {
    id: 'proud',
    label: 'Confident',
    description: 'Strong, capable',
    dotColor: '#EC4899',
    gradient: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30',
    icon: '💪',
    emotions: [
      { id: 'proud', label: 'Proud', group: 'proud' },
      { id: 'confident', label: 'Confident', group: 'proud' },
      { id: 'capable', label: 'Capable', group: 'proud' },
      { id: 'hopeful', label: 'Hopeful', group: 'proud' },
      { id: 'determined', label: 'Determined', group: 'proud' },
      { id: 'brave', label: 'Brave', group: 'proud' },
      { id: 'strong', label: 'Strong', group: 'proud' },
    ],
    initialVisible: 4,
  },
];

const COLOR_SUGGESTIONS = [
  '#F97316', '#3B82F6', '#9333EA', '#14B8A6',
  '#EF4444', '#10B981', '#F59E0B', '#EC4899',
];

export function EmotionsSelect() {
  const { setScreen, currentCheckIn, updateCurrentCheckIn, userProfile, popNavigation, updateUserProfile } = useApp();
  const { getBackgroundClasses, getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [selected, setSelected] = useState<string[]>(currentCheckIn.emotions || []);
  const [primaryEmotion, setPrimaryEmotion] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [newEmotionLabel, setNewEmotionLabel] = useState('');
  const [newEmotionColor, setNewEmotionColor] = useState(COLOR_SUGGESTIONS[0]);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [shuffledGroups, setShuffledGroups] = useState<EmotionGroup[]>(EMOTION_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchNotFound, setShowSearchNotFound] = useState(false);

  // Load saved custom emotions on mount
  React.useEffect(() => {
    if (userProfile.customEmotions && userProfile.customEmotions.length > 0) {
      const loadedEmotions: Emotion[] = userProfile.customEmotions.map(ce => ({
        id: ce.id,
        label: ce.label,
        group: ce.group as any,
        isCustom: true,
      }));
      setCustomEmotions(loadedEmotions);
    }
  }, []);

  const toggleEmotion = (emotionId: string) => {
    setSelected(prev => {
      const isSelected = prev.includes(emotionId);
      if (isSelected) {
        if (primaryEmotion === emotionId) {
          setPrimaryEmotion(null);
        }
        return prev.filter(e => e !== emotionId);
      } else {
        if (userProfile.haptics) {
          haptic();
        }
        return [...prev, emotionId];
      }
    });
  };

  const handleLongPressStart = (emotionId: string) => {
    if (!selected.includes(emotionId)) return;
    
    const timer = setTimeout(() => {
      setPrimaryEmotion(prev => prev === emotionId ? null : emotionId);
      if (userProfile.haptics) {
        haptic();
      }
    }, 500);
    
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleAddCustomEmotion = () => {
    if (!newEmotionLabel.trim()) return;

    const customEmotion: Emotion = {
      id: `custom-${Date.now()}`,
      label: newEmotionLabel.trim(),
      group: 'okay',
      isCustom: true,
    };

    const savedEmotion = {
      id: customEmotion.id,
      label: customEmotion.label,
      color: newEmotionColor,
      group: customEmotion.group,
    };
    updateUserProfile({
      customEmotions: [...(userProfile.customEmotions || []), savedEmotion]
    });

    setCustomEmotions(prev => [...prev, customEmotion]);
    setSelected(prev => [...prev, customEmotion.id]);
    setNewEmotionLabel('');
    setNewEmotionColor(COLOR_SUGGESTIONS[0]);
    setShowAddModal(false);
    setSearchQuery('');
    setShowSearchNotFound(false);

    if (userProfile.haptics) {
      haptic();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchNotFound(false);
    
    if (query.trim()) {
      const allEmotionLabels = [
        ...EMOTION_GROUPS.flatMap(g => g.emotions.map(e => e.label.toLowerCase())),
        ...customEmotions.map(e => e.label.toLowerCase()),
      ];
      
      const found = allEmotionLabels.some(label => 
        label.includes(query.toLowerCase())
      );
      
      if (!found) {
        setShowSearchNotFound(true);
      }
    }
  };

  const handleNext = () => {
    updateCurrentCheckIn({ emotions: selected });
    const returnScreen = popNavigation();
    if (returnScreen === 'just-log' || returnScreen === 'check-in-review') {
      setScreen(returnScreen);
    } else {
      setScreen('emotions-activation');
    }
  };

  const handleSkip = () => {
    updateCurrentCheckIn({ emotions: [] });
    const returnScreen = popNavigation();
    if (returnScreen === 'just-log' || returnScreen === 'check-in-review') {
      setScreen(returnScreen);
    } else {
      setScreen('emotions-activation');
    }
  };

  const getEmotionColor = (emotion: Emotion): string => {
    if (emotion.isCustom) {
      const savedEmotion = userProfile.customEmotions?.find(ce => ce.id === emotion.id);
      return savedEmotion?.color || newEmotionColor;
    }
    const group = EMOTION_GROUPS.find(g => g.id === emotion.group);
    return group?.dotColor || '#6B7280';
  };

  const filteredGroups = searchQuery.trim()
    ? shuffledGroups.map(group => ({
        ...group,
        emotions: group.emotions.filter(e => 
          e.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(group => group.emotions.length > 0)
    : shuffledGroups;

  const filteredCustomEmotions = searchQuery.trim()
    ? customEmotions.filter(e => 
        e.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customEmotions;

  return (
    <div className={`min-h-screen ${getBackgroundClasses()} relative transition-colors duration-700`}>
      <div className="max-w-4xl mx-auto p-6 py-8 space-y-6 pb-40">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('check-in-choice')}
            className={`flex items-center gap-2 ${getSubtextClasses()} hover:opacity-70 transition-all duration-200`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Title */}
        <div className="space-y-3 text-center">
          <h2 className={`text-3xl ${getTextClasses()} transition-colors duration-700`}>
            How are you feeling?
          </h2>
          <p className={`${getSubtextClasses()} transition-colors duration-700`}>
            Pick all that fit — tap and hold to mark your main feeling
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto">
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search feelings..."
            className={`w-full pr-10 ${getCardClasses()}`}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchNotFound(false);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${getSubtextClasses()} hover:opacity-70`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search not found */}
        {showSearchNotFound && searchQuery.trim() && (
          <div className={`max-w-md mx-auto ${getCardClasses()} rounded-2xl p-4 border border-purple-300 dark:border-purple-700`}>
            <div className="flex items-center justify-between gap-3">
              <p className={`text-sm ${getSubtextClasses()}`}>
                Can't find "{searchQuery}"? Create your own
              </p>
              <Button
                onClick={() => {
                  setNewEmotionLabel(searchQuery);
                  setShowAddModal(true);
                }}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Emotion Groups - Beautiful Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const visibleEmotions = isExpanded 
              ? group.emotions 
              : group.emotions.slice(0, group.initialVisible);
            const hasMore = group.emotions.length > group.initialVisible;
            const selectedInGroup = group.emotions.filter(e => selected.includes(e.id)).length;

            return (
              <div 
                key={group.id} 
                className={`
                  ${getCardClasses()} rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md
                  ${selectedInGroup > 0 ? 'ring-2' : ''}
                `}
                style={{
                  boxShadow: selectedInGroup > 0 ? `0 0 0 2px ${group.dotColor}` : 'none',
                }}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-br ${group.gradient} p-5 border-b border-gray-200/50 dark:border-gray-700/50`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{group.icon}</div>
                      <div>
                        <div className={`text-lg font-medium ${getTextClasses()} transition-colors duration-700`}>
                          {group.label}
                        </div>
                        <div className={`text-xs ${getSubtextClasses()}`}>
                          {selectedInGroup > 0 ? `${selectedInGroup} selected` : group.description}
                        </div>
                      </div>
                    </div>
                    {hasMore && (
                      <button
                        onClick={() => toggleGroupExpanded(group.id)}
                        className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                        aria-label={isExpanded ? 'Show less' : 'Show more'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" style={{ color: group.dotColor }} />
                        ) : (
                          <ChevronDown className="w-5 h-5" style={{ color: group.dotColor }} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Emotion chips */}
                <div className="p-4 flex flex-wrap gap-2">
                  {visibleEmotions.map(emotion => {
                    const isSelected = selected.includes(emotion.id);
                    const isPrimary = primaryEmotion === emotion.id;

                    return (
                      <button
                        key={emotion.id}
                        onClick={() => toggleEmotion(emotion.id)}
                        onMouseDown={() => handleLongPressStart(emotion.id)}
                        onMouseUp={handleLongPressEnd}
                        onMouseLeave={handleLongPressEnd}
                        onTouchStart={() => handleLongPressStart(emotion.id)}
                        onTouchEnd={handleLongPressEnd}
                        className={`
                          px-4 py-2 rounded-full transition-all text-sm font-medium relative
                          ${isSelected 
                            ? 'shadow-md transform scale-105' 
                            : 'hover:shadow-sm hover:scale-102'
                          }
                        `}
                        style={{
                          backgroundColor: isSelected 
                            ? group.dotColor 
                            : `${group.dotColor}12`,
                          color: isSelected 
                            ? '#FFFFFF' 
                            : group.dotColor,
                          borderWidth: '2px',
                          borderColor: isSelected ? group.dotColor : `${group.dotColor}30`,
                        }}
                      >
                        {emotion.label}
                        {isPrimary && (
                          <Star 
                            className="w-3 h-3 fill-current inline-block ml-1"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Custom emotions card */}
          {filteredCustomEmotions.length > 0 && (
            <div className={`${getCardClasses()} rounded-3xl overflow-hidden shadow-sm hover:shadow-md`}>
              <div className="bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 p-5 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className={`text-lg font-medium ${getTextClasses()}`}>
                      Your Feelings
                    </div>
                    <div className={`text-xs ${getSubtextClasses()}`}>
                      Custom emotions you've added
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-wrap gap-2">
                {filteredCustomEmotions.map(emotion => {
                  const isSelected = selected.includes(emotion.id);
                  const isPrimary = primaryEmotion === emotion.id;
                  const emotionColor = getEmotionColor(emotion);

                  return (
                    <button
                      key={emotion.id}
                      onClick={() => toggleEmotion(emotion.id)}
                      onMouseDown={() => handleLongPressStart(emotion.id)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(emotion.id)}
                      onTouchEnd={handleLongPressEnd}
                      className={`
                        px-4 py-2 rounded-full transition-all text-sm font-medium relative flex items-center gap-1.5
                        ${isSelected 
                          ? 'shadow-md transform scale-105' 
                          : 'hover:shadow-sm'
                        }
                      `}
                      style={{
                        backgroundColor: isSelected 
                          ? emotionColor 
                          : `${emotionColor}15`,
                        color: isSelected 
                          ? '#FFFFFF' 
                          : emotionColor,
                        borderWidth: '2px',
                        borderColor: isSelected ? emotionColor : `${emotionColor}40`,
                      }}
                    >
                      {emotion.label}
                      {isPrimary && (
                        <Star className="w-3 h-3 fill-current" />
                      )}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedCustomEmotions = (userProfile.customEmotions || []).filter(e => e.id !== emotion.id);
                            updateUserProfile({ customEmotions: updatedCustomEmotions });
                            setCustomEmotions(prev => prev.filter(e => e.id !== emotion.id));
                            setSelected(prev => prev.filter(id => id !== emotion.id));
                            if (primaryEmotion === emotion.id) {
                              setPrimaryEmotion(null);
                            }
                          }}
                          className="inline-flex items-center ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Add custom emotion button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAddModal(true)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full transition-all
              ${getCardClasses()} border-2 border-dashed border-purple-300 dark:border-purple-700
              hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md
              ${getSubtextClasses()}
            `}
          >
            <Plus className="w-4 h-4" />
            Add your own feeling
          </button>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${getCardClasses()} border-t p-6 shadow-lg backdrop-blur-xl`}>
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 py-6 rounded-full text-lg"
          >
            Skip
          </Button>
          <Button
            onClick={handleNext}
            disabled={selected.length === 0}
            className="flex-1 py-6 rounded-full text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50"
          >
            Continue {selected.length > 0 && `(${selected.length})`}
          </Button>
        </div>
      </div>

      {/* Add Custom Emotion Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Your Feeling</DialogTitle>
            <DialogDescription>
              Name this feeling in your own words
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emotion-name">Feeling name</Label>
              <Input
                id="emotion-name"
                value={newEmotionLabel}
                onChange={(e) => setNewEmotionLabel(e.target.value)}
                placeholder="e.g., Bittersweet, Restless..."
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Choose a color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_SUGGESTIONS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewEmotionColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      newEmotionColor === color ? 'ring-4 ring-offset-2 ring-purple-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomEmotion}
              disabled={!newEmotionLabel.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Add Feeling
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
