import React from 'react';
import { Spot } from '../types';
import { getCategoryStyle, getSpotPhoto, formatCoords } from '../utils/helpers';
import { MapPin, Calendar, ExternalLink, ImageOff } from 'lucide-react';
import { NogglesIcon } from './NogglesIcon';

interface SpotCardProps {
  spot: Spot;
  isSelected: boolean;
  onSelect: (spot: Spot) => void;
  onOpenDetails: (spot: Spot) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  isSelected,
  onSelect,
  onOpenDetails
}) => {
  const photo = getSpotPhoto(spot);
  const style = getCategoryStyle(spot.category);

  return (
    <div
      onClick={() => onSelect(spot)}
      className={`group relative flex flex-col bg-white border-2 transition-all cursor-pointer rounded-lg overflow-hidden select-none ${
        isSelected
          ? 'border-zinc-950 shadow-noun-md ring-2 ring-zinc-950/10'
          : 'border-zinc-200 hover:border-zinc-950 hover:shadow-noun-sm'
      }`}
    >
      {/* Top Media Bar */}
      <div className="relative w-full h-36 bg-zinc-100 overflow-hidden border-b border-zinc-200 flex items-center justify-center">
        {photo ? (
          <img
            src={photo}
            alt={spot.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex flex-col items-center justify-center p-4 text-zinc-400">
                    <span class="text-xs font-mono font-medium">Nounish Spot</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-4">
            <img src="/noggles.png" alt="Noggles" className="h-7 w-auto object-contain opacity-85 group-hover:scale-110 transition-transform" />
            <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              {spot.category || 'Nounish Spot'}
            </span>
          </div>
        )}

        {/* Category Pill Over Media */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded shadow-sm border ${style.border} ${style.bg} ${style.text}`}>
            {spot.category || 'Thing'}
          </span>
          {spot.community && spot.community.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-950 text-white shadow-sm">
              {spot.community[0]}
            </span>
          )}
        </div>

        {/* Event Badge if present */}
        {spot.eventDate && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold shadow-sm">
            <Calendar className="w-3 h-3" />
            <span>{spot.eventDate}</span>
          </div>
        )}
      </div>

      {/* Card Content (Maximized Density & Minimal Clutter) */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h3 className="font-bold text-zinc-950 text-sm leading-snug line-clamp-1 group-hover:text-noun-red transition-colors">
            {spot.name}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
            {spot.description || spot.address || 'No additional description.'}
          </p>
        </div>

        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-1 truncate max-w-[170px]" title={spot.address}>
            <MapPin className="w-3 h-3 shrink-0 text-zinc-400" />
            <span className="truncate">{spot.address?.split(',').slice(-2).join(',') || formatCoords(spot.locationLat, spot.locationLng)}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(spot);
            }}
            className="px-2 py-1 text-[11px] font-bold text-zinc-800 hover:text-white bg-zinc-100 hover:bg-zinc-950 rounded transition"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
