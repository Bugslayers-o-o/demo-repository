import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Users, UserCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl text-[#5A5A40] leading-tight">
              Your Journey to <br />
              <span className="italic">Inner Peace</span> Starts Here.
            </h1>
            <p className="text-lg text-[#5A5A40]/70 max-w-xl mx-auto mt-6">
              MindSathi is a safe space for emotional expression, community support, and professional guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/therapy"
              className="bg-[#5A5A40] text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
            >
              Start Sharing <ArrowRight size={18} />
            </Link>
            <Link
              to="/chat"
              className="bg-white text-[#5A5A40] border border-[#5A5A40]/20 px-8 py-4 rounded-full flex items-center gap-2 hover:bg-[#5A5A40]/5 transition-all"
            >
              Talk to AI Sathi
            </Link>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Community Therapy",
              desc: "Share your feelings anonymously and receive support from a compassionate community.",
              icon: Users,
              color: "bg-orange-100",
              link: "/therapy"
            },
            {
              title: "AI Sathi",
              desc: "Instant emotional support and coping strategies powered by intelligent AI.",
              icon: Sparkles,
              color: "bg-blue-100",
              link: "/chat"
            },
            {
              title: "Professional Care",
              desc: "Connect with certified therapists and counselors for personalized support.",
              icon: UserCheck,
              color: "bg-green-100",
              link: "/professionals"
            },
            {
              title: "Wellness Hub",
              desc: "Curated meditation, yoga, and music to help you find your calm.",
              icon: Heart,
              color: "bg-pink-100",
              link: "/wellness"
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * i }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-[#5A5A40]/5 hover:shadow-md transition-all group"
            >
              <div className={`${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-[#5A5A40]`}>
                <feature.icon size={24} />
              </div>
              <h3 className="font-serif text-2xl text-[#5A5A40] mb-2">{feature.title}</h3>
              <p className="text-[#5A5A40]/60 mb-6">{feature.desc}</p>
              <Link to={feature.link} className="text-[#5A5A40] font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Truth Gap Intro */}
        <section className="bg-[#5A5A40] text-white p-12 rounded-[48px] relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-lg">
            <h2 className="font-serif text-4xl italic">The Truth Gap</h2>
            <p className="text-white/80">
              Our intelligent system helps detect mismatches between your expressed emotions and underlying patterns, ensuring you get the right support at the right time.
            </p>
            <button className="bg-white text-[#5A5A40] px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-all">
              Learn More
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </section>
      </div>
    </div>
  );
}
