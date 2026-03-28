// Auth Types
export type UserRole = 'user' | 'doctor' | 'therapist' | 'psychiatrist';

export type ReactionType = 'support' | 'relate' | 'care';

export type MoodTag = 'sad' | 'anxious' | 'frustrated' | 'numb' | 'hopeful';

export interface DistressResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

// MindSathi Post & Feed Types
export interface Post {
  id: string;
  content: string;
  userId: string;
  userRole: UserRole;
  alias?: string;
  createdAt: string;
  distress?: DistressResult;
  moodTag?: MoodTag;
  imageUrls?: string[];
  reactionCounts: {
    support: number;
    relate: number;
    care: number;
  };
  userReaction?: ReactionType;
  commentCount: number;
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorRole: UserRole;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Legacy Types
export interface TruthGapResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  insight: string;
  suggestedAction: string;
}

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
}

export interface WellnessContent {
  id: string;
  title: string;
  type: 'Yoga' | 'Meditation' | 'Music';
  duration: string;
  thumbnail: string;
}
