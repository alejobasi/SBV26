import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  ChevronDown,
  X,
  Copy,
  Check,
  Lock,
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
            fontSize: 'clamp(26px, 7vw, 36px)',
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
        {data.stats.length > 0 && (
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
        )}

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

// ─── Share Sheet ──────────────────────────────────────────────────────────────

function ShareSheet({
  card,
  onClose,
}: {
  card: SectionCard;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const text = `${card.title} – ${card.subtitle}`;

  const options = [
    {
      label: 'WhatsApp',
      color: '#25D366',
      icon: '💬',
      href: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
    },
    {
      label: 'Telegram',
      color: '#229ED9',
      icon: '✈️',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      label: 'Twitter / X',
      color: '#000000',
      icon: '🐦',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Facebook',
      color: '#1877F2',
      icon: '👤',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full"
        style={{
          maxWidth: 480,
          backgroundColor: '#1a1a1a',
          borderRadius: '24px 24px 0 0',
          padding: 'clamp(20px, 5vw, 28px)',
          paddingBottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 'clamp(15px, 4vw, 17px)', fontWeight: 700, color: 'white' }}>
            Compartir
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* App grid */}
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(8px, 3vw, 16px)', marginBottom: 20 }}
        >
          {options.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
              style={{ gap: 8, textDecoration: 'none' }}
            >
              <div
                style={{
                  width: 'clamp(52px, 14vw, 62px)',
                  height: 'clamp(52px, 14vw, 62px)',
                  borderRadius: 16,
                  backgroundColor: opt.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'clamp(22px, 6vw, 28px)',
                }}
              >
                {opt.icon}
              </div>
              <span style={{ fontSize: 'clamp(10px, 3vw, 12px)', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                {opt.label}
              </span>
            </a>
          ))}
        </div>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            padding: '13px 16px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            {copied ? <Check size={18} color="#4ade80" /> : <Copy size={18} color="white" />}
          </div>
          <div className="flex flex-col items-start" style={{ overflow: 'hidden' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: copied ? '#4ade80' : 'white' }}>
              {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
            </span>
            <span
              style={{
                fontSize: 11, color: 'rgba(255,255,255,0.4)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
              }}
            >
              {url}
            </span>
          </div>
        </button>
      </motion.div>
    </motion.div>
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
  const [showShare, setShowShare] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: card.title, text: card.subtitle, url: window.location.href });
        return;
      } catch {
        // cancelled, fall through to sheet
      }
    }
    setShowShare(true);
  };

  return (
    <>
      <div
        className="relative w-full flex-shrink-0 overflow-hidden"
        style={{ height: '100%', scrollSnapAlign: 'start' }}
        onClick={() => setUiVisible((v) => !v)}
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
        <motion.div
          className="absolute inset-x-0 top-0"
          animate={{ opacity: uiVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            height: '25vmax',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
          }}
        />

        {/* Bottom vignette */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          animate={{ opacity: uiVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            height: '72%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.35) 65%, transparent 100%)',
          }}
        />

        {/* Badge – top left */}
        {card.badge && (
          <motion.div
            className="absolute flex items-center"
            style={{ top: 'clamp(56px, 10vh, 72px)', left: 18 }}
            animate={{ opacity: uiVisible && isVisible ? 1 : 0, x: uiVisible && isVisible ? 0 : -20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span
              style={{
                fontSize: 'clamp(10px, 2.5vw, 12px)',
                fontWeight: 700,
                color: 'white',
                backgroundColor: `${color}ee`,
                padding: '5px 11px',
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
        <motion.div
          className="absolute flex flex-col items-center gap-5"
          style={{ right: 'clamp(10px, 3vw, 18px)', bottom: 'clamp(180px, 32vh, 260px)' }}
          animate={{ opacity: uiVisible && isVisible ? 1 : 0, x: uiVisible && isVisible ? 0 : 28 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={handleShare}
            className="flex flex-col items-center"
            style={{ gap: 5 }}
            whileTap={{ scale: 0.82 }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 'clamp(40px, 10vw, 50px)',
                height: 'clamp(40px, 10vw, 50px)',
                backgroundColor: 'rgba(255,255,255,0.16)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              <Share2 size={22} color="white" strokeWidth={2} />
            </div>
            <span style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
              Compartir
            </span>
          </motion.button>
        </motion.div>

        {/* Bottom info panel */}
        <motion.div
          className="absolute bottom-0 inset-x-0"
          style={{ padding: 'clamp(0px, 2vh, 10px) clamp(16px, 5vw, 24px) clamp(28px, 6vh, 48px)' }}
          animate={{ opacity: uiVisible ? 1 : 0, y: uiVisible ? 0 : 28 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Tags */}
          <div className="flex gap-2 flex-wrap" style={{ marginBottom: 'clamp(8px, 2vh, 14px)' }}>
            {card.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  padding: '4px 10px',
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
              fontSize: 'clamp(22px, 6vw, 30px)',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              marginBottom: 'clamp(4px, 1vh, 8px)',
            }}
          >
            {card.title}
          </h2>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', marginBottom: 'clamp(8px, 2vh, 14px)' }}>
            {card.subtitle}
          </p>

          {/* Meta strip */}
          {(card.meta?.date || card.meta?.location || card.meta?.price) && (
            <div
              className="flex items-center flex-wrap gap-x-3 gap-y-1"
              style={{
                marginBottom: 'clamp(8px, 2vh, 14px)',
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
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.68)' }}>
                    {card.meta.date}
                  </span>
                </div>
              )}
              {card.meta?.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} color="rgba(255,255,255,0.55)" />
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.68)' }}>
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
                    padding: '3px 9px',
                    borderRadius: 8,
                  }}
                >
                  {card.meta.price}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {card.description && (
            <p
              style={
                {
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                } as React.CSSProperties
              }
            >
              {card.description}
            </p>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showShare && <ShareSheet card={card} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </>
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
  const [activeGroup, setActiveGroup] = useState<string>(data?.groups?.[0]?.id ?? '');

  const cards = data
    ? data.groups
      ? data.cards.filter((c) => c.group === activeGroup)
      : data.cards
    : [];

  const showHero = data?.showHero !== false;
  const totalCards = data ? Math.max(1, cards.length + (showHero ? 1 : 0)) : 0;

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const h = scrollRef.current.clientHeight;
    if (h === 0) return;
    const idx = Math.round(scrollRef.current.scrollTop / h);
    setVisibleCard(Math.max(0, Math.min(idx, totalCards - 1)));
  }, [totalCards]);

  const handleGroupChange = (id: string) => {
    setActiveGroup(id);
    setVisibleCard(0);
    scrollRef.current?.scrollTo({ top: 0 });
  };

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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(22px, 6vw, 28px)',
              color: 'white',
              letterSpacing: '0.18em',
            }}
          >
            {data.title.toUpperCase()}
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

      {/* ── Group tabs ── */}
      {data.groups && (
        <div
          className="absolute inset-x-0 z-10 flex items-center justify-center gap-2"
          style={{ top: 104, paddingInline: 16 }}
        >
          {data.groups.map((group) => {
            const isActive = group.id === activeGroup;
            const isGroupEmpty = !data.cards.some((c) => c.group === group.id);
            return (
              <motion.button
                key={group.id}
                onClick={() => handleGroupChange(group.id)}
                className="flex items-center gap-1.5"
                style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 14,
                  paddingRight: 14,
                  borderRadius: 50,
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                  backgroundColor: isActive ? data.color : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${isActive ? data.color : 'rgba(255,255,255,0.18)'}`,
                  backdropFilter: 'blur(10px)',
                }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {isGroupEmpty && <Lock size={11} color={isActive ? 'white' : '#fbbf24'} strokeWidth={2.5} />}
                {group.label}
              </motion.button>
            );
          })}
        </div>
      )}

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
        {showHero && <HeroCard data={data} isVisible={visibleCard === 0} />}

        {!showHero && cards.length === 0 && <EmptyGroupCard color={data.color} />}

        {cards.map((card, i) => (
          <ContentCard
            key={card.id}
            card={card}
            color={data.color}
            isVisible={visibleCard === (showHero ? i + 1 : i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Empty group placeholder ──────────────────────────────────────────────────

function EmptyGroupCard({ color }: { color: string }) {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center flex-shrink-0"
      style={{
        height: '100%',
        scrollSnapAlign: 'start',
        background: `radial-gradient(circle at 50% 40%, ${color}22 0%, #14110d 55%, #0a0a0a 100%)`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 72, height: 72,
          backgroundColor: '#fbbf2420',
          border: '1.5px solid #fbbf2450',
          marginBottom: 18,
        }}
      >
        <Lock size={28} color="#fbbf24" strokeWidth={2} />
      </div>
      <p style={{ fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
        Muy pronto
      </p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 240 }}>
        Estamos preparando los eventos generales de las fiestas.
      </p>
    </div>
  );
}
