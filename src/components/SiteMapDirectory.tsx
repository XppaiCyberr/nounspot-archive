import React, { useState, useMemo } from 'react';
import { Spot } from '../types';
import { getCategoryStyle, formatCoords, getSpotPhoto } from '../utils/helpers';
import { 
  FileText, 
  Download, 
  MapPin, 
  ExternalLink, 
  Search, 
  Globe2, 
  Calendar, 
  FolderTree, 
  Layers 
} from 'lucide-react';
import { NogglesIcon } from './NogglesIcon';

interface SiteMapDirectoryProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  onOpenDetails: (spot: Spot) => void;
}

export const SiteMapDirectory: React.FC<SiteMapDirectoryProps> = ({
  spots,
  onSelectSpot,
  onOpenDetails
}) => {
  const [groupBy, setGroupBy] = useState<'country' | 'community' | 'category'>('country');
  const [search, setSearch] = useState('');

  // Extract country from address helper
  const getCountry = (address: string): string => {
    if (!address) return 'Unknown / Global';
    const parts = address.split(',').map(p => p.trim());
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      // strip postal codes or clean up
      return last.replace(/\d+/g, '').trim() || 'Global';
    }
    return 'Global';
  };

  // Filtered spots
  const filteredSpots = useMemo(() => {
    if (!search.trim()) return spots;
    const q = search.toLowerCase();
    return spots.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.community && s.community.some(c => c.toLowerCase().includes(q)))
    );
  }, [spots, search]);

  // Grouped structure
  const groupedData = useMemo(() => {
    const groups: Record<string, Spot[]> = {};

    filteredSpots.forEach(s => {
      let key = 'Other';
      if (groupBy === 'country') {
        key = getCountry(s.address);
      } else if (groupBy === 'community') {
        key = s.community && s.community.length > 0 ? s.community[0] : 'General Nouns';
      } else if (groupBy === 'category') {
        key = s.category || 'Thing';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });

    // Sort group keys alphabetically
    return Object.keys(groups).sort().reduce((acc, k) => {
      acc[k] = groups[k];
      return acc;
    }, {} as Record<string, Spot[]>);
  }, [filteredSpots, groupBy]);

  return (
    <div className="w-full h-full bg-[#FAF9F5] overflow-y-auto p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Hero Banner */}
        <div className="bg-white border-2 border-zinc-950 rounded-xl p-6 shadow-noun-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/noggles.png" alt="Noggles" className="h-6 w-auto object-contain select-none" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-noun-red">
                Preserved Site Map & Archive Index
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
              Nounspot Location Sitemap
            </h1>
            <p className="text-sm text-zinc-600 mt-1 max-w-xl leading-relaxed">
              Complete archival preservation of all {spots.length} authentic nounish places, things, and community installations worldwide. Preserved because the original nounspot.com map is broken and no longer maintained.
            </p>
          </div>

          {/* Download Archives */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/sitemap.xml"
              download="sitemap.xml"
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 hover:bg-black text-white text-xs font-bold font-mono rounded shadow-noun-sm transition active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5 text-noun-yellow" />
              <span>sitemap.xml</span>
            </a>

            <a
              href="/spots.geojson"
              download="spots.geojson"
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-950 text-xs font-bold font-mono rounded shadow-noun-sm transition active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5 text-noun-blue" />
              <span>GeoJSON</span>
            </a>

            <a
              href="/spots.csv"
              download="spots.csv"
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-950 text-xs font-bold font-mono rounded shadow-noun-sm transition active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5 text-noun-green" />
              <span>CSV</span>
            </a>
          </div>
        </div>

        {/* Directory Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 border-2 border-zinc-950 rounded-lg shadow-noun-sm">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sitemap locations..."
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded text-xs focus:outline-none focus:border-zinc-950 font-mono"
            />
          </div>

          {/* Group By Selector */}
          <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
            <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Group by:</span>
            </span>

            <button
              onClick={() => setGroupBy('country')}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                groupBy === 'country'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Region / Country
            </button>

            <button
              onClick={() => setGroupBy('community')}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                groupBy === 'community'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Community
            </button>

            <button
              onClick={() => setGroupBy('category')}
              className={`px-3 py-1 text-xs font-bold rounded transition ${
                groupBy === 'category'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Category
            </button>
          </div>
        </div>

        {/* Sitemap Hierarchy Tree */}
        <div className="space-y-6">
          {Object.entries(groupedData).map(([groupTitle, groupSpots]) => (
            <div 
              key={groupTitle}
              className="bg-white border-2 border-zinc-950 rounded-xl overflow-hidden shadow-noun-sm"
            >
              {/* Group Header */}
              <div className="px-5 py-3 bg-[#F4F3EF] border-b-2 border-zinc-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-zinc-700" />
                  <h2 className="font-bold text-sm text-zinc-950 uppercase tracking-wide">
                    {groupTitle}
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white border border-zinc-300 rounded text-zinc-700">
                  {groupSpots.length} {groupSpots.length === 1 ? 'spot' : 'spots'}
                </span>
              </div>

              {/* Spots List */}
              <div className="divide-y divide-zinc-100">
                {groupSpots.map((spot) => {
                  const style = getCategoryStyle(spot.category);
                  const photo = getSpotPhoto(spot);

                  return (
                    <div
                      key={spot.id}
                      className="p-3.5 hover:bg-zinc-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail or Badge */}
                        <div className="w-10 h-10 rounded border border-zinc-300 bg-zinc-100 shrink-0 overflow-hidden flex items-center justify-center">
                          {photo ? (
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <NogglesIcon size={14} color={style.hex} />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-zinc-950 hover:text-noun-red cursor-pointer" onClick={() => onOpenDetails(spot)}>
                              {spot.name}
                            </span>
                            <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded border ${style.border} ${style.bg} ${style.text}`}>
                              {spot.category}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-xl">
                            {spot.address || 'Unspecified address'}
                          </div>
                        </div>
                      </div>

                      {/* Right Meta & Actions */}
                      <div className="flex items-center gap-2 sm:self-center self-end">
                        <span className="text-[11px] font-mono text-zinc-400">
                          {formatCoords(spot.locationLat, spot.locationLng)}
                        </span>

                        <button
                          onClick={() => onSelectSpot(spot)}
                          className="px-2.5 py-1 text-xs font-bold bg-zinc-100 hover:bg-zinc-950 hover:text-white rounded transition"
                        >
                          View Map
                        </button>

                        <button
                          onClick={() => onOpenDetails(spot)}
                          className="px-2.5 py-1 text-xs font-bold bg-noun-red hover:bg-rose-700 text-white rounded transition shadow-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
