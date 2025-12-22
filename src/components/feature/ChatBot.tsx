'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FAQ_LIST } from '@/lib/faq-data';

// --- 아이콘 컴포넌트 ---
const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 3C6.48 3 2 6.48 2 10.77C2 13.54 3.79 16 6.6 17.47L5.6 21.08C5.55 21.28 5.76 21.46 5.95 21.34L10.3 18.52C10.85 18.61 11.42 18.66 12 18.66C17.52 18.66 22 15.18 22 10.89C22 6.6 17.52 3 12 3Z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'bot', content: '안녕하세요! KT 마켓 글로벌입니다.\n궁금하신 내용을 선택해주세요. 👇' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const found = FAQ_LIST.find((item) => 
        item.keywords.some((k) => text.includes(k)) || text === item.question
      );
      const botContent = found 
        ? found.answer 
        : "죄송합니다. 관련된 정보를 찾지 못했어요. 😅\n아래 칩을 눌러보시거나 '요금', '지원금' 등으로 질문해주세요.";
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', content: botContent };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  if (!isOpen && !isAnimating) {
    return (
      <button
        onClick={() => setIsOpen(true)}
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
      <div className="w-[360px] h-[600px] bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-line-200/50 flex flex-col overflow-hidden">
        
        {/* 1. Header */}
        <div className="px-5 py-4 border-b border-line-200 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-[17px]">KT Market Support</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-correct animate-pulse" />
              <span className="text-xs text-gray-500 font-medium">평균 30분 내 응답</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Contact Cards */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="http://pf.kakao.com/_HfItxj/friend" 
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <div className="p-1.5 bg-white/30 rounded-full group-hover:scale-110 transition-transform">
                <KakaoIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-black/60 leading-none mb-0.5">카톡 상담</span>
                <span className="text-xs font-bold text-[#191919]">카카오톡</span>
              </div>
            </a>

            <a 
              href="https://wa.me/821012345678" 
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <div className="p-1.5 bg-white/30 rounded-full group-hover:scale-110 transition-transform text-white">
                <WhatsAppIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-white/80 leading-none mb-0.5">Global</span>
                <span className="text-xs font-bold text-white">WhatsApp</span>
              </div>
            </a>
          </div>
        </div>

        {/* 3. Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-hide">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm animate-in slide-in-from-bottom-2 fade-in duration-300 whitespace-pre-wrap",
                m.role === 'user' 
                  ? "bg-primary text-white rounded-[20px] rounded-tr-[4px] self-end ml-auto" 
                  : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-tl-[4px] self-start"
              )}
            >
              {m.content}
              
              {m.id === 'welcome' && (
                <div className="mt-4 flex flex-col gap-2">
                  {FAQ_LIST.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSend(item.question)}
                      className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-blue-50 hover:text-primary rounded-xl text-[13px] font-medium transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 4. Footer */}
        <div className="p-4 bg-white border-t border-line-200 relative z-20">
          <div className="relative w-full mb-3 group/chips">
            <div className="absolute top-0 right-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-hide snap-x">
              {FAQ_LIST.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSend(item.question)}
                  className={cn(
                    "shrink-0 snap-start flex items-center gap-1.5 px-3.5 py-2 rounded-full",
                    "bg-white border border-line-200 shadow-sm",
                    "text-[13px] font-medium text-gray-700",
                    "transition-all duration-300 ease-out",
                    "hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:bg-gray-50 cursor-pointer"
                  )}
                >
                  <span className="text-[10px] opacity-70">✨</span> 
                  {item.question}
                </button>
              ))}
              <div className="w-4 shrink-0" />
            </div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="relative flex items-center"
          >
            <input
              className="w-full h-12 bg-gray-50 rounded-[18px] pl-5 pr-12 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border border-transparent focus:border-primary/50 shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 내용을 입력해주세요..."
            />
            <button 
              type="submit" 
              className={cn(
                "absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                input.trim() 
                  ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-110 active:scale-90 cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              disabled={!input.trim()}
            >
              <Send size={16} className={cn("transition-transform", input.trim() && "-ml-0.5")} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}