import { motion } from "motion/react";
import { Play, Music, Wind, Sun } from "lucide-react";
import { WellnessContent } from "@/src/types";

const content: WellnessContent[] = [
  {
    id: "1",
    title: "Morning Flow Yoga",
    type: "Yoga",
    duration: "15 min",
    thumbnail: "https://picsum.photos/seed/yoga1/600/400"
  },
  {
    id: "2",
    title: "Deep Sleep Meditation",
    type: "Meditation",
    duration: "20 min",
    thumbnail: "https://picsum.photos/seed/med1/600/400"
  },
  {
    id: "3",
    title: "Focus & Clarity Beats",
    type: "Music",
    duration: "45 min",
    thumbnail: "https://picsum.photos/seed/music1/600/400"
  },
  {
    id: "4",
    title: "Stress Relief Breathing",
    type: "Meditation",
    duration: "5 min",
    thumbnail: "https://picsum.photos/seed/med2/600/400"
  }
];

export default function Wellness() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="font-serif text-4xl text-[#5A5A40]">Wellness Hub</h1>
          <p className="text-[#5A5A40]/60 italic">Nurture your body, calm your mind.</p>
        </header>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[
            { label: "All", icon: Sun },
            { label: "Meditation", icon: Wind },
            { label: "Yoga", icon: Play },
            { label: "Music", icon: Music }
          ].map((cat) => (
            <button
              key={cat.label}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-[#5A5A40]/10 text-[#5A5A40] font-medium hover:bg-[#5A5A40] hover:text-white transition-all whitespace-nowrap"
            >
              <cat.icon size={16} /> {cat.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-sm border border-[#5A5A40]/5">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-[#5A5A40] scale-90 group-hover:scale-100 transition-transform">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#5A5A40]">
                  {item.duration}
                </div>
              </div>
              <div className="mt-4 px-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">{item.type}</span>
                <h3 className="font-serif text-xl text-[#5A5A40] mt-1">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
