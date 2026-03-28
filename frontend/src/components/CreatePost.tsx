import { FormEvent, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import { Heart, Shield, Sparkles, Camera, X } from 'lucide-react';
import { storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, userRole } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const moodOptions = [
    { key: 'sad', emoji: '😔', label: 'Sad' },
    { key: 'anxious', emoji: '😰', label: 'Anxious' },
    { key: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { key: 'numb', emoji: '😶', label: 'Numb' },
    { key: 'hopeful', emoji: '🌱', label: 'Hopeful' },
  ];

  const canSubmit = content.trim().length > 0 && content.length <= 1000;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!currentUser) {
      setError('Please log in to post.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload images if any
      const imageUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const filePath = `posts/${currentUser.uid}/${Date.now()}-${file.name}`;
          const storageRef = ref(storage, filePath);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }
      }

      await postsAPI.createPost(content, moodTag, imageUrls);
      setContent('');
      setMoodTag(undefined);
      setFiles([]);
      setPreviews([]);
      onPostCreated?.();
    } catch (err) {
      const message =
        err instanceof Error && err.message.toLowerCase().includes('network')
          ? 'Network error – please check your connection or API server.'
          : err instanceof Error
            ? err.message
            : 'Failed to create post';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      {error && (
        <div className="bg-[rgba(255,107,157,0.12)] border border-[var(--color-accent-rose)] text-[var(--color-text-primary)] px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[rgba(78,205,196,0.15)] border border-[var(--color-border-subtle)] flex items-center justify-center">
              <Heart className="w-6 h-6 text-[var(--color-accent-teal)]" fill="currentColor" />
            </div>
          </div>

          <div className="flex-grow space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              <Shield className="w-3.5 h-3.5" />
              <span>Anonymous by default</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How are you feeling today? This is a safe space."
              maxLength={1000}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--color-border-subtle)] focus:border-[var(--color-accent-teal)] focus:ring-2 focus:ring-[var(--color-accent-teal)]/30 outline-none resize-none placeholder:text-[var(--color-text-muted)]"
            />

            {/* Image upload */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  const incoming = Array.from(e.target.files || []);
                  const combined = [...files, ...incoming].slice(0, 4);
                  setFiles(combined);
                  setPreviews(combined.map((f) => URL.createObjectURL(f)));
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border-subtle)] hover:border-[var(--color-accent-teal)]/70 text-sm"
              >
                <Camera className="w-4 h-4" />
                Add photos (up to 4)
              </button>
              <span className="text-xs text-[var(--color-text-muted)]">
                JPG/PNG, up to 4 images
              </span>
            </div>

            {previews.length > 0 && (
              <div className="grid gap-2" style={{gridTemplateColumns: previews.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))'}}>
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.03)]">
                    <img src={src} alt={`upload-${idx}`} className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...files];
                        const newPreviews = [...previews];
                        newFiles.splice(idx, 1);
                        newPreviews.splice(idx, 1);
                        setFiles(newFiles);
                        setPreviews(newPreviews);
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.key}
                  type="button"
                  onClick={() => setMoodTag(mood.key)}
                  className={`px-3 py-2 rounded-lg border text-sm transition ${
                    moodTag === mood.key
                      ? 'border-[var(--color-accent-teal)] bg-[rgba(78,205,196,0.15)]'
                      : 'border-[var(--color-border-subtle)] hover:border-[var(--color-accent-teal)]/60'
                  }`}
                  title={mood.label}
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>

            <div className="mt-2 flex justify-between items-center text-sm text-[var(--color-text-muted)]">
              <span>{content.length}/1000</span>
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--color-accent-teal)] text-[#0D0F14] font-semibold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{loading ? 'Posting...' : 'Post'}</span>
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="absolute inset-0 shimmer opacity-60" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
