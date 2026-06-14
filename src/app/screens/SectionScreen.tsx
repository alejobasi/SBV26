import { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { SECTION_DATA, SectionData, SectionCard } from '../data/sectionContent';

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard({ data, isVisible }: { data: SectionData; isVisible: boolean }) {
  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{ height: '100%', scrollSnapAlign: 'start' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={data.heroImage}
          alt={data.title}
          className="w-full h-full object-cover"
          style={{
            transform: isVisible ? 'scale(1.0)' : 'scale(1.06)',
            transition: 'transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      </div>

      {/* Dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.72) 65%, rgba(0,0,0,0.97) 100%)',
        }}
      />

      {/* ── Bottom content ── */}
      <motion.div
        className="absolute bottom-0 inset-x-0"
        style={{ padding: '0 22px 44px' }}
        initial={{ y: 36, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 36, opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Section badge */}
        <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
          <div
            className="flex items-center gap-2 rounded-full"
            style={{
              backgroundColor: `${data.color}22`,
              border: `1.5px solid ${data.color}55`,
              paddingTop: 6,
              paddingBottom: 6,
              paddingLeft: 10,
              paddingRight: 14,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: 16 }}>{data.emoji}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: data.color,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {data.title}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 12,
            whiteSpace: 'pre-line',
          }}
        >
          {data.tagline}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 14.5,
            color: 'rgba(255,255,255,0.68)',
            lineHeight: 1.65,
            marginBottom: 24,
          }}
        >
          {data.description}
        </p>

        {/* Stats row */}
        <div
          className="flex gap-0"
          style={{
            marginBottom: 22,
            backgroundColor: 'rgba(255,255,255,0.09)',
            backdropFilter: 'blur(12px)',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.12)',
            overflow: 'hidden',
          }}
        >
          {data.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 flex flex-col items-center"
              style={{
                padding: '14px 8px',
                borderRight:
                  i < data.stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <span
                style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="flex items-center gap-2"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={15} color="rgba(255,255,255,0.45)" />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
            Desliza para explorar
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({
  card,
  color,
  isVisible,
}: {
  card: SectionCard;
  color: string;
  isVisible: boolean;
}) {
  const handleShare = async () => {
    try {
      await navigator.share({ title: card.title, text: card.subtitle, url: window.location.href });
    } catch {
      // Share cancelled or not supported
    }
  };

  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden"
      style={{ height: '100%', scrollSnapAlign: 'start' }}
    >
      {/* Hero image */}
      <div className="absolute inset-0">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
          style={{
            transform: isVisible ? 'scale(1.0)' : 'scale(1.06)',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      </div>

      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: 180,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '72%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.35) 65%, transparent 100%)',
        }}
      />

      {/* Badge – top left */}
      {card.badge && (
        <motion.div
          className="absolute flex items-center"
          style={{ top: 64, left: 18 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'white',
              backgroundColor: `${color}ee`,
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 11,
              paddingRight: 11,
              borderRadius: 50,
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.02em',
            }}
          >
            {card.badge}
          </span>
        </motion.div>
      )}

      {/* Right action buttons */}
      <div
        className="absolute flex flex-col items-center gap-5"
        style={{ right: 14, bottom: 210 }}
      >
        <motion.button
          onClick={handleShare}
          className="flex flex-col items-center"
          style={{ gap: 5 }}
          initial={{ x: 28, opacity: 0 }}
          animate={{ x: isVisible ? 0 : 28, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.28, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          whileTap={{ scale: 0.82 }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 46,
              height: 46,
              backgroundColor: 'rgba(255,255,255,0.16)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.22)',
            }}
          >
            <Share2 size={22} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
            Compartir
          </span>
        </motion.button>
      </div>

      {/* Bottom info panel */}
      <motion.div
        className="absolute bottom-0 inset-x-0"
        style={{ padding: '0 20px 38px' }}
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 28, opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 0.07, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Tags */}
        <div className="flex gap-2 flex-wrap" style={{ marginBottom: 12 }}>
          {card.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 50,
                backgroundColor: 'rgba(255,255,255,0.13)',
                backdropFilter: 'blur(10px)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1.12,
            marginBottom: 5,
          }}
        >
          {card.title}
        </h2>

        {/* Subtitle */}
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
          {card.subtitle}
        </p>

        {/* Meta strip */}
        {(card.meta?.date || card.meta?.location || card.meta?.price) && (
          <div
            className="flex items-center flex-wrap gap-x-3 gap-y-1"
            style={{
              marginBottom: 14,
              padding: '10px 14px',
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.09)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {card.meta?.date && (
              <div className="flex items-center gap-1.5">
                <Calendar size={12} color="rgba(255,255,255,0.55)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)' }}>
                  {card.meta.date}
                </span>
              </div>
            )}
            {card.meta?.location && (
              <div className="flex items-center gap-1">
                <MapPin size={12} color="rgba(255,255,255,0.55)" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)' }}>
                  {card.meta.location}
                </span>
              </div>
            )}
            {card.meta?.price && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'white',
                  backgroundColor: `${color}60`,
                  paddingLeft: 9,
                  paddingRight: 9,
                  paddingTop: 3,
                  paddingBottom: 3,
                  borderRadius: 8,
                }}
              >
                {card.meta.price}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p
          style={
            {
              fontSize: 13.5,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              marginBottom: 18,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties
          }
        >
          {card.description}
        </p>

        {/* CTA */}
        <motion.button
          className="w-full flex items-center justify-center gap-2"
          style={{
            backgroundColor: color,
            color: 'white',
            fontWeight: 700,
            fontSize: 15,
            paddingTop: 15,
            paddingBottom: 15,
            borderRadius: 18,
            boxShadow: `0 8px 30px ${color}50`,
            letterSpacing: '-0.01em',
          }}
          whileTap={{ scale: 0.97 }}
        >
          Más información
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Section Screen ───────────────────────────────────────────────────────────

interface Props {
  section: string;
  onBack: () => void;
}

export function SectionScreen({ section, onBack }: Props) {
  const data = SECTION_DATA[section];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleCard, setVisibleCard] = useState(0);

  const totalCards = data ? data.cards.length + 1 : 0; // +1 for hero

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const h = scrollRef.current.clientHeight;
    if (h === 0) return;
    const idx = Math.round(scrollRef.current.scrollTop / h);
    setVisibleCard(Math.max(0, Math.min(idx, totalCards - 1)));
  }, [totalCards]);

  if (!data) return null;

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: '#0a0a0a' }}>

      {/* ── Floating header ── */}
      <div
        className="absolute top-0 inset-x-0 z-10 flex items-center justify-between"
        style={{
          paddingTop: 52,
          paddingBottom: 14,
          paddingLeft: 16,
          paddingRight: 16,
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        } as React.CSSProperties}
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-1.5"
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 12,
            paddingRight: 16,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.13)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          whileTap={{ scale: 0.92 }}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ArrowLeft size={14} color="white" strokeWidth={2.5} />
          <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>Moraleja</span>
        </motion.button>

        {/* Section title */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span style={{ fontSize: 17 }}>{data.emoji}</span>
          <span
            style={{ fontSize: 15, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}
          >
            {data.title}
          </span>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Array.from({ length: totalCards }).map((_, i) => (
            <motion.div
              key={i}
              style={{ borderRadius: 4, backgroundColor: 'white' }}
              animate={{
                width: i === visibleCard ? 18 : 5,
                height: 5,
                opacity: i === visibleCard ? 1 : 0.3,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            />
          ))}
        </motion.div>
      </div>

      {/* ── TikTok snap feed ── */}
      <div
        ref={scrollRef}
        className="w-full h-full"
        style={{
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
        onScroll={handleScroll}
      >
        <HeroCard data={data} isVisible={visibleCard === 0} />

        {data.cards.map((card, i) => (
          <ContentCard
            key={card.id}
            card={card}
            color={data.color}
            isVisible={visibleCard === i + 1}
          />
        ))}
      </div>
    </div>
  );
}
