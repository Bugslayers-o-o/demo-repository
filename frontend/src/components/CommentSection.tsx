import { Comment, UserRole } from '../types';
import { FormEvent, useState } from 'react';
import { commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

const roleBadges: Record<UserRole, { color: string; label: string }> = {
  user: { color: 'bg-gray-100 text-gray-800', label: 'User' },
  doctor: { color: 'bg-blue-100 text-blue-800', label: 'Doctor' },
  therapist: { color: 'bg-purple-100 text-purple-800', label: 'Therapist' },
  psychiatrist: { color: 'bg-indigo-100 text-indigo-800', label: 'Psychiatrist' },
};

export default function CommentSection({
  postId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();

  const canComment =
    userRole && ['doctor', 'therapist', 'psychiatrist'].includes(userRole);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !canComment) return;

    setLoading(true);
    try {
      await commentsAPI.addComment(postId, newComment);
      setNewComment('');
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (comments.length === 0 && !canComment) {
    return null;
  }

  return (
    <div className="mt-4">
      {comments.length > 0 && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          {showComments ? '▼' : '▶'} {comments.length} comment
          {comments.length !== 1 ? 's' : ''}
        </button>
      )}

      {showComments && comments.length > 0 && (
        <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Professional
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    roleBadges[comment.authorRole].color
                  }`}
                >
                  {roleBadges[comment.authorRole].label}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {canComment && (
        <form onSubmit={handleAddComment} className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a professional comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Posting...' : 'Reply'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
