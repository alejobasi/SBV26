import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

interface Props {
  count: number;
  onTap: () => void;
}

export function ExploreButton({ count, onTap }: Props) {
  return (
    <div className="absolute left-0 right-0 z-20 flex justify-center" style={{ bottom: 36 }}>
      {/* Glow ring */}
      <motion.div
        style={{
          position: 'absolute',
          borderRadius: 50,
          background: 'rgba(74,124,89,0.25)',
          filter: 'blur(14px)',
          inset: '-6px 10px',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.04, 0.97] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.button
        onClick={onTap}
        className="relative flex items-center gap-2.5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a2e25 0%, #2d4a38 100%)',
          color: 'white',
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 22,
          paddingRight: 28,
          borderRadius: 50,
          boxShadow: '0 10px 40px rgba(26,46,37,0.48), 0 2px 8px rgba(0,0,0,0.2)',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.01em',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ opacity: 0, y: 24, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
      >
        {/* Shimmer sweep */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0, bottom: 0, width: 60,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            borderRadius: 50,
            pointerEvents: 'none',
          }}
          animate={{ left: ['-20%', '120%'] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        />

        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, backgroundColor: '#4a7c59' }}
        >
          <Compass size={15} color="white" />
        </div>
        <span>
          Explorar{' '}
          <span style={{ color: '#7cc898' }}>{count}</span>{' '}
          {count === 1 ? 'lugar' : 'lugares'}
        </span>
      </motion.button>
    </div>
  );
}
