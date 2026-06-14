import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Navigation2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Place, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from './data/places';

function mapsUrl(place: Place) {
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}

interface Props {
  places: Place[];
  initialPlaceId: string | null;
  onClose: () => void;
  onPlaceChange: (id: string) => void;
}

export function PlaceStack({ places, initialPlaceId, onClose, onPlaceChange }: Props) {
  const startIndex = Math.max(0, places.findIndex((p) => p.id === initialPlaceId));
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(Math.max(0, places.findIndex((p) => p.id === initialPlaceId)));
  }, [initialPlaceId, places]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = Math.max(0, Math.min(places.length - 1, index + dir));
      setIndex(next);
      onPlaceChange(places[next].id);
    },
    [index, places, onPlaceChange],
  );

  if (!places.length) return null;

  const place = places[index];
  const color = CATEGORY_COLORS[place.category] || '#4a7c59';
  const emoji = CATEGORY_EMOJIS[place.category] || '📍';

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex justify-center"
      style={{ paddingBottom: 24, paddingInline: 16 }}
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={place.id}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%',
            maxWidth: 398,
            background: 'rgba(10,26,18,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

          <div style={{ padding: '18px 20px 20px' }}>
            {/* Header row */}
            <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
              <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
                {/* Category badge */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 18,
                  }}
                >
                  {emoji}
                </div>

                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: color,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {CATEGORY_LABELS[place.category] ?? place.category}
                  </p>
                  <h2
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: 'white',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {place.name}
                  </h2>
                </div>
              </div>

              {/* Close */}
              <motion.button
                onClick={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginLeft: 10,
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.85 }}
              >
                <X size={13} color="rgba(255,255,255,0.6)" strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

            {/* Google Maps CTA */}
            <motion.a
              href={mapsUrl(place)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                width: '100%',
                paddingBlock: 13,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                boxShadow: `0 6px 24px ${color}44`,
              }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ filter: 'brightness(1.08)' }}
            >
              <Navigation2 size={15} strokeWidth={2.5} />
              Cómo llegar
            </motion.a>

            {/* Navigation between places */}
            {places.length > 1 && (
              <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
                <motion.button
                  onClick={() => go(-1)}
                  disabled={index === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    borderRadius: 50,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: index === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: index === 0 ? 'default' : 'pointer',
                  }}
                  whileTap={index > 0 ? { scale: 0.92 } : {}}
                >
                  <ChevronLeft size={14} />
                  Anterior
                </motion.button>

                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  {index + 1} / {places.length}
                </span>

                <motion.button
                  onClick={() => go(1)}
                  disabled={index === places.length - 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    borderRadius: 50,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: index === places.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: index === places.length - 1 ? 'default' : 'pointer',
                  }}
                  whileTap={index < places.length - 1 ? { scale: 0.92 } : {}}
                >
                  Siguiente
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
