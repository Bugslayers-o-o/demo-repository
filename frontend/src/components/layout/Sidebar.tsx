import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  UserCircle,
  Brain,
  HeartPulse,
  Stethoscope,
  BookOpen,
  Settings,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Home Feed', icon: Home, href: '/feed' },
  { label: 'Explore', icon: Compass, href: '/explore' },
  { label: 'My Profile', icon: UserCircle, href: '/profile' },
  { label: 'Therapy', icon: Brain, href: '/therapy' },
  { label: 'Wellness', icon: HeartPulse, href: '/wellness' },
  { label: 'Find Professionals', icon: Stethoscope, href: '/professionals' },
  { label: 'Resources', icon: BookOpen, href: '/resources' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const moodEmojis = [
  { emoji: '😢', key: 'sad' },
  { emoji: '😰', key: 'anxious' },
  { emoji: '😐', key: 'neutral' },
  { emoji: '🙂', key: 'ok' },
  { emoji: '😄', key: 'happy' },
];

export default function Sidebar() {
  const { currentUser, userRole } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const alias = useMemo(
    () =>
      (currentUser as any)?.alias ||
      currentUser?.displayName ||
      currentUser?.email?.split('@')[0] ||
      'Mind Friend',
    [currentUser]
  );

  const handleMood = async (mood: string) => {
    setSelectedMood(mood);
    if (!currentUser) return;
    try {
      const moodRef = doc(db, 'users', currentUser.uid, 'moods', 'latest');
      await setDoc(moodRef, { mood, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Mood save failed', err);
    }
  };

  return (
    <aside className="hidden lg:block">
      <div className="flex flex-col h-full space-y-4 pt-4 pb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full avatar-circle grid place-items-center text-lg font-semibold">
              {alias.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-white">{alias}</div>
              <div className="flex items-center gap-2 text-xs text-[var(--ms-text-muted)]">
                <span className="px-2 py-0.5 rounded-full bg-[rgba(45,212,191,0.15)] text-[var(--ms-teal)] border border-[var(--ms-border)]">
                  {userRole || 'user'}
                </span>
                <span>Your safe space 🌿</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.href);
            return (
              <motion.button
                key={item.label}
                whileHover={{ x: 6 }}
                onClick={() => navigate(item.href)}
                className={`group w-full flex items-center gap-3 px-3 h-12 rounded-xl text-sm font-medium transition relative overflow-hidden ${
                  active
                    ? 'bg-[rgba(45,212,191,0.12)] text-[var(--ms-teal)] shadow-[0_10px_30px_rgba(45,212,191,0.15)]'
                    : 'text-[var(--ms-text-muted)] hover:bg-[var(--ms-surface)]'
                }`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-[var(--ms-teal)] transition-transform ${
                    active ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                  }`}
                />
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">How are you today?</div>
              <div className="text-xs text-[var(--ms-text-muted)]">🔥 3 day streak</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {moodEmojis.map((m) => (
              <button
                key={m.key}
                onClick={() => handleMood(m.emoji)}
                className={`w-11 h-11 rounded-full grid place-items-center text-xl transition transform ${
                  selectedMood === m.emoji
                    ? 'ring-2 ring-[var(--ms-teal)] scale-110 bg-[rgba(45,212,191,0.12)]'
                    : 'bg-[rgba(255,255,255,0.04)] hover:scale-105'
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card border border-[var(--ms-rose)] p-4 relative overflow-hidden mt-auto">
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.08),transparent_60%)] pointer-events-none" />
          <div className="relative space-y-2">
            <div className="text-sm font-semibold text-[var(--ms-rose)]">Need immediate help? 💙</div>
            <p className="text-xs text-[var(--ms-text-muted)]">
              You matter. Reach out to a professional helpline now.
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--ms-rose)] text-[var(--ms-rose)] hover:bg-[rgba(244,114,182,0.12)]">
              📞 Lifeline Nepal: 16000
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
