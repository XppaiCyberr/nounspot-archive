import { Spot } from '../types';

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string; hex: string }> = {
  Places: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-400',
    dot: 'bg-blue-600',
    hex: '#1D4ED8'
  },
  Things: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-400',
    dot: 'bg-rose-600',
    hex: '#E63946'
  },
  People: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-400',
    dot: 'bg-amber-500',
    hex: '#FFC700'
  },
  Event: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-400',
    dot: 'bg-emerald-600',
    hex: '#10B981'
  }
};

export function getCategoryStyle(category?: string) {
  if (!category) return CATEGORY_COLORS.Things;
  return CATEGORY_COLORS[category] || {
    bg: 'bg-zinc-100',
    text: 'text-zinc-800',
    border: 'border-zinc-300',
    dot: 'bg-zinc-500',
    hex: '#71717A'
  };
}

export const COMMUNITY_INFO: Record<string, { label: string; badge: string; color: string }> = {
  nouns: {
    label: 'Nouns',
    badge: 'bg-[#E63946] text-white',
    color: '#E63946'
  },
  cursor: {
    label: 'Cursor',
    badge: 'bg-[#18181B] text-white',
    color: '#18181B'
  },
  gnars: {
    label: 'Gnars',
    badge: 'bg-amber-500 text-black font-bold',
    color: '#F59E0B'
  },
  Gnars: {
    label: 'Gnars',
    badge: 'bg-amber-500 text-black font-bold',
    color: '#F59E0B'
  },
  farcaster: {
    label: 'Farcaster',
    badge: 'bg-purple-600 text-white',
    color: '#8B5CF6'
  },
  'claude-code': {
    label: 'Claude Code',
    badge: 'bg-orange-600 text-white',
    color: '#EA580C'
  }
};

export function getSpotPhoto(spot: Spot): string | null {
  if (spot.localPhotoPath) {
    return '/' + spot.localPhotoPath;
  }
  if (spot.photoUrl) {
    return spot.photoUrl;
  }
  return null;
}

export function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function getAppleMapsUrl(lat: number, lng: number, name: string): string {
  return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}`;
}

export function getOsmUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

export function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
