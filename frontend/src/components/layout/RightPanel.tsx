import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, Hash, HeartPulse, MessageCircle, PhoneCall } from 'lucide-react';
import { collection, getDocs, limit, query, where, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface RightPanelProps {
  onOpenChat?: () => void;
}

const trendingTopics = ['#Anxiety', '#Sleep', '#Healing', '#Relationships', '#Grief'];
const tips = [
  'Take 3 slow breaths: inhale 4s, hold 4s, exhale 6s.',
  'Step outside for 2 minutes and notice five things you can see.',
  'Write down one thing you are grateful for today.',
  'Drink a glass of water and stretch your shoulders.',
  'Silence notifications for 20 minutes and rest.',
  'Message a friend: "Thinking of you today."',
  'Name the feeling you are having; it often softens it.',
];

export default function RightPanel({ onOpenChat }: RightPanelProps) {
  const { currentUser } = useAuth();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [pros, setPros] = useState<Array<{ alias: string; role: string }>>([]);

  useEffect(() => {
    const fetchMood = async () => {
      if (!currentUser) return;
      try {
        const snap = await getDocs(query(collection(db, 'users', currentUser.uid, 'moods'), limit(1)));
        const latest = snap.docs[0]?.data() as DocumentData | undefined;
        setTodayMood(latest?.mood || null);
      } catch {
        setTodayMood(null);
      }
    };
    fetchMood();
  }, [currentUser]);

  useEffect(() => {
    const loadPros = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '!=', 'user'), limit(4));
        const res = await getDocs(q);
        const data = res.docs.map((d) => {
          const payload = d.data();
          return {
            alias: payload.alias || payload.email?.split('@')[0] || 'Pro',
            role: payload.role || 'therapist',
          };
        });
        setPros(data);
      } catch {
        setPros([
          { alias: 'Dr. Maya', role: 'psychiatrist' },
          { alias: 'Anil', role: 'therapist' },
          { alias: 'Rhea', role: 'doctor' },
        ]);
      }
    };
    loadPros();
  }, []);

  const dailyTip = useMemo(() => tips[new Date().getDay() % tips.length], []);

  return (
    <aside className="hidden xl:block space-y-4 pt-4 pb-6">
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="w-4 h-4 text-[var(--ms-teal)]" />
            Today&apos;s Mood
          </div>
          <div className="text-sm text-[var(--ms-text-muted)]">
            {todayMood ? `Feeling ${todayMood} today` : 'Check in your mood ->'}
          </div>
        </div>
        <button className="text-xs px-3 py-1 rounded-full border border-[var(--ms-border)] hover:border-[var(--ms-teal)]">
          Edit
        </button>
      </div>

      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Bot className="w-4 h-4 text-[var(--ms-teal)]" />
          Sathi
          <span className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="text-sm text-[var(--ms-text-muted)]">Hi! How are you feeling today?</div>
        <button
          onClick={() => onOpenChat?.()}
          className="inline-flex items-center gap-2 text-sm text-[var(--ms-teal)] hover:text-white"
        >
          Start chatting
        </button>
      </div>

      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <HeartPulse className="w-4 h-4 text-[var(--ms-violet)]" />
          Online Professionals
        </div>
        <div className="space-y-2">
          {pros.map((p, idx) => (
            <div key={`${p.alias}-${idx}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full avatar-circle grid place-items-center text-sm font-semibold">
                {p.alias.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.alias}</div>
                <div className="text-xs text-[var(--ms-text-muted)] capitalize">{p.role}</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          ))}
        </div>
        <button className="text-xs text-[var(--ms-teal)] hover:text-white">View all</button>
      </div>

      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Hash className="w-4 h-4 text-[var(--ms-teal)]" />
          Trending in MindSathi
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 rounded-full bg-[rgba(45,212,191,0.12)] border border-[var(--ms-border)] text-xs hover:shadow-[0_6px_18px_rgba(45,212,191,0.2)]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 border-l-4 border-[var(--ms-teal)] space-y-1">
        <div className="text-sm font-semibold">Today&apos;s Tip</div>
        <p className="text-sm text-[var(--ms-text-muted)]">{dailyTip}</p>
      </div>

      <div className="glass-card p-4 border border-[var(--ms-rose)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.12),transparent_45%)] pointer-events-none" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-2 text-[var(--ms-rose)] font-semibold">
            <PhoneCall className="w-4 h-4" />
            Crisis Support
          </div>
          <p className="text-sm text-[var(--ms-text-muted)]">Need to talk to someone right now?</p>
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--ms-rose)] text-[#0A0E1A] font-semibold hover:opacity-90">
            <MessageCircle className="w-4 h-4" />
            Call a Helpline
          </button>
        </div>
      </div>
    </aside>
  );
}
