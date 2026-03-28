import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface Props {
  onClick: () => void;
  hasUnread?: boolean;
}

const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 0.2, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function ChatbotFAB({ onClick, hasUnread }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <motion.div
        className="absolute inset-0 rounded-full bg-[rgba(45,212,191,0.25)] blur-lg pointer-events-none"
        {...pulseRing}
      />

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(45,212,191,0.5)' }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl"
        style={{ background: 'linear-gradient(135deg, #2DD4BF, #8B5CF6)' }}
      >
        <MessageCircle className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-md" />
        )}

        <div className="pointer-events-none absolute left-full ml-3 px-3 py-2 rounded-lg bg-[rgba(17,24,39,0.9)] text-xs text-white border border-[var(--ms-border)] opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Chat with Sathi 🌿
        </div>
      </motion.button>
    </div>
  );
}
