import React, { useState } from 'react';
import { Spot } from '../types';
import { getCategoryStyle, formatCoords, getSpotPhoto } from '../utils/helpers';
import { ExternalLink, Copy, Check, ArrowUpDown, MapPin, Eye } from 'lucide-react';

interface TableViewProps {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
  onOpenDetails: (spot: Spot) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  onOpenDetails
}) => {
  const [sortField, setSortField] = useState<'name' | 'category' | 'createdAt'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSort = (field: 'name' | 'category' | 'createdAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedSpots = [...spots].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (sortField === 'category') {
      cmp = (a.category || '').localeCompare(b.category || '');
    } else if (sortField === 'createdAt') {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortAsc ? cmp : -cmp;
  });

  const copyCoords = (spot: Spot) => {
    navigator.clipboard.writeText(`${spot.locationLat}, ${spot.locationLng}`);
    setCopiedId(spot.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-col font-sans select-text">
      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#FAF9F5] sticky top-0 z-10 border-b-2 border-zinc-950 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-zinc-950"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Spot Name</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-zinc-950 w-28"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Category</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </th>
              <th className="py-3 px-4 w-32">Community</th>
              <th className="py-3 px-4">Address / Location</th>
              <th className="py-3 px-4 w-40 font-mono">Coordinates</th>
              <th className="py-3 px-4 w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-xs">
            {sortedSpots.map((spot, idx) => {
              const isSelected = selectedSpot?.id === spot.id;
              const style = getCategoryStyle(spot.category);
              const photo = getSpotPhoto(spot);

              return (
                <tr
                  key={spot.id}
                  onClick={() => onSelectSpot(spot)}
                  className={`hover:bg-[#FAF9F5] transition cursor-pointer ${
                    isSelected ? 'bg-amber-50/70 font-medium' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-mono text-zinc-400 text-[11px]">
                    {idx + 1}
                  </td>

                  <td className="py-2.5 px-4 font-medium text-zinc-900">
                    <div className="flex items-center gap-2">
                      {photo && (
                        <img 
                          src={photo} 
                          alt="" 
                          className="w-6 h-6 rounded object-cover border border-zinc-200 shrink-0" 
                        />
                      )}
                      <span className="hover:text-noun-red">{spot.name}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${style.border} ${style.bg} ${style.text}`}>
                      {spot.category || 'Thing'}
                    </span>
                  </td>

                  <td className="py-2.5 px-4">
                    {spot.community && spot.community.length > 0 ? (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-100 rounded text-zinc-800 border border-zinc-300">
                        {spot.community[0]}
                      </span>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-zinc-600 truncate max-w-xs" title={spot.address}>
                    {spot.address || 'Global / Unspecified'}
                  </td>

                  <td className="py-2.5 px-4 font-mono text-zinc-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCoords(spot);
                      }}
                      className="flex items-center gap-1.5 hover:text-zinc-950 hover:bg-zinc-100 px-1.5 py-0.5 rounded transition"
                      title="Click to copy coordinates"
                    >
                      <span>{formatCoords(spot.locationLat, spot.locationLng)}</span>
                      {copiedId === spot.id ? (
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400 shrink-0 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetails(spot);
                        }}
                        className="p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded transition"
                        title="View Full Spot Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSpot(spot);
                        }}
                        className="px-2 py-0.5 font-bold text-[10px] bg-zinc-900 text-white rounded hover:bg-black transition"
                        title="Locate on Map"
                      >
                        Map
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info Counter */}
      <div className="p-3 bg-[#F4F3EF] border-t border-zinc-200 text-xs font-mono text-zinc-500 flex items-center justify-between">
        <span>Showing {sortedSpots.length} preserved locations</span>
        <span>Coordinates verified • 100% complete archive</span>
      </div>
    </div>
  );
};
