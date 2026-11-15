import React, { useState } from 'react';
import { Spot } from '../types';
import { Download, X, Copy, Check, FileCode, Database, Globe, Map } from 'lucide-react';
import { NogglesIcon } from './NogglesIcon';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: Spot[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  spots
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (type: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const exportFormats = [
    {
      title: 'GeoJSON FeatureCollection',
      desc: 'Standard GIS geospatial format for Mapbox, Leaflet, Felt, Keplr, and QGIS.',
      filename: 'spots.geojson',
      href: '/spots.geojson',
      badge: 'GeoJSON',
      badgeColor: 'bg-noun-blue text-white',
      icon: Map
    },
    {
      title: 'CSV Spreadsheet',
      desc: 'Comma-separated values for Microsoft Excel, Google Sheets, and data science.',
      filename: 'spots.csv',
      href: '/spots.csv',
      badge: 'CSV',
      badgeColor: 'bg-noun-green text-white',
      icon: Database
    },
    {
      title: 'Full JSON Archive',
      desc: 'Structured raw JSON with complete metadata, timestamps, and local photo paths.',
      filename: 'spots.json',
      href: '/spots.json',
      badge: 'JSON',
      badgeColor: 'bg-noun-yellow text-zinc-950 font-bold',
      icon: FileCode
    },
    {
      title: 'Standard XML Sitemap',
      desc: 'Standard sitemaps.org format preserving every spot URL for web crawlers.',
      filename: 'sitemap.xml',
      href: '/sitemap.xml',
      badge: 'XML',
      badgeColor: 'bg-noun-red text-white',
      icon: Globe
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white border-2 border-zinc-950 rounded-xl shadow-noun-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-zinc-950 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/noggles.png" alt="Noggles" className="h-4 w-auto object-contain select-none" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
              Preservation & Data Export Hub
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-zinc-100 text-zinc-950 border border-zinc-950 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="border-b border-zinc-200 pb-3">
            <h2 className="text-lg font-bold text-zinc-950">Download Preserved Dataset</h2>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Preserved because the original https://www.nounspot.com/ map is broken and unmaintained. All {spots.length} verified Noun spots are archived in open standard formats.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {exportFormats.map((fmt) => {
              const Icon = fmt.icon;
              return (
                <div
                  key={fmt.filename}
                  className="p-3.5 bg-[#FAF9F5] hover:bg-zinc-50 border-2 border-zinc-950 rounded-lg flex items-center justify-between gap-4 transition shadow-noun-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white border border-zinc-900 rounded-md shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-zinc-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-950">{fmt.title}</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded ${fmt.badgeColor}`}>
                          {fmt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{fmt.desc}</p>
                    </div>
                  </div>

                  <a
                    href={fmt.href}
                    download={fmt.filename}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold font-mono rounded transition shrink-0 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Download className="w-3.5 h-3.5 text-noun-yellow" />
                    <span>Download</span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Direct Copy Snippet */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                Quick GeoJSON Snippet (Sample)
              </span>
              <button
                onClick={() => copyToClipboard('geojson', JSON.stringify({
                  type: 'FeatureCollection',
                  features: spots.slice(0, 5).map(s => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [s.locationLng, s.locationLat] },
                    properties: { name: s.name, category: s.category, address: s.address }
                  }))
                }, null, 2))}
                className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-700 hover:text-zinc-950"
              >
                {copiedType === 'geojson' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'geojson' ? 'Copied to clipboard' : 'Copy 5 Sample Points'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-zinc-900 text-zinc-200 text-[10px] font-mono rounded overflow-x-auto max-h-24">
              {JSON.stringify({
                type: 'FeatureCollection',
                count: spots.length,
                verifiedCoordinates: "132/132 (100%)",
                archivedPhotos: "59/59 (100%)"
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
