'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronRight } from 'lucide-react';
import { FAQItem } from '@/features/inquiry/lib/faq-data';

export interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
    options?: string[];
    timestamp: Date;
}

type ChatMessageListProps = {
    messages: Message[];
    faqList: FAQItem[];
    onQuestionClick: (question: string) => void;
};

export default function ChatMessageList({ messages, faqList, onQuestionClick }: ChatMessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-hide">
            {messages.map((m) => (
                <div
                    key={m.id}
                    className={cn(
                        "max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm animate-in slide-in-from-bottom-2 fade-in duration-300 whitespace-pre-wrap",
                        m.type === 'user'
                            ? "bg-primary text-white rounded-[20px] rounded-tr-[4px] self-end ml-auto"
                            : "bg-white text-grey-900 border border-grey-200 rounded-[20px] rounded-tl-[4px] self-start"
                    )}
                >
                    {m.text}

                    {m.id === 'welcome' && (
                        <div className="mt-4 flex flex-col gap-2">
                            {faqList.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onQuestionClick(item.question)}
                                    className="w-full text-left px-3 py-2.5 bg-bg-grouped hover:bg-primary-bg hover:text-primary rounded-xl text-[13px] font-medium transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                    <span className="lang-ko:font-medium lang-ja:font-normal">{item.question}</span>
                                    <ChevronRight size={14} className="text-grey-400 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
