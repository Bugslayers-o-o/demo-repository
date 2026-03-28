import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import ChatbotFAB from '../chatbot/ChatbotFAB';
import ChatbotPanel from '../chatbot/ChatbotPanel';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

const AppShell: React.FC<Props> = ({ children }) => {
  const { currentUser } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const openChat = () => {
    setChatOpen(true);
    setHasUnread(false);
  };

  useEffect(() => {
    const handler = () => openChat();
    window.addEventListener('ms-chat-open', handler);
    return () => window.removeEventListener('ms-chat-open', handler);
  }, []);

  return (
    <div className="bg-[var(--ms-bg)] min-h-screen text-[var(--ms-text)]">
      <TopBar />

      {/* Fixed sidebars, removed from flow so center stays true center */}
      <div className="hidden lg:block fixed top-14 left-0 w-[280px] h-[calc(100vh-56px)] overflow-y-auto pr-4 bg-[var(--ms-bg)]">
        <Sidebar />
      </div>
      <div className="hidden xl:block fixed top-14 right-0 w-[340px] h-[calc(100vh-56px)] overflow-y-auto pl-4 bg-[var(--ms-bg)]">
        <RightPanel onOpenChat={openChat} />
      </div>

      {/* Center feed */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <main className="min-h-screen pt-20 pb-16 flex justify-center">
          <div className="w-full max-w-[780px]">{children}</div>
        </main>
      </div>

      <BottomNav
        onCreatePost={() =>
          document.getElementById('ms-create-post')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      />

      {currentUser && (
        <>
          <ChatbotFAB onClick={openChat} hasUnread={hasUnread} />
          <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        </>
      )}
    </div>
  );
};

export default AppShell;
