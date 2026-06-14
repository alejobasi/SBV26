import { motion, AnimatePresence } from 'motion/react';
import { X, User, Map, ChevronRight } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from './data/places';
import { places } from './data/places';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string | null;
  onSectionOpen: (section: string | null) => void;
}

export function SideNav({ isOpen, onClose, currentSection, onSectionOpen }: Props) {
  const countByCategory = (cat: string) =>
    cat === 'All' ? places.length : places.filter((p) => p.category === cat).length;

  return (
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
              backgroundColor: '#fafaf7',
              borderRadius: '0 28px 28px 0',
              boxShadow: '6px 0 48px rgba(0,0,0,0.22)',
            }}
            initial={{ x: -310 }}
            animate={{ x: 0 }}
            exit={{ x: -310 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between"
              style={{ paddingLeft: 24, paddingRight: 20, paddingTop: 58, paddingBottom: 20 }}
            >
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: 3 }}>
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{ width: 28, height: 28, backgroundColor: '#4a7c5918' }}
                  >
                    <Map size={14} color="#4a7c59" />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#4a7c59',
                      fontWeight: 700,
                    }}
                  >
                    Descubre
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: '#1a2e25',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                  }}
                >
                  Moraleja
                </h2>
              </div>

              <motion.button
                onClick={onClose}
                className="flex items-center justify-center rounded-xl"
                style={{ width: 36, height: 36, backgroundColor: '#f0ede5' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={15} color="#4a7c59" />
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
                // 'All' is active when on the map (no section); others when their section is open
                const isActive =
                  cat === 'All' ? currentSection === null : currentSection === cat;
                const color = CATEGORY_COLORS[cat];
                const emoji = CATEGORY_EMOJIS[cat];
                const count = countByCategory(cat);

                return (
                  <motion.button
                    key={cat}
                    onClick={() => onSectionOpen(cat === 'All' ? null : cat)}
                    className="w-full flex items-center gap-3"
                    style={{
                      paddingLeft: 14,
                      paddingRight: 12,
                      paddingTop: 11,
                      paddingBottom: 11,
                      borderRadius: 18,
                      marginBottom: 3,
                      backgroundColor: isActive ? `${color}12` : 'transparent',
                      border: isActive
                        ? `1.5px solid ${color}28`
                        : '1.5px solid transparent',
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Icon badge */}
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: isActive ? color : `${color}18`,
                        boxShadow: isActive ? `0 4px 14px ${color}40` : 'none',
                        transition: 'background-color 0.2s, box-shadow 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{emoji}</span>
                    </div>

                    {/* Label + subtitle */}
                    <div className="flex-1 text-left" style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? color : '#2d3d35',
                          lineHeight: 1.2,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {CATEGORY_LABELS[cat] ?? cat}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: isActive ? `${color}99` : '#9aada3',
                          marginTop: 2,
                          fontWeight: 400,
                        }}
                      >
                        {cat === 'All'
                          ? 'Todos los lugares'
                          : `${count} ${count === 1 ? 'lugar' : 'lugares'}`}
                      </div>
                    </div>

                    {/* Navigation chevron */}
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: isActive ? `${color}18` : '#f0ede5',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <ChevronRight
                        size={15}
                        color={isActive ? color : '#9aada3'}
                        strokeWidth={2.5}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* ── Footer ── */}
            <div
              style={{
                borderTop: '1px solid #edeae2',
                padding: '20px 24px 36px',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 40, height: 40, backgroundColor: '#4a7c5914' }}
                >
                  <User size={16} color="#4a7c59" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2e25' }}>
                    Mi cuenta
                  </div>
                  <div style={{ fontSize: 12, color: '#9aada3' }}>Ajustes y lugares guardados</div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
