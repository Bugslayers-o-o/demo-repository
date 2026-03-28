import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { FC, useState } from 'react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatMessage: FC<Props> = ({ role, content, timestamp }) => {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`relative max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          isUser
            ? 'bg-[var(--ms-teal)] text-[#0A0E1A]'
            : 'bg-[var(--ms-surface-2)] text-[var(--ms-text)] border border-[var(--ms-border)]'
        }`}
      >
        {!isUser && (
          <div className="absolute -left-8 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--ms-teal)] to-[var(--ms-violet)] grid place-items-center text-xs font-bold text-[#0A0E1A]">
            S
          </div>
        )}
        <div>{content}</div>
        <div className="mt-1 text-[11px] text-[var(--ms-text-muted)]">{timestamp}</div>
        <button
          onClick={copyText}
          className="absolute -right-8 top-1 text-[var(--ms-text-muted)] hover:text-[var(--ms-teal)]"
        >
          <Copy className="w-4 h-4" />
        </button>
        {copied && (
          <div className="absolute -right-12 top-6 text-[10px] text-[var(--ms-teal)]">Copied</div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
