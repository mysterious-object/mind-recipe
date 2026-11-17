import { useApp } from '../context/AppContext';
import { Theme } from '../types';

export function useTheme() {
  const { userProfile } = useApp();
  const theme = userProfile.theme;

  // Background gradients
  const getBackgroundClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-gradient-to-b from-slate-50 via-purple-50/30 to-white';
      case 'dim':
        return 'bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700';
      case 'dark':
        return 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950';
    }
  };

  // Primary text color
  const getTextClasses = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-900';
      case 'dim':
        return 'text-gray-100';
      case 'dark':
        return 'text-gray-100';
    }
  };

  // Secondary text color
  const getSubtextClasses = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-500';
      case 'dim':
        return 'text-gray-400';
      case 'dark':
        return 'text-gray-400';
    }
  };

  // Muted text color
  const getMutedTextClasses = () => {
    switch (theme) {
      case 'light':
        return 'text-gray-600';
      case 'dim':
        return 'text-gray-400';
      case 'dark':
        return 'text-gray-400';
    }
  };

  // Card/panel backgrounds
  const getCardClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white/70 border-gray-200/50';
      case 'dim':
        return 'bg-gray-800/60 border-gray-600/30';
      case 'dark':
        return 'bg-gray-800/70 border-gray-700/50';
    }
  };

  // Solid card backgrounds (no transparency)
  const getSolidCardClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white border-gray-200';
      case 'dim':
        return 'bg-gray-800 border-gray-600';
      case 'dark':
        return 'bg-gray-900 border-gray-700';
    }
  };

  // Border colors
  const getBorderClasses = () => {
    switch (theme) {
      case 'light':
        return 'border-gray-200';
      case 'dim':
        return 'border-gray-600';
      case 'dark':
        return 'border-gray-700';
    }
  };

  // Hover background for interactive elements
  const getHoverClasses = () => {
    switch (theme) {
      case 'light':
        return 'hover:bg-gray-100';
      case 'dim':
        return 'hover:bg-gray-700';
      case 'dark':
        return 'hover:bg-gray-800';
    }
  };

  // Active/selected state
  const getActiveClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'dim':
        return 'bg-purple-900/30 text-purple-200 border-purple-700';
      case 'dark':
        return 'bg-purple-900/40 text-purple-200 border-purple-600';
    }
  };

  // Aura/glow styling
  const getAuraStyle = () => {
    switch (theme) {
      case 'light':
        return {
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)',
          opacity: 0.4,
        };
      case 'dim':
        return {
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12), transparent)',
          opacity: 0.5,
        };
      case 'dark':
        return {
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)',
          opacity: 0.6,
        };
    }
  };

  // Input/form field styles
  const getInputClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400';
      case 'dim':
        return 'bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-500';
      case 'dark':
        return 'bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500';
    }
  };

  // Divider colors
  const getDividerClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-gray-200';
      case 'dim':
        return 'bg-gray-600';
      case 'dark':
        return 'bg-gray-700';
    }
  };

  // Vibe-based colors for breathing orb and backgrounds
  const getVibeColors = (vibe: string) => {
    switch (vibe) {
      case 'warm-glow':
        return {
          background: 'linear-gradient(135deg, #FFF5E6 0%, #FFEFD5 50%, #FFE4B5 100%)',
          blob1: 'rgba(255, 165, 0, 0.3)',
          blob2: 'rgba(255, 140, 0, 0.25)',
          orbCore: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #FF5722 100%)',
          orbGlow: 'rgba(255, 140, 0, 0.6)',
        };
      case 'deep-night':
        return {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          blob1: 'rgba(79, 70, 229, 0.4)',
          blob2: 'rgba(99, 102, 241, 0.35)',
          orbCore: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
          orbGlow: 'rgba(139, 92, 246, 0.8)',
        };
      case 'ocean-slow':
        return {
          background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
          blob1: 'rgba(59, 130, 246, 0.3)',
          blob2: 'rgba(94, 234, 212, 0.28)',
          orbCore: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #2563EB 100%)',
          orbGlow: 'rgba(59, 130, 246, 0.7)',
        };
      case 'soft-dawn':
        return {
          background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E8 50%, #FFD6E0 100%)',
          blob1: 'rgba(251, 113, 133, 0.28)',
          blob2: 'rgba(244, 114, 182, 0.25)',
          orbCore: 'linear-gradient(135deg, #FB7185 0%, #F472B6 50%, #EC4899 100%)',
          orbGlow: 'rgba(251, 113, 133, 0.6)',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E8 50%, #FFD6E0 100%)',
          blob1: 'rgba(251, 113, 133, 0.28)',
          blob2: 'rgba(244, 114, 182, 0.25)',
          orbCore: 'linear-gradient(135deg, #FB7185 0%, #F472B6 50%, #EC4899 100%)',
          orbGlow: 'rgba(251, 113, 133, 0.6)',
        };
    }
  };

  return {
    theme,
    getBackgroundClasses,
    getTextClasses,
    getSubtextClasses,
    getMutedTextClasses,
    getCardClasses,
    getSolidCardClasses,
    getBorderClasses,
    getHoverClasses,
    getActiveClasses,
    getAuraStyle,
    getInputClasses,
    getDividerClasses,
    getVibeColors,
  };
}
