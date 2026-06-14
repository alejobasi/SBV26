import { useRef } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from './data/places';

interface Props {
  activeCategory: string;
  onChange: (cat: string) => void;
}

export function CategoryPills({ activeCategory, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="absolute left-0 right-0 z-20"
      style={{ bottom: 100 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          const color = CATEGORY_COLORS[cat];
          const emoji = CATEGORY_EMOJIS[cat];

          return (
            <motion.button
              key={cat}
              onClick={() => onChange(cat)}
              className="flex-shrink-0 flex items-center gap-1.5"
              style={{
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 12,
                paddingRight: 14,
                borderRadius: 50,
                backgroundColor: isActive ? color : 'rgba(255,255,255,0.95)',
                color: isActive ? 'white' : '#3a4840',
                border: `1.5px solid ${isActive ? color : 'rgba(0,0,0,0.07)'}`,
                fontWeight: isActive ? 600 : 400,
                boxShadow: isActive
                  ? `0 4px 16px ${color}44`
                  : '0 2px 8px rgba(0,0,0,0.08)',
              }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span style={{ fontSize: 15 }}>{emoji}</span>
              <span style={{ fontSize: 13 }}>{CATEGORY_LABELS[cat] ?? cat}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
