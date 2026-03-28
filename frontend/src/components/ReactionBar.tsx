import { Post, ReactionType } from '../types';
import { Heart, MessageCircle, Sparkles, Repeat2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { reactionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReactionBarProps {
  post: Post;
  onReactionChange?: () => void;
  onCommentsClick?: () => void;
}

export default function ReactionBar({ post, onReactionChange, onCommentsClick }: ReactionBarProps) {
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();

  const handleReaction = async (type: ReactionType) => {
    setLoading(true);
    try {
      if (post.userReaction === type) {
        await reactionsAPI.removeReaction(post.id);
      } else {
        await reactionsAPI.addReaction(post.id, type);
      }
      onReactionChange?.();
    } catch (error) {
      console.error('Reaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reactions: { type: ReactionType; icon: ReactNode; label: string; color: string }[] = [
    {
      type: 'support',
      icon: <Heart className="w-5 h-5" />,
      label: 'Support',
      color: 'text-[var(--ms-rose)]',
    },
    {
      type: 'relate',
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Relate',
      color: 'text-[var(--ms-amber)]',
    },
    {
      type: 'care',
      icon: <Heart className="w-5 h-5" />,
      label: 'Care',
      color: 'text-[var(--ms-teal)]',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 pt-4 border-t border-[var(--ms-border)]">
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => handleReaction(reaction.type)}
          disabled={loading}
          className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition border border-transparent active:scale-95 ${
            post.userReaction === reaction.type
              ? `${reaction.color} bg-[rgba(255,255,255,0.05)] border-[var(--ms-border)]`
              : 'text-[var(--ms-text-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--ms-border)]'
          }`}
        >
          {reaction.icon}
          <span className="text-[11px] font-medium">{reaction.label}</span>
          <span className="text-[10px] text-[var(--ms-text-muted)]">
            {post.reactionCounts[reaction.type]}
          </span>
        </button>
      ))}

      <button
        className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[var(--ms-text-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--ms-border)] border border-transparent"
        onClick={() => console.log('Repost', post.id)}
      >
        <Repeat2 className="w-5 h-5" />
        <span className="text-[11px] font-medium">Repost</span>
      </button>

      <button
        className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[var(--ms-text-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--ms-border)] border border-transparent"
        onClick={onCommentsClick}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[11px] font-medium">Comments</span>
        <span className="text-[10px] text-[var(--ms-text-muted)]">{post.commentCount}</span>
      </button>
    </div>
  );
}
