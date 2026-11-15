export interface Spot {
  id: string;
  name: string;
  description: string;
  category: 'Places' | 'Things' | 'People' | 'Event' | 'Stickers' | string;
  address: string;
  locationLat: number;
  locationLng: number;
  eventDate?: string | null;
  eventTime?: string | null;
  eventUrl?: string | null;
  community?: string[] | null;
  photoUrl?: string | null;
  localPhotoPath?: string | null;
  contactLink?: string | null;
  ownerEmail?: string | null;
  ownerUserFid?: string | number | null;
  ownerWalletId?: string | number | null;
  createdAt: string;
  updatedAt: string;
  ownerUsername?: string | null;
  ownerWalletAddress?: string | null;
}

export type ViewMode = 'split' | 'map' | 'table' | 'sitemap';

export interface FilterState {
  search: string;
  category: string;
  community: string;
  hasPhotoOnly: boolean;
  hasEventOnly: boolean;
  sortBy: 'name' | 'newest' | 'oldest' | 'category';
}
