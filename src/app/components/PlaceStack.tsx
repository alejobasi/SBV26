import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { X, Navigation2 } from 'lucide-react';
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
  const [direction, setDirection] = useState(0);
  const dragX = useMotionValue(0);
  const cardOpacity = useTransform(dragX, [-120, 0, 120], [0.4, 1, 0.4]);
  const cardRotate = useTransform(dragX, [-120, 0, 120], [-6, 0, 6]);

  useEffect(() => {
    setIndex(Math.max(0, places.findIndex((p) => p.id === initialPlaceId)));
  }, [initialPlaceId, places]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = Math.max(0, Math.min(places.length - 1, index + dir));
      if (next === index) return;
      setDirection(dir);
      setIndex(next);
      onPlaceChange(places[next].id);
    },
    [index, places, onPlaceChange],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x < -60) go(1);
      else if (info.offset.x > 60) go(-1);
      dragX.set(0);
    },
    [go, dragX],
  );

  if (!places.length) return null;

  const place = places[index];
  const color = CATEGORY_COLORS[place.category] || '#4a7c59';
  const emoji = CATEGORY_EMOJIS[place.category] || '📍';

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.95 }),
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-30 flex justify-center"
      style={{ paddingBottom: 24, paddingInline: 16 }}
      initial={{ y: 140, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 140, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
    >
      <div style={{ width: '100%', maxWidth: 398 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={place.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={places.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            style={{
              x: dragX,
              opacity: cardOpacity,
              rotate: cardRotate,
              background: 'rgba(8,22,14,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${color}30`,
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), 0 8px 24px ${color}22`,
              cursor: places.length > 1 ? 'grab' : 'default',
            }}
          >
            {/* Top accent */}
            <motion.div
              style={{ height: 3, background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)` }}
              animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            <div style={{ padding: '18px 20px 22px' }}>
              {/* Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
                  <motion.div
                    style={{
                      width: 44, height: 44,
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${color}30, ${color}15)`,
                      border: `1.5px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 20,
                      boxShadow: `0 4px 16px ${color}30`,
                      overflow: 'hidden',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {place.category === 'Nightlife'
                      ? <img src="/SBV_logo_redondo.png" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8 }} />
                      : emoji}
                  </motion.div>

                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 9, fontWeight: 700, color: color,
                      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3,
                    }}>
                      {CATEGORY_LABELS[place.category] ?? place.category}
                    </p>
                    <h2 style={{
                      fontSize: 17, fontWeight: 800, color: 'white',
                      letterSpacing: '-0.02em', lineHeight: 1.2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {place.name}
                    </h2>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginLeft: 10, cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.82 }}
                  whileHover={{ background: 'rgba(255,255,255,0.13)' }}
                >
                  <X size={13} color="rgba(255,255,255,0.55)" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${color}40, rgba(255,255,255,0.04))`, marginBottom: 16 }} />

              {/* CTA */}
              <motion.a
                href={mapsUrl(place)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, width: '100%', paddingBlock: 14, borderRadius: 18,
                  background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
                  color: 'white', fontWeight: 700, fontSize: 14,
                  letterSpacing: '-0.01em', textDecoration: 'none',
                  boxShadow: `0 8px 28px ${color}55`,
                  border: `1px solid ${color}60`,
                }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ filter: 'brightness(1.1)', boxShadow: `0 12px 36px ${color}70` }}
              >
                <Navigation2 size={15} strokeWidth={2.5} />
                Cómo llegar
              </motion.a>

              {/* Dot nav */}
              {places.length > 1 && (
                <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 16 }}>
                  {places.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); onPlaceChange(places[i].id); }}
                      style={{ borderRadius: 4, backgroundColor: i === index ? color : 'rgba(255,255,255,0.18)', cursor: 'pointer', border: 'none' }}
                      animate={{ width: i === index ? 20 : 6, height: 6, opacity: i === index ? 1 : 0.4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                      whileHover={{ opacity: 0.8 }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {places.length > 1 && (
          <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8, fontWeight: 500 }}>
            Desliza para navegar
          </p>
        )}
      </div>
    </motion.div>
  );
}
