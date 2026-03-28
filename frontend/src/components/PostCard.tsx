import { useEffect, useMemo, useState } from 'react';
import { Shield, HeartPulse } from 'lucide-react';
import ReactionBar from './ReactionBar';
import CommentSection from './CommentSection';
import { commentsAPI } from '../services/api';
import { Comment, MoodTag, Post } from '../types';

interface PostCardProps {
  post: Post;
  onReactionChange?: () => void;
  onCommentAdded?: () => void;
}

const moodLabels: Record<MoodTag, string> = {
  sad: 'Sad',
  anxious: 'Anxious',
  frustrated: 'Frustrated',
  numb: 'Numb',
  hopeful: 'Hopeful',
};

const roleBadges: Record<string, string> = {
  user: 'bg-[rgba(255,255,255,0.04)] text-[var(--ms-text-muted)]',
  doctor: 'bg-[rgba(59,130,246,0.12)] text-blue-200',
  therapist: 'bg-[rgba(139,92,246,0.12)] text-purple-200',
  psychiatrist: 'bg-[rgba(244,114,182,0.12)] text-pink-200',
};

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PostCard({ post, onReactionChange, onCommentAdded }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState('');

  const avatarLetter = useMemo(() => {
    const base = post.alias || 'Anonymous';
    return base.charAt(0).toUpperCase();
  }, [post.alias]);

  const distressTone = useMemo(() => {
    if (!post.distress) return '';
    const palette = {
      low: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30',
      medium: 'text-amber-200 bg-amber-400/10 border-amber-300/40',
      high: 'text-orange-200 bg-orange-500/10 border-orange-400/40',
      critical: 'text-rose-200 bg-rose-500/10 border-rose-400/50',
    } as const;
    return palette[post.distress.level] || palette.low;
  }, [post.distress]);

  const loadComments = async () => {
    setLoadingComments(true);
    setCommentError('');
    try {
      const res = await commentsAPI.getComments(post.id);
      setComments(res.data as Comment[]);
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Could not load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setCommentsOpen(false);
    setCommentError('');
  }, [post.id]);

  useEffect(() => {
    if (commentsOpen) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsOpen, post.id]);

  const handleCommentAdded = () => {
    loadComments();
    onCommentAdded?.();
  };

  const images = post.imageUrls || [];
  const visibleImages = images.slice(0, 4);
  const extraImages = images.length - visibleImages.length;

  return (
    <div className="glass-card p-5 space-y-4 border border-[var(--ms-border)]">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full avatar-circle flex items-center justify-center font-semibold text-[#0A0E1A]">
          {avatarLetter}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[var(--ms-text)] text-sm">
              {post.alias || 'Anonymous Sathi'}
            </span>
            <span
              className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-[0.08em] border border-transparent ${
                roleBadges[post.userRole] || roleBadges.user
              }`}
            >
              {post.userRole}
            </span>
            {post.moodTag && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-[rgba(45,212,191,0.12)] border border-[var(--ms-border)] text-[var(--ms-teal)]">
                {moodLabels[post.moodTag]}
              </span>
            )}
            {post.distress && (
              <span
                className={`text-[10px] px-2 py-1 rounded-full border inline-flex items-center gap-1 ${distressTone}`}
              >
                <HeartPulse className="w-3 h-3" />
                {post.distress.level.toUpperCase()} - {post.distress.score}
              </span>
            )}
          </div>
          <div className="text-[12px] text-[var(--ms-text-muted)] flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Safe & anonymous</span>
            <span className="text-[var(--ms-text-dim)]">-</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="text-[var(--ms-text)] leading-relaxed whitespace-pre-line">{post.content}</div>

      {images.length > 0 && (
        <div className={`grid gap-2 ${visibleImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {visibleImages.map((url, idx) => {
            const isLast = idx === visibleImages.length - 1 && extraImages > 0;
            return (
              <div
                key={url}
                className="relative overflow-hidden rounded-xl border border-[var(--ms-border)] bg-[rgba(255,255,255,0.02)]"
              >
                <img src={url} alt="Post attachment" className="w-full h-56 object-cover" loading="lazy" />
                {isLast && (
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)] text-white font-semibold text-lg grid place-items-center">
                    +{extraImages} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ReactionBar
        post={post}
        onReactionChange={onReactionChange}
        onCommentsClick={() => setCommentsOpen((prev) => !prev)}
      />

      {commentsOpen && (
        <div className="pt-3 border-t border-[var(--ms-border)] space-y-3">
          {commentError && (
            <div className="text-[var(--ms-rose)] text-sm bg-[rgba(244,114,182,0.1)] border border-[var(--ms-rose)]/50 rounded-lg px-3 py-2">
              {commentError}
            </div>
          )}
          {loadingComments ? (
            <div className="text-sm text-[var(--ms-text-muted)]">Loading comments...</div>
          ) : (
            <CommentSection postId={post.id} comments={comments} onCommentAdded={handleCommentAdded} />
          )}
        </div>
      )}
    </div>
  );
}
