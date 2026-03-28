import {
  Bell,
  BookOpen,
  Compass,
  Heart,
  Home,
  Search,
  Users,
  ChevronDown,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Home', icon: Home, path: '/feed' },
  { label: 'Explore', icon: Compass, path: '/explore' },
  { label: 'Community', icon: Users, path: '/community' },
  { label: 'Resources', icon: BookOpen, path: '/resources' },
  { label: 'Wellness', icon: Heart, path: '/wellness' },
];

export default function TopBar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const alias = useMemo(
    () =>
      (currentUser as any)?.alias ||
      currentUser?.displayName ||
      currentUser?.email?.split('@')[0] ||
      'Mind Friend',
    [currentUser]
  );

  const isActive = (path: string) => {
    if (path === '/feed' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 h-14 z-50 bg-[var(--ms-surface)]/95 backdrop-blur-[20px] border-b border-[var(--ms-border)]">
      <div className="h-full max-w-[1600px] mx-auto px-3 sm:px-4 flex items-center gap-3">
        {/* Left: logo */}
        <button
          onClick={() => navigate('/feed')}
          className="flex items-center gap-2 text-xl font-semibold text-[var(--ms-teal)]"
        >
          <span className="text-brand">MindSathi</span>
          <span className="w-2 h-2 rounded-full bg-[var(--ms-teal)] animate-pulse shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
        </button>

        {/* Center: icon nav */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`relative h-12 w-14 flex flex-col items-center justify-center rounded-xl transition hover:bg-[rgba(45,212,191,0.08)] ${
                    active ? 'text-[var(--ms-teal)]' : 'text-[var(--ms-text-muted)]'
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={active ? 2.4 : 2} />
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-[var(--ms-teal)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[var(--ms-border)] rounded-full px-3 h-10">
                <Search className="w-4 h-4 text-[var(--ms-text-muted)]" />
                <input
                  autoFocus
                  placeholder="Search MindSathi..."
                  className="bg-transparent outline-none text-sm w-44 sm:w-56"
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-[rgba(45,212,191,0.08)] text-[var(--ms-text-muted)]"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          <button className="relative p-2 rounded-full hover:bg-[rgba(45,212,191,0.08)] text-[var(--ms-text-muted)]">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] text-white grid place-items-center">
              3
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-[rgba(45,212,191,0.08)]"
            >
              <div className="w-9 h-9 rounded-full avatar-circle grid place-items-center text-sm font-semibold">
                {alias.slice(0, 2).toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--ms-text-muted)]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-card p-2 border border-[var(--ms-border)] shadow-lg">
                <div className="px-2 py-1 text-sm font-semibold">{alias}</div>
                <button
                  className="w-full text-left px-2 py-2 rounded-lg hover:bg-[rgba(45,212,191,0.08)] text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-2 py-2 rounded-lg hover:bg-[rgba(45,212,191,0.08)] text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/settings');
                  }}
                >
                  Settings
                </button>
                <button
                  className="w-full text-left px-2 py-2 rounded-lg hover:bg-[rgba(244,114,182,0.12)] text-[var(--ms-rose)] text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
