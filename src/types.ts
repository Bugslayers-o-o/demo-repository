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
