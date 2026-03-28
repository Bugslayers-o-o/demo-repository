import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { postsAPI } from '../services/api';
import { MoodTag, Post } from '../types';
import { useAuth } from '../context/AuthContext';

const moodEmoji: Record<MoodTag, string> = {
  sad: '😔',
  anxious: '😰',
  frustrated: '😤',
  numb: '😶',
  hopeful: '🌱',
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const loadPosts = async () => {
    try {
      const res = await postsAPI.getPosts();
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) loadPosts();
  }, [currentUser]);

  const stories = useMemo(() => {
    const withMood = posts
      .filter((p) => p.moodTag)
      .slice(0, 7)
      .map((p) => ({
        alias: p.alias || 'Sathi',
        mood: moodEmoji[p.moodTag as MoodTag] || '🙂',
      }));
    if (withMood.length > 0) return withMood;
    return [
      { alias: 'CalmRiver', mood: '🌱' },
      { alias: 'BrightSky', mood: '🙂' },
      { alias: 'QuietMeadow', mood: '😌' },
      { alias: 'GentleMoon', mood: '😴' },
    ];
  }, [posts]);

  return (
    <AppShell>
      <div className="max-w-[680px] w-full mx-auto space-y-4 pt-2">
        {/* Stories / mood row */}
        <div className="flex gap-3 overflow-x-auto pb-2 pr-1">
          <div className="min-w-[110px] h-[180px] glass-card rounded-2xl p-3 flex flex-col items-center justify-between bg-gradient-to-b from-[rgba(45,212,191,0.15)] to-[rgba(17,24,39,0.9)]">
            <div className="w-full h-[120px] rounded-xl border border-[var(--ms-border)] grid place-items-center">
              <Plus className="w-8 h-8 text-[var(--ms-teal)]" />
            </div>
            <div className="text-sm font-semibold">Share your mood</div>
          </div>
          {stories.map((story, idx) => (
            <motion.div
              key={`${story.alias}-${idx}`}
              whileHover={{ y: -4 }}
              className="min-w-[110px] h-[180px] glass-card rounded-2xl p-3 flex flex-col justify-between"
            >
              <div className="w-full h-[120px] rounded-xl border border-[var(--ms-border)] bg-[rgba(255,255,255,0.02)] grid place-items-center text-4xl">
                {story.mood}
              </div>
              <div className="text-sm font-semibold truncate">{story.alias}</div>
              <div className="text-xs text-[var(--ms-text-muted)]">Today&apos;s mood</div>
            </motion.div>
          ))}
        </div>

        {/* Create post box always visible */}
        <div id="ms-create-post">
          <CreatePost onPostCreated={loadPosts} />
        </div>

        {error && (
          <div className="glass-card px-4 py-3 text-[var(--ms-rose)] border border-[var(--ms-rose)]">{error}</div>
        )}

        {loading ? (
          <div className="glass-card px-4 py-6 text-[var(--ms-text-muted)]">Loading feed...</div>
        ) : (
          <AnimatePresence>
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.04 }}
                className="hover-lift"
              >
                <PostCard post={post} onReactionChange={loadPosts} onCommentAdded={loadPosts} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </AppShell>
  );
}
