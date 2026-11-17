import React from 'react';
import { BodyZone } from '../types';

interface BodyMapProps {
  selectedZones: BodyZone[];
  onZoneToggle: (zone: BodyZone) => void;
  activationLevel?: 'low' | 'medium' | 'high';
}

// Body zone color mapping
const BODY_ZONE_COLORS = {
  head: '#9333EA',      // Purple
  throat: '#1E40AF',    // Dark Blue
  chest: '#10B981',     // Green
  stomach: '#FBBF24',   // Yellow
  pelvis: '#F97316',    // Orange
  limbs: '#EF4444',     // Red
  numb: '#6B7280',      // Gray for numb
};

export function BodyMap({ selectedZones, onZoneToggle, activationLevel = 'medium' }: BodyMapProps) {
  const isSelected = (zone: BodyZone) => selectedZones.includes(zone);

  const getPulseIntensity = () => {
    if (activationLevel === 'high') return 'animate-pulse';
    if (activationLevel === 'medium') return 'animate-pulse opacity-75';
    return 'opacity-50';
  };

  const zones = [
    { id: 'head' as BodyZone, label: 'Head', color: BODY_ZONE_COLORS.head },
    { id: 'throat' as BodyZone, label: 'Throat', color: BODY_ZONE_COLORS.throat },
    { id: 'chest' as BodyZone, label: 'Chest', color: BODY_ZONE_COLORS.chest },
    { id: 'stomach' as BodyZone, label: 'Stomach', color: BODY_ZONE_COLORS.stomach },
    { id: 'pelvis' as BodyZone, label: 'Pelvis', color: BODY_ZONE_COLORS.pelvis },
    { id: 'limbs' as BodyZone, label: 'Arms & Legs', color: BODY_ZONE_COLORS.limbs },
  ];

  return (
    <div className="space-y-6">
      {/* Body silhouette */}
      <div className="relative w-64 h-96 mx-auto">
        <svg viewBox="0 0 200 400" className="w-full h-full">
          {/* Base silhouette - always visible */}
          <ellipse cx="100" cy="40" rx="30" ry="35" fill="#E5E7EB" className="dark:fill-gray-700" />
          <rect x="90" y="70" width="20" height="20" fill="#E5E7EB" className="dark:fill-gray-700" />
          <ellipse cx="100" cy="140" rx="45" ry="65" fill="#E5E7EB" className="dark:fill-gray-700" />
          <ellipse cx="60" cy="120" rx="12" ry="50" fill="#E5E7EB" className="dark:fill-gray-700" />
          <ellipse cx="140" cy="120" rx="12" ry="50" fill="#E5E7EB" className="dark:fill-gray-700" />
          <ellipse cx="80" cy="260" rx="18" ry="80" fill="#E5E7EB" className="dark:fill-gray-700" />
          <ellipse cx="120" cy="260" rx="18" ry="80" fill="#E5E7EB" className="dark:fill-gray-700" />

          {/* Interactive zones with body part colors */}
          {/* Head */}
          <ellipse 
            cx="100" 
            cy="40" 
            rx="35" 
            ry="40" 
            fill={isSelected('head') ? BODY_ZONE_COLORS.head : 'transparent'}
            opacity={isSelected('head') ? '0.5' : '0.1'}
            className={`cursor-pointer transition-all hover:opacity-30 ${isSelected('head') ? getPulseIntensity() : ''}`}
            onClick={() => onZoneToggle('head')}
          />
          
          {/* Throat */}
          <rect 
            x="85" 
            y="70" 
            width="30" 
            height="25" 
            rx="8" 
            fill={isSelected('throat') ? BODY_ZONE_COLORS.throat : 'transparent'}
            opacity={isSelected('throat') ? '0.5' : '0.1'}
            className={`cursor-pointer transition-all hover:opacity-30 ${isSelected('throat') ? getPulseIntensity() : ''}`}
            onClick={() => onZoneToggle('throat')}
          />
          
          {/* Chest */}
          <ellipse 
            cx="100" 
            cy="110" 
            rx="48" 
            ry="35" 
            fill={isSelected('chest') ? BODY_ZONE_COLORS.chest : 'transparent'}
            opacity={isSelected('chest') ? '0.5' : '0.1'}
            className={`cursor-pointer transition-all hover:opacity-30 ${isSelected('chest') ? getPulseIntensity() : ''}`}
            onClick={() => onZoneToggle('chest')}
          />
          
          {/* Stomach */}
          <ellipse 
            cx="100" 
            cy="155" 
            rx="42" 
            ry="30" 
            fill={isSelected('stomach') ? BODY_ZONE_COLORS.stomach : 'transparent'}
            opacity={isSelected('stomach') ? '0.5' : '0.1'}
            className={`cursor-pointer transition-all hover:opacity-30 ${isSelected('stomach') ? getPulseIntensity() : ''}`}
            onClick={() => onZoneToggle('stomach')}
          />
          
          {/* Pelvis */}
          <ellipse 
            cx="100" 
            cy="190" 
            rx="40" 
            ry="25" 
            fill={isSelected('pelvis') ? BODY_ZONE_COLORS.pelvis : 'transparent'}
            opacity={isSelected('pelvis') ? '0.5' : '0.1'}
            className={`cursor-pointer transition-all hover:opacity-30 ${isSelected('pelvis') ? getPulseIntensity() : ''}`}
            onClick={() => onZoneToggle('pelvis')}
          />
          
          {/* Arms & Legs */}
          <g 
            className={`cursor-pointer transition-all ${isSelected('limbs') ? getPulseIntensity() : ''}`}
            onClick={() => onZoneToggle('limbs')}
          >
            <ellipse 
              cx="60" 
              cy="120" 
              rx="15" 
              ry="55" 
              fill={isSelected('limbs') ? BODY_ZONE_COLORS.limbs : 'transparent'}
              opacity={isSelected('limbs') ? '0.5' : '0.1'}
              className="hover:opacity-30"
            />
            <ellipse 
              cx="140" 
              cy="120" 
              rx="15" 
              ry="55" 
              fill={isSelected('limbs') ? BODY_ZONE_COLORS.limbs : 'transparent'}
              opacity={isSelected('limbs') ? '0.5' : '0.1'}
              className="hover:opacity-30"
            />
            <ellipse 
              cx="80" 
              cy="260" 
              rx="22" 
              ry="85" 
              fill={isSelected('limbs') ? BODY_ZONE_COLORS.limbs : 'transparent'}
              opacity={isSelected('limbs') ? '0.5' : '0.1'}
              className="hover:opacity-30"
            />
            <ellipse 
              cx="120" 
              cy="260" 
              rx="22" 
              ry="85" 
              fill={isSelected('limbs') ? BODY_ZONE_COLORS.limbs : 'transparent'}
              opacity={isSelected('limbs') ? '0.5' : '0.1'}
              className="hover:opacity-30"
            />
          </g>
        </svg>
      </div>

      {/* Zone buttons */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {zones.map(zone => (
          <button
            key={zone.id}
            onClick={() => onZoneToggle(zone.id)}
            className={`p-4 rounded-2xl transition-all min-h-[48px] flex items-center gap-3 ${
              isSelected(zone.id)
                ? 'shadow-lg'
                : 'hover:shadow-md'
            }`}
            style={{
              backgroundColor: isSelected(zone.id) 
                ? `${zone.color}20` 
                : undefined,
              borderColor: isSelected(zone.id) 
                ? zone.color 
                : undefined,
              borderWidth: isSelected(zone.id) ? '2px' : '1px',
              color: isSelected(zone.id)
                ? zone.color
                : undefined,
            }}
          >
            {/* Color indicator dot */}
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: zone.color }}
            />
            <span className="flex-1 text-left">{zone.label}</span>
          </button>
        ))}
        <button
          onClick={() => onZoneToggle('numb')}
          className={`p-4 rounded-2xl transition-all col-span-2 min-h-[48px] flex items-center gap-3 ${
            isSelected('numb')
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {/* Color indicator dot */}
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: BODY_ZONE_COLORS.numb }}
          />
          <span className="flex-1 text-left">Numb / can't feel</span>
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Tap the body or choose from the buttons
      </p>
    </div>
  );
}
