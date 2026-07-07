import { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { Search, X } from 'lucide-react';
import { MapCanvas } from './components/MapCanvas';
import { SideNav } from './components/SideNav';
import { PlaceStack } from './components/PlaceStack';
import { TopBar } from './components/TopBar';
import { ExploreButton } from './components/ExploreButton';
import { FestivalBanner } from './components/FestivalBanner';
import { SectionScreen } from './screens/SectionScreen';
import { places } from './components/data/places';

// URL slug ↔ section key mapping
const SLUG_TO_SECTION: Record<string, string> = {
  eventos: 'Events',
  toros: 'Bullfighting',
  peñas: 'Nightlife',
};
const SECTION_TO_SLUG: Record<string, string> = {
  Events: 'eventos',
  Bullfighting: 'toros',
  Nightlife: 'peñas',
};

function parsePath(pathname: string): { section: string | null; cardId: string | null } {
  const parts = pathname.replace(/^\//, '').split('/');
  const section = SLUG_TO_SECTION[parts[0]] ?? null;
  const cardId = parts[1] ?? null;
  return { section, cardId };
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const { section: initialSection, cardId: initialCardId } = parsePath(location.pathname);

  const [currentSection, setCurrentSection] = useState<string | null>(initialSection);
  const [currentCardId, setCurrentCardId] = useState<string | null>(initialCardId);
  const [showSideNav, setShowSideNav] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showPlaceStack, setShowPlaceStack] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep URL in sync when section/card changes
  useEffect(() => {
    if (!currentSection) {
      if (location.pathname !== '/') navigate('/', { replace: true });
      return;
    }
    const slug = SECTION_TO_SLUG[currentSection] ?? currentSection.toLowerCase();
    const target = currentCardId ? `/${slug}/${currentCardId}` : `/${slug}`;
    if (location.pathname !== target) navigate(target, { replace: true });
  }, [currentSection, currentCardId]);

  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places;
    const q = searchQuery.toLowerCase();
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const handleOpenSearch = useCallback(() => {
    setShowSearch(true);
    setShowPlaceStack(false);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setShowSearch(false);
    setSearchQuery('');
  }, []);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedPlaceId(id);
    setShowPlaceStack(true);
  }, []);

  const handleSectionOpen = useCallback((section: string | null) => {
    setCurrentSection(section);
    setCurrentCardId(null);
    setShowSideNav(false);
    setShowPlaceStack(false);
    setSelectedPlaceId(null);
  }, []);

  const handleBackToMap = useCallback(() => {
    setCurrentSection(null);
    setCurrentCardId(null);
    setShowPlaceStack(false);
    setSelectedPlaceId(null);
  }, []);

  const handleCardChange = useCallback((cardId: string) => {
    setCurrentCardId(cardId);
  }, []);

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{ backgroundColor: '#101a14' }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: '100%', maxWidth: 430, height: '100%', backgroundColor: '#f0ede5' }}
      >
        {/* ── MAP (always rendered behind everything) ── */}
        <MapCanvas
          places={filteredPlaces}
          selectedPlaceId={selectedPlaceId}
          onMarkerClick={handleMarkerClick}
          showLocationButton={!currentSection && !showSideNav}
        />

        {/* ── MAP OVERLAYS (only shown when on map) ── */}
        {!currentSection && <TopBar onMenuOpen={() => setShowSideNav(true)} onSearchOpen={handleOpenSearch} />}
        {!currentSection && <FestivalBanner />}

        {/* ── SEARCH OVERLAY ── */}
        <AnimatePresence>
          {showSearch && !currentSection && (
            <motion.div
              key="search-overlay"
              className="absolute left-0 right-0 z-40 px-4"
              style={{ top: 108 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="flex items-center gap-3 rounded-2xl px-4"
                style={{ height: 50, backgroundColor: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
              >
                <Search size={16} color="#4a7c59" strokeWidth={2.5} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar lugares..."
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 15, color: '#1a2e25' }}
                />
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { if (searchQuery) setSearchQuery(''); else handleCloseSearch(); }}
                >
                  <X size={17} color="#9aada3" strokeWidth={2.5} />
                </motion.button>
              </div>

              {searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 px-1"
                  style={{ fontSize: 12, color: '#4a7c59', fontWeight: 600 }}
                >
                  {filteredPlaces.length === 0
                    ? '✕ Sin resultados'
                    : `${filteredPlaces.length} ${filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}`}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!currentSection && (
            <motion.div
              key="explore-btn"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
            >
              <ExploreButton
                count={filteredPlaces.length}
                onTap={() => {
                  setSelectedPlaceId(filteredPlaces[0]?.id ?? places[0].id);
                  setShowPlaceStack(true);
                  handleCloseSearch();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Place stack drawer */}
        <AnimatePresence>
          {showPlaceStack && !currentSection && (
            <PlaceStack
              places={filteredPlaces}
              initialPlaceId={selectedPlaceId}
              onClose={() => { setShowPlaceStack(false); setSelectedPlaceId(null); }}
              onPlaceChange={setSelectedPlaceId}
            />
          )}
        </AnimatePresence>

        {/* ── SECTION SCREENS ── */}
        <AnimatePresence>
          {currentSection && (
            <motion.div
              key={currentSection}
              className="absolute inset-0 z-20"
              initial={{ x: '100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34, restDelta: 0.5 }}
            >
              <SectionScreen
                section={currentSection}
                initialCardId={initialCardId}
                onBack={handleBackToMap}
                onCardChange={handleCardChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SIDE NAV ── */}
        <SideNav
          isOpen={showSideNav}
          onClose={() => setShowSideNav(false)}
          currentSection={currentSection}
          onSectionOpen={handleSectionOpen}
        />
      </div>
    </div>
  );
}
