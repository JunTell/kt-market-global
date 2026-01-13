'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import { FAQItem } from '@/features/inquiry/lib/faq-data';

type ChatInputFormProps = {
    faqList: FAQItem[];
    onSend: (text: string) => void;
};

export default function ChatInputForm({ faqList, onSend }: ChatInputFormProps) {
    const t = useTranslations('ChatBot');
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput('');
    };

    return (
        <div className="p-4 bg-white border-t border-grey-200 relative z-20">
            <div className="relative w-full mb-3 group/chips">
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
                <div className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-hide snap-x">
                    {faqList.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSend(item.question)}
                            className={cn(
                                "shrink-0 snap-start flex items-center gap-1.5 px-3.5 py-2 rounded-full",
                                "bg-white border border-grey-200 shadow-sm",
                                "text-[13px] font-medium text-grey-700",
                                "transition-all duration-300 ease-out",
                                "hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:bg-bg-pressed cursor-pointer"
                            )}
                        >
                            <span className="text-[10px] opacity-70">✨</span>
                            <span className="lang-ja:text-[12px]">{item.question}</span>
                        </button>
                    ))}
                    <div className="w-4 shrink-0" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                    className="w-full h-12 bg-bg-grouped rounded-[18px] pl-5 pr-12 text-[14px] text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border border-transparent focus:border-primary/50 shadow-inner"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('input_placeholder')}
                />
                <button
                    type="submit"
                    className={cn(
                        "absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                        input.trim()
                            ? "bg-primary text-white shadow-lg shadow-primary/30 hover:scale-110 active:scale-90 cursor-pointer"
                            : "bg-grey-200 text-grey-400 cursor-not-allowed"
                    )}
                    disabled={!input.trim()}
                >
                    <Send size={16} className={cn("transition-transform", input.trim() && "-ml-0.5")} />
                </button>
            </form>
        </div>
    );
}
