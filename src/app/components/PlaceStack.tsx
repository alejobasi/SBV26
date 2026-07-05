import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
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
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center"
      style={{ paddingBottom: 24, paddingInline: 16 }}
      initial={{ y: 140, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 140, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
    >
      <div className="flex items-center justify-center" style={{ width: '100%', maxWidth: 478, gap: 8 }}>
        {places.length > 1 && (
          <motion.button
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Lugar anterior"
            style={{
              flexShrink: 0,
              width: 'clamp(32px, 9vw, 40px)', height: 'clamp(32px, 9vw, 40px)', borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              border: `1.5px solid ${color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(20,50,30,0.18)`,
              cursor: index === 0 ? 'default' : 'pointer',
              opacity: index === 0 ? 0.35 : 1,
            }}
            whileTap={index === 0 ? {} : { scale: 0.85 }}
            whileHover={index === 0 ? {} : { scale: 1.06, background: '#ffffff' }}
          >
            <ChevronLeft size={20} color={color} strokeWidth={2.5} />
          </motion.button>
        )}
        <div style={{ width: '100%', maxWidth: 398, minWidth: 0 }}>
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
              background: 'linear-gradient(165deg, #ffffff 0%, #f4faf6 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${color}25`,
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: `0 24px 64px rgba(20,60,40,0.16), 0 0 0 1px rgba(255,255,255,0.6), 0 8px 24px ${color}18`,
              cursor: places.length > 1 ? 'grab' : 'default',
            }}
          >
            {/* Top accent */}
            <motion.div
              style={{ height: 3, background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)` }}
              animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            <div style={{ padding: '18px clamp(14px, 4.5vw, 20px) 22px' }}>
              {/* Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
                  <motion.div
                    style={{
                      width: 'clamp(38px, 11vw, 44px)', height: 'clamp(38px, 11vw, 44px)',
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${color}30, ${color}15)`,
                      border: `1.5px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 'clamp(17px, 5vw, 20px)',
                      boxShadow: `0 4px 16px ${color}30`,
                      overflow: 'hidden',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {place.category === 'Nightlife'
                      ? <img src="/SBV_logo_redondo.png" style={{ width: '82%', height: '82%', objectFit: 'cover', borderRadius: 8 }} />
                      : emoji}
                  </motion.div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontSize: 9, fontWeight: 700, color: color,
                      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {CATEGORY_LABELS[place.category] ?? place.category}
                    </p>
                    <h2 style={{
                      fontSize: 'clamp(14px, 4.3vw, 17px)', fontWeight: 800, color: '#16281c',
                      letterSpacing: '-0.02em', lineHeight: 1.25,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    } as React.CSSProperties}>
                      {place.name}
                    </h2>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${color}0d`,
                    border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginLeft: 8, alignSelf: 'flex-start', cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.82 }}
                  whileHover={{ background: `${color}1a` }}
                >
                  <X size={13} color={color} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${color}35, rgba(20,60,40,0.05))`, marginBottom: 16 }} />

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
                      style={{ borderRadius: 4, backgroundColor: i === index ? color : `${color}30`, cursor: 'pointer', border: 'none' }}
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
        </div>
        {places.length > 1 && (
          <motion.button
            onClick={() => go(1)}
            disabled={index === places.length - 1}
            aria-label="Siguiente lugar"
            style={{
              flexShrink: 0,
              width: 'clamp(32px, 9vw, 40px)', height: 'clamp(32px, 9vw, 40px)', borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              border: `1.5px solid ${color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(20,50,30,0.18)`,
              cursor: index === places.length - 1 ? 'default' : 'pointer',
              opacity: index === places.length - 1 ? 0.35 : 1,
            }}
            whileTap={index === places.length - 1 ? {} : { scale: 0.85 }}
            whileHover={index === places.length - 1 ? {} : { scale: 1.06, background: '#ffffff' }}
          >
            <ChevronRight size={20} color={color} strokeWidth={2.5} />
          </motion.button>
        )}
      </div>

      {places.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <p style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, fontWeight: 600, color: '#3d6b4d',
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${color}25`,
            borderRadius: 20, padding: '5px 12px',
            boxShadow: '0 4px 14px rgba(20,60,40,0.12)',
          }}>
            <ChevronLeft size={11} strokeWidth={2.5} />
            Desliza o usa las flechas
            <ChevronRight size={11} strokeWidth={2.5} />
          </p>
        </div>
      )}
    </motion.div>
  );
}
