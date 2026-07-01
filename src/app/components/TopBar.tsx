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
        paddingBottom: 14,
        background:
          'linear-gradient(to bottom, rgba(240,237,229,0.97) 0%, rgba(240,237,229,0.75) 75%, transparent 100%)',
        backdropFilter: 'blur(2px)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Menu */}
      <motion.button
        onClick={onMenuOpen}
        className="flex items-center justify-center"
        style={{
          width: 42, height: 42,
          backgroundColor: 'white',
          borderRadius: 14,
          boxShadow: '0 2px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
        whileTap={{ scale: 0.88 }}
        whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,0.14)' }}
      >
        <Menu size={18} color="#2d4038" strokeWidth={2} />
      </motion.button>

      {/* Logo */}
      <motion.div
        className="flex flex-col items-center"
        style={{ gap: 1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span style={{
          fontSize: 9,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: '#4a7c59',
          fontWeight: 700,
        }}>
          Descubre
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26,
          color: '#1a2e25',
          letterSpacing: '0.08em',
          lineHeight: 1,
        }}>
          Moraleja
        </span>
      </motion.div>

      {/* Search */}
      <motion.button
        onClick={onSearchOpen}
        className="flex items-center justify-center"
        style={{
          width: 42, height: 42,
          backgroundColor: 'white',
          borderRadius: 14,
          boxShadow: '0 2px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
        whileTap={{ scale: 0.88 }}
        whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,0.14)' }}
      >
        <Search size={18} color="#2d4038" strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}
