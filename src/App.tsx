import React, { useState, useMemo, useEffect } from 'react';
import { SPOTS_DATA } from './data/spotsData';
import { Spot, ViewMode, FilterState } from './types';
import { Navbar } from './components/Navbar';
import { MapComponent } from './components/MapComponent';
import { SpotCard } from './components/SpotCard';
import { SpotDetailModal } from './components/SpotDetailModal';
import { SiteMapDirectory } from './components/SiteMapDirectory';
import { TableView } from './components/TableView';
import { ExportModal } from './components/ExportModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  MapPin, 
  Compass, 
  Sparkles,
  Info
} from 'lucide-react';

export function App() {
  const [spots] = useState<Spot[]>(SPOTS_DATA);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [detailSpot, setDetailSpot] = useState<Spot | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    community: 'all',
    hasPhotoOnly: false,
    hasEventOnly: false,
    sortBy: 'name'
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate Category and Community Counts
  const { categoryCounts, communityCounts } = useMemo(() => {
    const cats: Record<string, number> = {};
    const comms: Record<string, number> = {};

    spots.forEach(s => {
      const cat = s.category || 'Things';
      cats[cat] = (cats[cat] || 0) + 1;

      if (s.community && Array.isArray(s.community)) {
        s.community.forEach(c => {
          const lower = c.toLowerCase();
          comms[lower] = (comms[lower] || 0) + 1;
        });
      }
    });

    return { categoryCounts: cats, communityCounts: comms };
  }, [spots]);

  // Filtered Spots
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      // Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(q);
        const matchesAddress = (spot.address || '').toLowerCase().includes(q);
        const matchesDesc = (spot.description || '').toLowerCase().includes(q);
        const matchesUser = (spot.ownerUsername || '').toLowerCase().includes(q);
        if (!matchesName && !matchesAddress && !matchesDesc && !matchesUser) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'all') {
        if (spot.category !== filters.category) return false;
      }

      // Community
      if (filters.community !== 'all') {
        if (!spot.community || !spot.community.some(c => c.toLowerCase() === filters.community.toLowerCase())) {
          return false;
        }
      }

      // Photos Only
      if (filters.hasPhotoOnly) {
        if (!spot.photoUrl && !spot.localPhotoPath) return false;
      }

      // Events Only
      if (filters.hasEventOnly) {
        if (!spot.eventDate && !spot.eventUrl) return false;
      }

      return true;
    });
  }, [spots, filters]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDetailSpot(null);
        setIsExportOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFlyToMap = (spot: Spot) => {
    setSelectedSpot(spot);
    if (viewMode === 'table' || viewMode === 'sitemap') {
      setViewMode('split');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F5F0] text-zinc-900 select-none">
      {/* Top Navbar */}
      <Navbar
        totalSpots={spots.length}
        filteredCount={filteredSpots.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenExport={() => setIsExportOpen(true)}
        categoryCounts={categoryCounts}
        communityCounts={communityCounts}
      />

      {/* Main View Area */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* VIEW 1: SPLIT VIEW (Map + Collapsible Cards Sidebar) */}
        {viewMode === 'split' && (
          <div className="flex w-full h-full relative overflow-hidden">
            {/* Left Cards Sidebar */}
            <div
              className={`transition-all duration-300 ease-in-out bg-white border-r-2 border-zinc-950 flex flex-col z-20 shrink-0 ${
                isSidebarOpen ? 'w-full sm:w-[380px] lg:w-[420px]' : 'w-0 border-r-0'
              }`}
            >
              {isSidebarOpen && (
                <>
                  {/* Sidebar Header */}
                  <div className="p-3 bg-[#FAF9F5] border-b border-zinc-200 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-zinc-800">
                      {filteredSpots.length} {filteredSpots.length === 1 ? 'Location' : 'Locations'} found
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      Click card to focus on map
                    </span>
                  </div>

                  {/* Cards Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {filteredSpots.length > 0 ? (
                      filteredSpots.map(spot => (
                        <SpotCard
                          key={spot.id}
                          spot={spot}
                          isSelected={selectedSpot?.id === spot.id}
                          onSelect={setSelectedSpot}
                          onOpenDetails={setDetailSpot}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                        <p className="font-bold text-sm mb-1">No spots match criteria</p>
                        <p>Try resetting filters or searching a different term.</p>
                        <button
                          onClick={() => handleFilterChange({ search: '', category: 'all', community: 'all', hasPhotoOnly: false })}
                          className="mt-3 px-3 py-1.5 bg-zinc-950 text-white rounded text-xs font-bold"
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar Collapse Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Collapse Drawer to Maximize Map" : "Expand Spot Drawer"}
              className={`absolute top-4 z-[400] bg-white hover:bg-zinc-50 text-zinc-950 border-2 border-zinc-950 p-1.5 rounded-r-md shadow-noun-sm transition active:translate-x-0.5 ${
                isSidebarOpen ? 'left-[380px] sm:left-[380px] lg:left-[420px]' : 'left-0 rounded-l-none'
              }`}
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {/* Right Map (Fills 100% of remaining space) */}
            <div className="flex-1 h-full relative">
              <MapComponent
                spots={filteredSpots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
                onOpenDetails={setDetailSpot}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: FULL MAP VIEW (100% Fullscreen Map) */}
        {viewMode === 'map' && (
          <div className="w-full h-full relative">
            <MapComponent
              spots={filteredSpots}
              selectedSpot={selectedSpot}
              onSelectSpot={setSelectedSpot}
              onOpenDetails={setDetailSpot}
            />
          </div>
        )}

        {/* VIEW 3: DATA TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="w-full h-full">
            <TableView
              spots={filteredSpots}
              selectedSpot={selectedSpot}
              onSelectSpot={handleFlyToMap}
              onOpenDetails={setDetailSpot}
            />
          </div>
        )}

        {/* VIEW 4: SITEMAP DIRECTORY VIEW */}
        {viewMode === 'sitemap' && (
          <div className="w-full h-full">
            <SiteMapDirectory
              spots={spots}
              onSelectSpot={handleFlyToMap}
              onOpenDetails={setDetailSpot}
            />
          </div>
        )}
      </main>

      {/* Spot Detail Modal */}
      <SpotDetailModal
        spot={detailSpot}
        onClose={() => setDetailSpot(null)}
        onFlyToMap={handleFlyToMap}
      />

      {/* Export Preserved Data Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        spots={spots}
      />
    </div>
  );
}

export default App;
