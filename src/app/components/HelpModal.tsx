import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LifeBuoy, Mail, Copy, Check, Send } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HELP_EMAIL = 'basilioalfonsoalejo@gmail.com';

export function HelpModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(HELP_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${HELP_EMAIL}?subject=${encodeURIComponent('Ayuda / Sugerencia · Fiestas San Buenaventura')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: 'rgba(10,20,14,0.55)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-1/2 z-[61] w-full"
            style={{ maxWidth: 380, top: '50%', paddingInline: 20 }}
            initial={{ opacity: 0, scale: 0.94, x: '-50%', y: '-46%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.94, x: '-50%', y: '-46%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            <div
              style={{
                background: 'linear-gradient(165deg, #ffffff 0%, #f4faf6 100%)',
                borderRadius: 28,
                boxShadow: '0 24px 64px rgba(20,60,40,0.3), 0 0 0 1px rgba(255,255,255,0.6)',
                overflow: 'hidden',
              }}
            >
              {/* Top accent */}
              <div style={{ height: 4, background: 'linear-gradient(90deg, #4a7c59, #6ee7b7, #4a7c59)' }} />

              <div style={{ padding: '22px 22px 24px' }}>
                {/* Header */}
                <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg, #4a7c5930, #4a7c5915)',
                        border: '1.5px solid #4a7c5940',
                      }}
                    >
                      <LifeBuoy size={18} color="#4a7c59" strokeWidth={2} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 17, fontWeight: 800, color: '#16281c', letterSpacing: '-0.01em' }}>
                        Ayuda y sugerencias
                      </h2>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="flex items-center justify-center"
                    style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: '#4a7c590d', border: '1px solid #4a7c5925', flexShrink: 0 }}
                    whileTap={{ scale: 0.88 }}
                  >
                    <X size={14} color="#4a7c59" strokeWidth={2.5} />
                  </motion.button>
                </div>

                <p style={{ fontSize: 12.5, color: '#5a6b62', lineHeight: 1.55, marginBottom: 18 }}>
                  ¿Falta una peña en el mapa? ¿Está en el lugar equivocado? ¿Tienes alguna sugerencia o
                  has encontrado un error? Escríbenos a este correo:
                </p>

                {/* Email row */}
                <div
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: 'white',
                    border: '1.5px solid #4a7c5930',
                    borderRadius: 16,
                    padding: '12px 10px 12px 14px',
                    marginBottom: 16,
                  }}
                >
                  <Mail size={15} color="#4a7c59" strokeWidth={2.2} style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: '#16281c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {HELP_EMAIL}
                  </span>
                  <motion.button
                    onClick={handleCopy}
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 34, height: 34, borderRadius: 11,
                      backgroundColor: copied ? '#4a7c59' : '#4a7c5914',
                      border: `1px solid ${copied ? '#4a7c59' : '#4a7c5925'}`,
                    }}
                    whileTap={{ scale: 0.88 }}
                  >
                    {copied ? (
                      <Check size={15} color="white" strokeWidth={2.5} />
                    ) : (
                      <Copy size={14} color="#4a7c59" strokeWidth={2.2} />
                    )}
                  </motion.button>
                </div>

                <motion.button
                  onClick={handleSendEmail}
                  className="flex items-center justify-center gap-2"
                  style={{
                    width: '100%',
                    paddingBlock: 12,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #4a7c59 0%, #4a7c59bb 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                    border: 'none',
                    boxShadow: '0 8px 24px #4a7c5945',
                  }}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ filter: 'brightness(1.08)' }}
                >
                  <Send size={15} strokeWidth={2.5} />
                  Enviar email
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
