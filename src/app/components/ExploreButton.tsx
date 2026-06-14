import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

interface Props {
  count: number;
  onTap: () => void;
}

export function ExploreButton({ count, onTap }: Props) {
  return (
    <div
      className="absolute left-0 right-0 z-20 flex justify-center"
      style={{ bottom: 36 }}
    >
      <motion.button
        onClick={onTap}
        className="flex items-center gap-2.5"
        style={{
          backgroundColor: '#1a2e25',
          color: 'white',
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 22,
          paddingRight: 26,
          borderRadius: 50,
          boxShadow: '0 8px 36px rgba(26,46,37,0.42)',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.01em',
        }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
      >
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
