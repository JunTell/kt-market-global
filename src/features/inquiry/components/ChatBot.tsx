'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { getFAQList } from '@/features/inquiry/lib/faq-data';
import { useTranslations } from 'next-intl';
import { useUIStore } from '@/shared/model/useUIStore';

// New Components
import ChatHeader from './chat/ChatHeader';
import ChatContactCards from './chat/ChatContactCards';
import ChatMessageList, { Message } from './chat/ChatMessageList';
import ChatInputForm from './chat/ChatInputForm';



export default function ChatBot() {
  const t = useTranslations('ChatBot');
  const pathname = usePathname();
  const { isChatOpen, setChatOpen } = useUIStore();

  const FAQ_LIST = getFAQList(t);

  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', type: 'bot', text: t('welcome_message'), timestamp: new Date() }
  ]);

  const isOpen = isChatOpen;
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setIsAnimating(true);
    else setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isOpen]);


  const handleSend = (text: string) => {
    if (!text.trim()) return;
    messageIdCounter.current += 1;
    const userMsg: Message = { id: `msg-${messageIdCounter.current}`, type: 'user', text: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const found = FAQ_LIST.find((item) =>
        item.keywords.some((k) => text.includes(k)) || text === item.question
      );
      const botContent = found
        ? found.answer
        : t('not_found');
      messageIdCounter.current += 1;
      const botMsg: Message = { id: `msg-${messageIdCounter.current}`, type: 'bot', text: botContent, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  // ✅ [추가] 경로에 '/phone'이 포함되어 있으면 렌더링하지 않음 (null 반환)
  if (pathname?.includes('/phone')) {
    return null;
  }

  if (!isOpen && !isAnimating) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(0,102,255,0.3)] hover:scale-105 transition-all duration-300 flex items-center justify-center group cursor-pointer"
      >
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
      isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95 pointer-events-none"
    )}>
      {/* 🔮 메인 컨테이너 */}
      <div className="w-[360px] h-[600px] bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border-default flex flex-col overflow-hidden">

        <ChatHeader onClose={() => setChatOpen(false)} />

        <ChatContactCards />

        <ChatMessageList
          messages={messages}
          faqList={FAQ_LIST}
          onQuestionClick={handleSend}
        />

        <ChatInputForm
          faqList={FAQ_LIST}
          onSend={handleSend}
        />

      </div>
    </div>
  );
}