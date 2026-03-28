import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, MessageCircle, Heart } from "lucide-react";

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export default function Therapy() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Anonymous Friend",
      content: "Feeling a bit overwhelmed with work lately. How do you all manage stress?",
      timestamp: "2h ago",
      likes: 12
    },
    {
      id: "2",
      author: "Kind Soul",
      content: "Just finished a 10-minute meditation. It really helps clear the mind. Highly recommend it!",
      timestamp: "4h ago",
      likes: 24
    }
  ]);

  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: "Anonymous Me",
      content: newPost,
      timestamp: "Just now",
      likes: 0
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-24 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="font-serif text-4xl text-[#5A5A40]">Community Support</h1>
          <p className="text-[#5A5A40]/60 italic">Share your heart, find your strength.</p>
        </header>

        {/* Post Input */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/10 space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full min-h-[120px] p-4 rounded-2xl bg-[#f5f5f0]/50 border-none focus:ring-2 focus:ring-[#5A5A40]/20 resize-none text-[#5A5A40]"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#5A5A40]/40 italic">Posts are anonymous by default.</p>
            <button
              onClick={handlePost}
              className="bg-[#5A5A40] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-[#4A4A30] transition-all"
            >
              Share <Send size={16} />
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/5 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#5A5A40]">
                    <div className="w-8 h-8 rounded-full bg-[#5A5A40]/10 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-sm">{post.author}</span>
                  </div>
                  <span className="text-xs text-[#5A5A40]/40">{post.timestamp}</span>
                </div>
                
                <p className="text-[#5A5A40]/80 leading-relaxed">{post.content}</p>
                
                <div className="flex gap-4 pt-2">
                  <button className="flex items-center gap-1.5 text-xs text-[#5A5A40]/60 hover:text-[#5A5A40] transition-colors">
                    <Heart size={14} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#5A5A40]/60 hover:text-[#5A5A40] transition-colors">
                    <MessageCircle size={14} /> Reply
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
