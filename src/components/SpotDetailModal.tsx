import React, { useState, useEffect } from 'react';
import { Spot } from '../types';
import { 
  getCategoryStyle, 
  getSpotPhoto, 
  formatCoords, 
  getGoogleMapsUrl, 
  getAppleMapsUrl, 
  getOsmUrl 
} from '../utils/helpers';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  User, 
  Code, 
  Navigation,
  Maximize2,
  ZoomIn
} from 'lucide-react';
import { NogglesIcon } from './NogglesIcon';

interface SpotDetailModalProps {
  spot: Spot | null;
  onClose: () => void;
  onFlyToMap: (spot: Spot) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onFlyToMap
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullImageOpen) {
          e.stopPropagation();
          setIsFullImageOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isFullImageOpen]);

  if (!spot) return null;

  const photo = getSpotPhoto(spot);
  const style = getCategoryStyle(spot.category);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${spot.locationLat}, ${spot.locationLng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(spot, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Dialog (Space-Maximizing Swiss Minimalism) */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white border-2 border-zinc-950 rounded-xl shadow-noun-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 border-b-2 border-zinc-950 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/noggles.png" alt="Noggles" className="h-4 w-auto object-contain select-none" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Spot Archive Record
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-zinc-100 text-zinc-950 border border-zinc-950 rounded-md transition shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Photo or Hero Banner */}
          {photo ? (
            <div 
              onClick={() => setIsFullImageOpen(true)}
              className="group relative w-full h-64 sm:h-72 bg-zinc-100 rounded-lg overflow-hidden border-2 border-zinc-950 shadow-noun-sm cursor-zoom-in transition"
              title="Click to view full image"
            >
              <img
                src={photo}
                alt={spot.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Click to Expand Overlay Badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1.5 bg-zinc-950/85 hover:bg-zinc-950 text-white text-xs font-mono rounded-md flex items-center gap-1.5 backdrop-blur-sm transition shadow-noun-sm">
                <Maximize2 className="w-3.5 h-3.5 text-noun-yellow" />
                <span>View Full Image</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-36 bg-[#F5F5F0] border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center gap-2">
              <NogglesIcon size={32} color={style.hex} />
              <span className="text-xs font-mono text-zinc-400">No archival image recorded</span>
            </div>
          )}

          {/* Title & Metadata Tags */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded border ${style.border} ${style.bg} ${style.text}`}>
                {spot.category || 'Thing'}
              </span>
              {spot.community && spot.community.map(comm => (
                <span key={comm} className="px-2 py-1 text-xs font-mono font-bold rounded bg-zinc-950 text-white">
                  {comm}
                </span>
              ))}
              {spot.createdAt && (
                <span className="text-[11px] font-mono text-zinc-400 ml-auto">
                  Preserved: {new Date(spot.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
              {spot.name}
            </h1>

            {spot.description && (
              <p className="mt-3 text-sm text-zinc-700 leading-relaxed bg-[#FAF9F5] p-3 rounded-md border border-zinc-200">
                {spot.description}
              </p>
            )}
          </div>

          {/* Location & Address Box */}
          <div className="p-4 bg-white border-2 border-zinc-950 rounded-lg shadow-noun-sm space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-noun-red shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">Physical Address</div>
                <div className="text-sm font-medium text-zinc-900 mt-0.5 leading-snug">
                  {spot.address || 'Global / Unspecified street address'}
                </div>
              </div>
            </div>

            {/* Coordinates & Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded text-zinc-700 font-semibold border border-zinc-200">
                  {formatCoords(spot.locationLat, spot.locationLng)}
                </span>
                <button
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1 text-xs font-mono text-zinc-600 hover:text-zinc-950 px-2 py-1 rounded hover:bg-zinc-100 transition"
                  title="Copy Latitude & Longitude"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoords ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Action Buttons: Navigate Map */}
              <button
                onClick={() => {
                  onFlyToMap(spot);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-noun-red hover:bg-rose-700 text-white font-bold text-xs rounded transition shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Fly to on Map</span>
              </button>
            </div>
          </div>

          {/* Event Details if available */}
          {(spot.eventDate || spot.eventUrl) && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">Event Information</div>
                  <div className="text-xs text-emerald-700">
                    {spot.eventDate || 'Date not specified'} {spot.eventTime ? `at ${spot.eventTime}` : ''}
                  </div>
                </div>
              </div>

              {spot.eventUrl && (
                <a
                  href={spot.eventUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition"
                >
                  <span>Event Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* External Map & Service Links */}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
              External Navigation & Verified Services
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={getGoogleMapsUrl(spot.locationLat, spot.locationLng)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#FAF9F5] hover:bg-zinc-100 border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 transition"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>

              <a
                href={getAppleMapsUrl(spot.locationLat, spot.locationLng, spot.name)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#FAF9F5] hover:bg-zinc-100 border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 transition"
              >
                <span>Apple Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>

              <a
                href={getOsmUrl(spot.locationLat, spot.locationLng)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-[#FAF9F5] hover:bg-zinc-100 border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 transition"
              >
                <span>OpenStreetMap</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Creator / Contributor Attribution */}
          {(spot.ownerUsername || spot.ownerWalletAddress || spot.contactLink) && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md text-xs space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">Contributor / Owner</div>
              <div className="flex items-center gap-2 flex-wrap font-mono text-zinc-700">
                {spot.ownerUsername && (
                  <span className="font-bold text-zinc-950">@{spot.ownerUsername}</span>
                )}
                {spot.ownerWalletAddress && (
                  <span className="text-[11px] text-zinc-500 truncate max-w-[200px]" title={spot.ownerWalletAddress}>
                    {spot.ownerWalletAddress.slice(0, 6)}...{spot.ownerWalletAddress.slice(-4)}
                  </span>
                )}
                {spot.contactLink && (
                  <a
                    href={spot.contactLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-noun-blue hover:underline ml-auto"
                  >
                    Contact Link →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Raw JSON Archive View */}
          <div className="pt-2 border-t border-zinc-200">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex items-center justify-between w-full text-xs font-mono text-zinc-500 hover:text-zinc-950 py-1"
            >
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>{showRawJson ? 'Hide Raw JSON Record' : 'View Raw Preserved JSON Record'}</span>
              </span>
              <span>{showRawJson ? '▲' : '▼'}</span>
            </button>

            {showRawJson && (
              <div className="mt-2 relative">
                <pre className="p-3 bg-zinc-900 text-zinc-200 text-[11px] font-mono rounded-md overflow-x-auto max-h-48">
                  {JSON.stringify(spot, null, 2)}
                </pre>
                <button
                  onClick={handleCopyJson}
                  className="absolute top-2 right-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono rounded border border-zinc-700 transition"
                >
                  {copiedJson ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {isFullImageOpen && photo && (
        <div
          className="fixed inset-0 z-[1200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setIsFullImageOpen(false)}
        >
          {/* Header Controls */}
          <div 
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide">{spot.name}</span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">• Full Resolution</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={photo}
                target="_blank"
                rel="noreferrer"
                download
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition border border-white/20 text-xs font-mono flex items-center gap-1.5"
                title="Open original file"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Original</span>
              </a>

              <button
                onClick={() => setIsFullImageOpen(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition border border-white/20"
                title="Close Full Image (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Image */}
          <div 
            className="relative max-w-[94vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo}
              alt={spot.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg border border-white/20 shadow-2xl"
            />
          </div>

          {/* Hint */}
          <div className="absolute bottom-4 text-xs font-mono text-zinc-400">
            Click anywhere or press Esc to close
          </div>
        </div>
      )}
    </div>
  );
};
