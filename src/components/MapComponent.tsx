import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Spot } from '../types';
import { getCategoryStyle, getSpotPhoto, formatCoords } from '../utils/helpers';
import { Maximize2, Crosshair, Layers, Check } from 'lucide-react';

interface MapComponentProps {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot | null) => void;
  onOpenDetails: (spot: Spot) => void;
}

// 100% Open Source Tile Providers
const OPEN_SOURCE_LAYERS = {
  osm: {
    name: 'OpenStreetMap Standard',
    tag: 'OSM Standard',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: 'abc',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
  },
  hot: {
    name: 'OSM Humanitarian (HOT)',
    tag: 'Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    maxZoom: 19,
    subdomains: 'abc',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> & Humanitarian OSM'
  },
  topo: {
    name: 'OpenTopoMap',
    tag: 'Topographic',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    maxZoom: 17,
    subdomains: 'abc',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>, SRTM | <a href="https://opentopomap.org" target="_blank" rel="noreferrer">OpenTopoMap</a>'
  }
};

type LayerKey = keyof typeof OPEN_SOURCE_LAYERS;

export const MapComponent: React.FC<MapComponentProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  onOpenDetails
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  
  const [selectedLayer, setSelectedLayer] = useState<LayerKey>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map centered on global view
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true
    });

    // Clean Minimalist Attribution in bottom-right
    map.attributionControl.setPosition('bottomright');
    map.attributionControl.setPrefix(false);

    // Initial OpenStreetMap Standard Layer
    const initialConfig = OPEN_SOURCE_LAYERS.osm;
    const tileLayer = L.tileLayer(initialConfig.url, {
      maxZoom: initialConfig.maxZoom,
      subdomains: initialConfig.subdomains,
      attribution: initialConfig.attribution
    }).addTo(map);

    currentTileLayerRef.current = tileLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Switching Open Source Map Layers
  const handleLayerSwitch = (key: LayerKey) => {
    const map = mapRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const config = OPEN_SOURCE_LAYERS[key];
    const newLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains,
      attribution: config.attribution
    }).addTo(map);

    currentTileLayerRef.current = newLayer;
    setSelectedLayer(key);
    setShowLayerMenu(false);
  };

  // Update Markers when spots change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    spots.forEach(spot => {
      if (spot.locationLat == null || spot.locationLng == null) return;

      const style = getCategoryStyle(spot.category);
      const isSelected = selectedSpot?.id === spot.id;

      // Custom Nounish SVG Marker
      const customIcon = L.divIcon({
        className: 'custom-noun-marker',
        iconSize: [28, 34],
        iconAnchor: [14, 34],
        popupAnchor: [0, -32],
        html: `
          <div class="noun-marker-wrapper ${isSelected ? 'noun-marker-selected' : ''}" style="width: 28px; height: 34px;">
            ${isSelected ? `<div class="noun-radar-pulse" style="background-color: ${style.hex};"></div>` : ''}
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 34 14 34C14 34 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="${style.hex}" stroke="#121214" stroke-width="2"/>
              <!-- Noggles white lenses -->
              <rect x="5" y="8" width="8" height="8" rx="1" fill="#FFFFFF"/>
              <rect x="15" y="8" width="8" height="8" rx="1" fill="#FFFFFF"/>
              <rect x="12" y="11" width="4" height="2" fill="#121214"/>
              <!-- Noggles black pupils -->
              <rect x="8" y="10" width="3" height="4" fill="#121214"/>
              <rect x="18" y="10" width="3" height="4" fill="#121214"/>
            </svg>
          </div>
        `
      });

      const marker = L.marker([spot.locationLat, spot.locationLng], {
        icon: customIcon,
        title: spot.name
      }).addTo(map);

      // Popup content
      const photo = getSpotPhoto(spot);
      const popupDiv = document.createElement('div');
      popupDiv.className = 'w-64 text-zinc-900 font-sans cursor-pointer group';
      popupDiv.innerHTML = `
        ${photo ? `
          <div class="w-full h-28 overflow-hidden bg-zinc-100 border-b border-zinc-900">
            <img src="${photo}" alt="${spot.name}" class="w-full h-full object-cover transition-transform group-hover:scale-105" onerror="this.parentElement.style.display='none'"/>
          </div>
        ` : ''}
        <div class="p-3">
          <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-sm border ${style.border} ${style.bg} ${style.text}">
              ${spot.category || 'Thing'}
            </span>
            ${spot.community && spot.community.length > 0 ? `
              <span class="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-sm bg-zinc-900 text-white">
                ${spot.community[0]}
              </span>
            ` : ''}
          </div>
          <h3 class="font-bold text-sm text-zinc-900 leading-tight mb-1 group-hover:text-noun-red transition-colors">${spot.name}</h3>
          <p class="text-[11px] text-zinc-600 line-clamp-2 mb-2 leading-relaxed">${spot.address || 'Global location'}</p>
          <div class="flex items-center justify-between pt-1 border-t border-zinc-100">
            <span class="text-[10px] font-mono text-zinc-500">${formatCoords(spot.locationLat, spot.locationLng)}</span>
            <button type="button" class="explore-btn text-[11px] font-bold px-2.5 py-1 bg-zinc-900 hover:bg-black active:scale-95 text-white rounded cursor-pointer transition shadow-sm">
              Explore →
            </button>
          </div>
        </div>
      `;

      // Direct Leaflet DomEvent bindings on the popup DOM
      const exploreBtn = popupDiv.querySelector('.explore-btn');
      if (exploreBtn) {
        L.DomEvent.on(exploreBtn as HTMLElement, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          onOpenDetails(spot);
        });
      }

      // Also allow clicking the popup body to open details
      L.DomEvent.on(popupDiv, 'click', (e) => {
        L.DomEvent.stopPropagation(e);
        onOpenDetails(spot);
      });

      marker.bindPopup(popupDiv);

      marker.on('click', () => {
        onSelectSpot(spot);
      });

      marker.on('popupopen', (e) => {
        const popupNode = e.popup?.getElement();
        if (popupNode) {
          const btn = popupNode.querySelector('.explore-btn') as HTMLElement | null;
          if (btn) {
            btn.onclick = (ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              onOpenDetails(spot);
            };
          }
        }
      });

      markersRef.current.set(spot.id, marker);
    });
  }, [spots, selectedSpot]);

  // Center on selected spot
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSpot) return;

    if (selectedSpot.locationLat != null && selectedSpot.locationLng != null) {
      map.flyTo([selectedSpot.locationLat, selectedSpot.locationLng], 14, {
        duration: 1.2
      });

      const marker = markersRef.current.get(selectedSpot.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedSpot]);

  const fitAllSpots = () => {
    const map = mapRef.current;
    if (!map || spots.length === 0) return;

    const bounds = L.latLngBounds(
      spots
        .filter(s => s.locationLat != null && s.locationLng != null)
        .map(s => [s.locationLat, s.locationLng])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  };

  const locateUser = () => {
    const map = mapRef.current;
    if (!map) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.flyTo([pos.coords.latitude, pos.coords.longitude], 12);
        },
        () => {
          alert('Could not obtain your location. Please check browser permissions.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full bg-[#E5E5DE] overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Buttons (Minimalist Nounish style) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={fitAllSpots}
          title="Fit All Spots"
          className="p-2.5 bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-900 rounded-md shadow-noun-sm transition active:translate-x-0.5 active:translate-y-0.5"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={locateUser}
          title="My Location"
          className="p-2.5 bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-900 rounded-md shadow-noun-sm transition active:translate-x-0.5 active:translate-y-0.5"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Open Source Map Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Open Source Map Layers"
            className={`p-2.5 bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-900 rounded-md shadow-noun-sm transition active:translate-x-0.5 active:translate-y-0.5 ${
              showLayerMenu ? 'bg-zinc-100 ring-2 ring-zinc-900' : ''
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Layer Selector Dropdown */}
          {showLayerMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white border-2 border-zinc-950 rounded-lg shadow-noun-md p-2 z-[500] font-sans">
              <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 mb-1">
                Open Source Map Layers
              </div>
              {(Object.keys(OPEN_SOURCE_LAYERS) as LayerKey[]).map((key) => {
                const layer = OPEN_SOURCE_LAYERS[key];
                const isActive = selectedLayer === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleLayerSwitch(key)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left text-xs transition mb-1 ${
                      isActive 
                        ? 'bg-zinc-950 text-white font-bold' 
                        : 'text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <div>
                      <div className="leading-tight">{layer.name}</div>
                      <div className={`text-[10px] font-mono ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {layer.tag}
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-noun-yellow shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
