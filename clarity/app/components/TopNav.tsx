import brandMark from '../../../flutter/assets/branding/mind-recipe-mark.png';
import React, { useLayoutEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Home, Activity, BookOpen, Users, TrendingUp, Settings } from 'lucide-react';
import type { Screen } from '../types';

export function TopNav() {
  const { setScreen, screen, userProfile } = useApp();
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;
    const reveal = () => {
      const viewport = nav.getBoundingClientRect();
      const tab = active.getBoundingClientRect();
      if (tab.left < viewport.left) nav.scrollLeft += tab.left - viewport.left;
      else if (tab.right > viewport.right) nav.scrollLeft += tab.right - viewport.right;
    };
    reveal();
    // Folding the device or resizing text changes both the viewport and tab widths.
    const observer = new ResizeObserver(reveal);
    observer.observe(nav);
    for (const tab of nav.children) observer.observe(tab);
    return () => observer.disconnect();
  }, [screen]);

  const displayName = userProfile.name || 'friend';

  const navItems = [
    { screen: 'home' as Screen, label: 'Home', icon: Home },
    { screen: 'check-in-choice' as Screen, label: 'Check-In', icon: Activity },
    { screen: 'learn' as Screen, label: 'Mind Recipe', icon: BookOpen },
    { screen: 'connect' as Screen, label: 'Connect', icon: Users },
    { screen: 'insights' as Screen, label: 'Insights', icon: TrendingUp },
    { screen: 'settings' as Screen, label: 'Settings', icon: Settings },
  ];

  const isActive = (navScreen: Screen) => {
    // Match primary screens
    if (screen === navScreen) return true;
    
    // Special cases for sub-screens
    if (navScreen === 'check-in-choice') {
      return screen.includes('emotions') || screen.includes('compass') || screen === 'summary';
    }
    
    return false;
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-6 sm:py-4">
        {/* Branding */}
        <div className="mb-2 sm:mb-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><img src={brandMark} alt="" className="w-8 h-8 rounded-lg" /><h1 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
            MindRecipe
          </h1><span className="text-xs text-gray-600 dark:text-gray-300">by Context Field</span></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hello, {displayName}
          </p>
        </div>

        {/* Navigation */}
        <nav ref={navRef} aria-label="Main navigation" className="grid grid-cols-6 gap-0.5 sm:flex sm:gap-2 sm:overflow-x-auto scrollbar-hide sm:-mx-2 sm:px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.screen);
            
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => setScreen(item.screen)}
                className={`
                  flex min-w-0 flex-col items-center justify-center gap-0.5 py-1 sm:flex-row sm:gap-2 sm:px-4 sm:py-2 rounded-lg sm:whitespace-nowrap transition-all duration-200 min-h-[44px]
                  ${active 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs leading-tight font-medium [overflow-wrap:anywhere] sm:text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
