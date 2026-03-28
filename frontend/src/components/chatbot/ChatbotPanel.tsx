import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import api from '../../services/api';

const quickReplies = ['😔 Sad', '😰 Anxious', '😤 Frustrated', '🌱 Hopeful'];

interface PanelProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatbotPanel({ open, onClose }: PanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi 💙 I'm Sathi. How are you feeling right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post('/chat', { message: text, history });
      const botMsg: Message = {
        role: 'assistant',
        content: res.data.reply || "I'm here with you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      const botMsg: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting. Try again? 💙",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] z-50"
        >
          <div className="glass-card h-full border border-[var(--ms-teal)] shadow-[0_0_30px_rgba(45,212,191,0.25)] flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--ms-border)] flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">Sathi 🌿</div>
                <div className="text-xs text-[var(--ms-text-muted)]">Your Mind Friend</div>
                <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Here for you
                </div>
              </div>
              <button onClick={onClose} className="text-[var(--ms-text-muted)] hover:text-[var(--ms-teal)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {messages.map((m, idx) => (
                <ChatMessage key={idx} role={m.role} content={m.content} timestamp={m.timestamp} />
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickReplies.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1 rounded-full border border-[var(--ms-border)] bg-[rgba(255,255,255,0.05)] text-xs hover:border-[var(--ms-teal)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-[var(--ms-text-muted)] px-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--ms-text-muted)] rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-[var(--ms-text-muted)] rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-[var(--ms-text-muted)] rounded-full animate-bounce delay-200" />
                  </div>
                  Sathi is typing...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-[var(--ms-border)] flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type a message"
                className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[var(--ms-border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--ms-teal)] outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                className="p-2 rounded-lg bg-[var(--ms-teal)] text-[#0A0E1A] hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
