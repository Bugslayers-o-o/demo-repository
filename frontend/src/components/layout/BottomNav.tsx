import { Compass, HeartPulse, Home, Plus, UserCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
  onCreatePost?: () => void;
}

export default function BottomNav({ onCreatePost }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Home', icon: Home, path: '/feed' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Professionals', icon: HeartPulse, path: '/professionals' },
    { label: 'Profile', icon: UserCircle, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40">
      <div className="mx-auto w-full bg-[var(--ms-surface)] border-t border-[var(--ms-border)] px-4 py-2">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center justify-between w-full px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              return (
                <button
                  key={tab.label}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center gap-1 py-1 text-[11px] ${
                    active ? 'text-[var(--ms-teal)]' : 'text-[var(--ms-text-muted)]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onCreatePost}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-5 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--ms-teal)] to-[var(--ms-violet)] text-[#0A0E1A] grid place-items-center shadow-lg shadow-[rgba(45,212,191,0.35)] border border-[var(--ms-border)]"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
