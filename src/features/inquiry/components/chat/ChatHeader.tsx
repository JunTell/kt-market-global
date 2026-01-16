'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ChatHeaderProps = {
    onClose: () => void;
};

export default function ChatHeader({ onClose }: ChatHeaderProps) {
    const t = useTranslations('ChatBot');

    return (
        <div className="px-5 py-4 border-b border-grey-200 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-[17px]">{t('header_title')}</span>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-500 font-medium">{t('response_time')}</span>
                </div>
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
            >
                <X size={18} />
            </button>
        </div>
    );
}
