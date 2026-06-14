import { Menu, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
}

export function TopBar({ onMenuOpen, onSearchOpen }: Props) {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4"
      style={{
        paddingTop: 52,
        paddingBottom: 16,
        background:
          'linear-gradient(to bottom, rgba(240,237,229,0.96) 0%, rgba(240,237,229,0.7) 70%, transparent 100%)',
      }}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Menu */}
      <motion.button
        onClick={onMenuOpen}
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 42,
          height: 42,
          backgroundColor: 'white',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={18} color="#2d4038" strokeWidth={2} />
      </motion.button>

      {/* Logo */}
      <div className="flex flex-col items-center" style={{ gap: 1 }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#4a7c59',
            fontWeight: 600,
          }}
        >
          Descubre
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#1a2e25',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          Moraleja
        </span>
      </div>

      {/* Search */}
      <motion.button
        onClick={onSearchOpen}
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 42,
          height: 42,
          backgroundColor: 'white',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Search size={18} color="#2d4038" strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}
