import { Link, useLocation } from "react-router-dom";
import { Heart, MessageSquare, Users, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Heart },
  { path: "/therapy", label: "Therapy", icon: Users },
  { path: "/chat", label: "AI Sathi", icon: Sparkles },
  { path: "/professionals", label: "Experts", icon: UserCheck },
  { path: "/wellness", label: "Wellness", icon: MessageSquare },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#5A5A40]/20 px-4 py-2 md:top-0 md:bottom-auto md:border-t-0 md:border-b z-50">
      <div className="max-w-7xl mx-auto flex justify-around md:justify-between items-center">
        <Link to="/" className="hidden md:flex items-center gap-2 font-serif text-2xl text-[#5A5A40]">
          <Heart className="fill-[#5A5A40]" />
          <span>MindSathi</span>
        </Link>
        
        <div className="flex gap-1 md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 rounded-xl transition-all",
                  isActive 
                    ? "text-[#5A5A40] bg-[#5A5A40]/10" 
                    : "text-[#5A5A40]/60 hover:text-[#5A5A40] hover:bg-[#5A5A40]/5"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] md:text-sm font-medium uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
