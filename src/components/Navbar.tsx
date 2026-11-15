import React from 'react';
import { ViewMode, FilterState, Spot } from '../types';
import { NogglesIcon } from './NogglesIcon';
import { 
  Map, 
  Columns, 
  Table, 
  FolderTree, 
  Download, 
  Search, 
  X, 
  SlidersHorizontal,
  Image,
  Calendar
} from 'lucide-react';

interface NavbarProps {
  totalSpots: number;
  filteredCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onOpenExport: () => void;
  categoryCounts: Record<string, number>;
  communityCounts: Record<string, number>;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalSpots,
  filteredCount,
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onOpenExport,
  categoryCounts,
  communityCounts
}) => {
  return (
    <header className="w-full bg-white border-b-2 border-zinc-950 z-30 shrink-0 font-sans select-none">
      {/* Top Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        {/* Brand & Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onFilterChange({ search: '', category: 'all', community: 'all' })}>
            <div className="h-9 px-2 bg-[#FAF9F5] border-2 border-zinc-950 rounded-md shadow-noun-sm flex items-center justify-center">
              <img src="/noggles.png" alt="Noggles" className="h-5 w-auto object-contain select-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-zinc-950">
                  NOUNSPOT
                </span>
                <span className="px-1.5 py-0.2 bg-noun-red text-white text-[10px] font-mono font-bold rounded">
                  ARCHIVE
                </span>
              </div>
            </div>
          </div>

          {/* Preserved Counter Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 border border-zinc-300 rounded-md text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-zinc-900">{filteredCount}</span>
            <span className="text-zinc-500">/ {totalSpots} spots</span>
          </div>
        </div>

        {/* Search Bar (Space-maximizing) */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search spot, city, community..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#FAF9F5] border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-950 focus:bg-white font-mono transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Switcher & Export */}
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="flex items-center p-0.5 bg-zinc-100 border border-zinc-300 rounded-md">
            <button
              onClick={() => onViewModeChange('split')}
              title="Split View (Map + List)"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition ${
                viewMode === 'split'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split</span>
            </button>

            <button
              onClick={() => onViewModeChange('map')}
              title="Full Map View (Maximize Space)"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition ${
                viewMode === 'map'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Map</span>
            </button>

            <button
              onClick={() => onViewModeChange('table')}
              title="Data Table View"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition ${
                viewMode === 'table'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>

            <button
              onClick={() => onViewModeChange('sitemap')}
              title="Preserved Sitemap View"
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition ${
                viewMode === 'sitemap'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sitemap</span>
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-zinc-100 text-zinc-950 border border-zinc-950 rounded-md text-xs font-mono font-bold transition shadow-noun-sm active:translate-x-0.5 active:translate-y-0.5"
            title="Export Preserved Data"
          >
            <Download className="w-3.5 h-3.5 text-noun-red" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Sub-Bar: Filter Chips (Nounish Category & Community Badges) */}
      <div className="px-4 py-1.5 bg-[#FAF9F5] border-t border-zinc-200 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        {/* Categories */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold mr-1">
            Category:
          </span>

          <button
            onClick={() => onFilterChange({ category: 'all' })}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
              filters.category === 'all'
                ? 'bg-zinc-950 text-white'
                : 'bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            All ({totalSpots})
          </button>

          <button
            onClick={() => onFilterChange({ category: 'Places' })}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 ${
              filters.category === 'Places'
                ? 'bg-noun-blue text-white shadow-sm'
                : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Places ({categoryCounts['Places'] || 0})</span>
          </button>

          <button
            onClick={() => onFilterChange({ category: 'Things' })}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 ${
              filters.category === 'Things'
                ? 'bg-noun-red text-white shadow-sm'
                : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Things ({categoryCounts['Things'] || 0})</span>
          </button>

          <button
            onClick={() => onFilterChange({ category: 'People' })}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 ${
              filters.category === 'People'
                ? 'bg-noun-yellow text-zinc-950 shadow-sm'
                : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>People ({categoryCounts['People'] || 0})</span>
          </button>

          {Boolean(categoryCounts['Event']) && (
            <button
              onClick={() => onFilterChange({ category: 'Event' })}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                filters.category === 'Event'
                  ? 'bg-noun-green text-white shadow-sm'
                  : 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Event ({categoryCounts['Event'] || 0})</span>
            </button>
          )}
        </div>

        {/* Communities & Toggles */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Community Filter */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="text-zinc-400">Community:</span>
            <select
              value={filters.community}
              onChange={(e) => onFilterChange({ community: e.target.value })}
              className="bg-white border border-zinc-300 rounded px-2 py-0.5 text-zinc-800 focus:outline-none focus:border-zinc-950 cursor-pointer font-sans text-[11px] font-medium"
            >
              <option value="all">All Nounish Spots</option>
              <option value="nouns">Nouns DAO ({communityCounts['nouns'] || 0})</option>
              {communityCounts['gnars'] ? (
                <option value="gnars">Gnars Sub-DAO ({communityCounts['gnars'] || 0})</option>
              ) : null}
            </select>
          </div>

          {/* Has Photo Toggle */}
          <button
            onClick={() => onFilterChange({ hasPhotoOnly: !filters.hasPhotoOnly })}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition ${
              filters.hasPhotoOnly
                ? 'bg-zinc-950 text-white'
                : 'bg-white border border-zinc-300 text-zinc-600 hover:text-zinc-950'
            }`}
            title="Filter spots that have archived photos"
          >
            <Image className="w-3 h-3" />
            <span>Photos Only</span>
          </button>
        </div>
      </div>
    </header>
  );
};
