import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const TARGET = new Date('2026-07-10T00:00:00');

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

type Phase = 'hero' | 'mini' | 'hidden';

export function FestivalBanner() {
  const [phase, setPhase] = useState<Phase>('hero');
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft());
      setTick((t) => !t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setPhase('mini'), 3000);
    return () => clearTimeout(id);
  }, []);

  if (phase === 'hidden') return null;

  return (
    <AnimatePresence mode="wait">
      {phase === 'hero' && (
        <motion.div
          key="hero"
          className="absolute left-0 right-0 z-20"
          style={{ top: 0 }}
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        >
          {/* Pañuelo shape: diagonal bottom edge via clip-path */}
          <div
            style={{
              background: 'linear-gradient(160deg, #064e3b 0%, #065f46 30%, #047857 65%, #059669 100%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 100%)',
              paddingTop: 56,
              paddingBottom: 52,
              paddingInline: 28,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative animated circles — simula brillo de tela */}
            <motion.div
              style={{
                position: 'absolute',
                top: -40,
                left: -40,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              style={{
                position: 'absolute',
                top: 10,
                right: -60,
                width: 260,
                height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            />
            <motion.div
              style={{
                position: 'absolute',
                bottom: 20,
                left: '40%',
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(167,243,208,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            />

            {/* Líneas decorativas estilo tela */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 29px)',
                pointerEvents: 'none',
              }}
            />

            {/* Contenido */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Etiqueta superior */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#6ee7b7',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  margin: '0 0 8px',
                  textAlign: 'center',
                }}
              >
                Moraleja · 10 – 14 Jul 2026
              </motion.p>

              {/* Título */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: 'white',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 20px',
                  textAlign: 'center',
                }}
              >
                Fiestas de{' '}
                <span style={{ color: '#6ee7b7' }}>San Buenaventura</span>
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.12)',
                  marginBottom: 18,
                  transformOrigin: 'left',
                }}
              />

              {/* Countdown grande */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.45)',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    margin: '0 0 12px',
                  }}
                >
                  Faltan
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 6 }}>
                  <HeroUnit value={timeLeft.days} label="días" />
                  <HeroColon />
                  <HeroUnit value={timeLeft.hours} label="horas" />
                  <HeroColon />
                  <HeroUnit value={timeLeft.minutes} label="min" />
                  <HeroColon />
                  <HeroUnit value={timeLeft.seconds} label="seg" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {phase === 'mini' && (
        <motion.div
          key="mini"
          className="absolute left-0 right-0 z-40 flex justify-center"
          style={{ top: 112 }}
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        >
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(4,120,87,0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(52,211,153,0.35)',
              borderRadius: 999,
              paddingInline: 14,
              paddingBlock: 7,
            }}
            animate={{
              boxShadow: tick
                ? '0 0 0 3px rgba(52,211,153,0.18), 0 4px 20px rgba(4,120,87,0.4)'
                : '0 0 0 0px rgba(52,211,153,0.04), 0 4px 20px rgba(4,120,87,0.25)',
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Dot pulsante */}
            <motion.div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#6ee7b7',
                flexShrink: 0,
              }}
              animate={{ scale: tick ? [1, 1.5, 1] : 1, opacity: tick ? [1, 0.6, 1] : 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Label festival */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#a7f3d0',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}
            >
              San Buenaventura
            </span>

            {/* Separador */}
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />

            {/* Countdown compacto */}
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: 'white',
                letterSpacing: '0.02em',
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m{' '}
              <motion.span
                key={timeLeft.seconds}
                initial={{ opacity: 0.4, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'inline-block', color: '#6ee7b7' }}
              >
                {pad(timeLeft.seconds)}s
              </motion.span>
            </span>

            {/* Botón cerrar */}
            <motion.button
              onClick={() => setPhase('hidden')}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginLeft: 2,
              }}
              whileTap={{ scale: 0.82 }}
              whileHover={{ background: 'rgba(255,255,255,0.22)' }}
            >
              <X size={10} color="rgba(255,255,255,0.75)" strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 58 }}>
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0.3 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 14,
          width: '100%',
          paddingBlock: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pad(value)}
        </span>
      </motion.div>
      <span
        style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function HeroColon() {
  return (
    <span
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.3)',
        lineHeight: 1,
        marginBottom: 22,
        flexShrink: 0,
      }}
    >
      :
    </span>
  );
}
