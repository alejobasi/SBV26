import type { ReactNode } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Map, ChevronRight, LayoutGrid, Beef, CalendarDays, LifeBuoy, Mail, Instagram, ExternalLink } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from './data/places';
import { places } from './data/places';
import { HelpModal } from './HelpModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string | null;
  onSectionOpen: (section: string | null) => void;
}

const CATEGORY_ICONS: Record<string, ReactNode> = {
  All:          <LayoutGrid size={18} strokeWidth={2} />,
  Events:       <CalendarDays size={18} strokeWidth={2} />,
  Bullfighting: <Beef size={18} strokeWidth={2} />,
};

function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full"
          style={{
            maxWidth: 430,
            background: 'linear-gradient(160deg, #f7f5ef 0%, #fafaf7 100%)',
            borderRadius: '24px 24px 0 0',
            padding: '28px 24px',
            paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d0cdc6', margin: '0 auto 20px' }} />

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: '#9aada3', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              Desarrollado por
            </p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1a2e25', letterSpacing: '-0.02em' }}>
              Alejo Basilio Alfonso
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href="mailto:basilioalfonsoalejo@gmail.com"
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                className="flex items-center gap-3"
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  backgroundColor: '#4a7c5912',
                  border: '1.5px solid #4a7c5925',
                }}
                whileTap={{ scale: 0.97, backgroundColor: '#4a7c5920' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#4a7c5920', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={18} color="#4a7c59" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e25' }}>Correo electrónico</div>
                  <div style={{ fontSize: 11, color: '#9aada3', marginTop: 1 }}>basilioalfonsoalejo@gmail.com</div>
                </div>
                <ExternalLink size={14} color="#c0cdc6" strokeWidth={2} />
              </motion.div>
            </a>

            <a
              href="https://www.instagram.com/alejobasi/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                className="flex items-center gap-3"
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  backgroundColor: '#e1306c12',
                  border: '1.5px solid #e1306c25',
                }}
                whileTap={{ scale: 0.97, backgroundColor: '#e1306c20' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Instagram size={18} color="white" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2e25' }}>Instagram</div>
                  <div style={{ fontSize: 11, color: '#9aada3', marginTop: 1 }}>@alejobasi</div>
                </div>
                <ExternalLink size={14} color="#c0cdc6" strokeWidth={2} />
              </motion.div>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function SideNav({ isOpen, onClose, currentSection, onSectionOpen }: Props) {
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleSelect = (cat: string) => {
    onClose();
    setTimeout(() => onSectionOpen(cat === 'All' ? null : cat), 260);
  };

  const handleOpenHelp = () => {
    onClose();
    setTimeout(() => setShowHelp(true), 260);
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(10,20,14,0.5)', backdropFilter: 'blur(7px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
            style={{
              width: 290,
              background: 'linear-gradient(160deg, #f7f5ef 0%, #fafaf7 60%, #f0ede5 100%)',
              borderRadius: '0 32px 32px 0',
              boxShadow: '8px 0 60px rgba(0,0,0,0.28)',
              overflow: 'hidden',
            }}
            initial={{ x: -310 }}
            animate={{ x: 0 }}
            exit={{ x: -310 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            {/* Decorative top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: 'linear-gradient(90deg, #4a7c59, #6ee7b7, #4a7c59)',
            }} />

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between"
              style={{ paddingLeft: 24, paddingRight: 20, paddingTop: 62, paddingBottom: 22 }}
            >
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{ width: 26, height: 26, backgroundColor: '#4a7c5920', border: '1px solid #4a7c5930' }}
                  >
                    <Map size={13} color="#4a7c59" />
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#4a7c59', fontWeight: 700 }}>
                    Descubre
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 32,
                  color: '#1a2e25',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}>
                  Moraleja
                </h2>
                <p style={{ fontSize: 11, color: '#9aada3', marginTop: 3, fontWeight: 500 }}>
                  San Buenaventura 2026
                </p>
              </div>

              <motion.button
                onClick={onClose}
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#1a2e2510', border: '1px solid #1a2e2515' }}
                whileTap={{ scale: 0.88 }}
                whileHover={{ backgroundColor: '#1a2e2518' }}
              >
                <X size={15} color="#4a7c59" strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* ── Section label ── */}
            <div style={{ paddingLeft: 28, paddingBottom: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: '#9aada3',
                  fontWeight: 700,
                }}
              >
                Secciones
              </span>
            </div>

            {/* ── Category list ── */}
            <div className="flex-1 overflow-y-auto" style={{ paddingLeft: 12, paddingRight: 12 }}>
              {CATEGORIES.map((cat, i) => {
                const isActive = cat === 'All' ? currentSection === null : currentSection === cat;
                const color = CATEGORY_COLORS[cat];
                const icon = CATEGORY_ICONS[cat];

                return (
                  <motion.button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className="w-full flex items-center gap-3 relative"
                    style={{
                      paddingLeft: 14,
                      paddingRight: 12,
                      paddingTop: 12,
                      paddingBottom: 12,
                      borderRadius: 20,
                      marginBottom: 4,
                      backgroundColor: isActive ? `${color}14` : 'transparent',
                      border: isActive ? `1.5px solid ${color}30` : '1.5px solid transparent',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                    initial={{ x: -28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.055, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.96, backgroundColor: `${color}20` }}
                  >
                    {/* Ripple on tap */}
                    <motion.div
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 20,
                        background: `radial-gradient(circle at 50% 50%, ${color}25 0%, transparent 70%)`,
                        pointerEvents: 'none',
                      }}
                      initial={{ opacity: 0 }}
                      whileTap={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Active left bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        style={{
                          position: 'absolute', left: 0, top: 8, bottom: 8,
                          width: 3, borderRadius: 4, backgroundColor: color,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Icon badge */}
                    <motion.div
                      className="flex items-center justify-center rounded-2xl flex-shrink-0"
                      style={{
                        width: 42, height: 42,
                        backgroundColor: isActive ? color : `${color}16`,
                        boxShadow: isActive ? `0 6px 18px ${color}45` : 'none',
                        color: isActive ? 'white' : color,
                      }}
                      animate={{ backgroundColor: isActive ? color : `${color}16` }}
                      transition={{ duration: 0.25 }}
                    >
                      {icon}
                    </motion.div>

                    {/* Label + subtitle */}
                    <div className="flex-1 text-left" style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? color : '#1a2e25',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                      }}>
                        {CATEGORY_LABELS[cat] ?? cat}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: isActive ? `${color}99` : '#b0bfb8',
                        marginTop: 2,
                        fontWeight: 400,
                      }}>
                        {cat === 'All'
                          ? 'Todos los lugares'
                          : cat === 'Events'
                          ? 'Programa de fiestas'
                          : cat === 'Bullfighting'
                          ? 'Corridas y encierros'
                          : 'Explorar'}
                      </div>
                    </div>

                    {/* Chevron */}
                    <motion.div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 28, height: 28,
                        backgroundColor: isActive ? `${color}20` : '#1a2e250a',
                      }}
                      animate={{ x: isActive ? 0 : 0 }}
                    >
                      <ChevronRight size={14} color={isActive ? color : '#c0cdc6'} strokeWidth={2.5} />
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>

            {/* ── Footer: Ayuda + branding ── */}
            <div style={{ borderTop: '1px solid #edeae2', padding: '14px 16px 28px' }}>
              <motion.button
                onClick={handleOpenHelp}
                className="w-full flex items-center gap-3"
                style={{
                  paddingLeft: 14,
                  paddingRight: 12,
                  paddingTop: 11,
                  paddingBottom: 11,
                  borderRadius: 18,
                  marginBottom: 12,
                  backgroundColor: '#4a7c5912',
                  border: '1.5px solid #4a7c5925',
                  cursor: 'pointer',
                }}
                whileTap={{ scale: 0.97, backgroundColor: '#4a7c5920' }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 34, height: 34, backgroundColor: '#4a7c5920' }}
                >
                  <LifeBuoy size={16} color="#4a7c59" strokeWidth={2} />
                </div>
                <div className="flex-1 text-left">
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a2e25' }}>Ayuda</div>
                  <div style={{ fontSize: 10.5, color: '#9aada3' }}>Sugerencias e incidencias</div>
                </div>
                <ChevronRight size={14} color="#c0cdc6" strokeWidth={2.5} />
              </motion.button>

              <p style={{ fontSize: 10, color: '#c0cdc6', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, paddingLeft: 8 }}>
                Fiestas · 10–14 Jul 2026
              </p>
              <p style={{ fontSize: 12, color: '#9aada3', marginTop: 3, paddingLeft: 8 }}>
                San Buenaventura · Moraleja
              </p>

              <motion.button
                onClick={() => setShowContact(true)}
                style={{
                  marginTop: 10,
                  paddingLeft: 8,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 8px',
                  borderRadius: 8,
                }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ backgroundColor: '#4a7c5910' }}
              >
                <span style={{ fontSize: 9.5, color: '#4a7c59', fontWeight: 700, textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}>
                  Desarrollado por Alejo Basilio Alfonso
                </span>
                <ExternalLink size={9} color="#4a7c59" strokeWidth={2.5} />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
