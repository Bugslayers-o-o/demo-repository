import { motion } from "motion/react";
import { UserCheck, Star, MessageSquare, Calendar } from "lucide-react";
import { Therapist } from "@/src/types";

const therapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    specialty: "Anxiety & Depression Specialist",
    bio: "Helping individuals find balance and resilience through cognitive behavioral therapy.",
    image: "https://picsum.photos/seed/doc1/400/400"
  },
  {
    id: "2",
    name: "Dr. James Wilson",
    specialty: "Relationship Counselor",
    bio: "Focused on improving communication and building stronger emotional connections.",
    image: "https://picsum.photos/seed/doc2/400/400"
  },
  {
    id: "3",
    name: "Dr. Elena Rodriguez",
    specialty: "Trauma & PTSD Expert",
    bio: "Specializing in somatic experiencing and mindfulness-based stress reduction.",
    image: "https://picsum.photos/seed/doc3/400/400"
  }
];

export default function Professionals() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="font-serif text-4xl text-[#5A5A40]">Professional Support</h1>
          <p className="text-[#5A5A40]/60 italic">Connect with experts who care.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {therapists.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all"
            >
              <img
                src={doc.image}
                alt={doc.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover"
              />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-serif text-xl text-[#5A5A40]">{doc.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-600">{doc.specialty}</p>
                </div>
                <p className="text-sm text-[#5A5A40]/60 leading-relaxed">{doc.bio}</p>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-[#5A5A40] text-white py-2.5 rounded-2xl text-sm font-medium hover:bg-[#4A4A30] transition-all flex items-center justify-center gap-2">
                    <Calendar size={16} /> Book
                  </button>
                  <button className="flex-1 bg-[#f5f5f0] text-[#5A5A40] py-2.5 rounded-2xl text-sm font-medium hover:bg-[#e5e5e0] transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Chat
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergency Card */}
        <section className="bg-red-50 border border-red-100 p-8 rounded-[40px] text-center space-y-4">
          <h2 className="font-serif text-2xl text-red-800">Need Immediate Help?</h2>
          <p className="text-red-700/70 max-w-lg mx-auto">
            If you are in immediate danger or experiencing a crisis, please contact your local emergency services or a crisis hotline.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all">
              Call Hotline
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
