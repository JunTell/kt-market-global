'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NoticeItemData {
  title: string;
  content: string;
}

interface NoticeProps {
  title?: string;
  items: NoticeItemData[];
  className?: string;
}

export const Notice = ({
  title = "유의사항",
  items,
  className
}: NoticeProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-5 w-full",
        "bg-bg-grouped", // globals.css: --bg-grouped (#F2F4F6)
        "rounded-md",        // globals.css: --radius-md (8px)
        className
      )}
    >
      {/* 타이틀 (선택 사항) */}
      {title && (
        <h3 className="text-sm font-bold text-label-900 leading-tight mb-1">
          {title}
        </h3>
      )}

      {/* 아코디언 리스트 */}
      <div className="flex flex-col divide-y divide-border-divider">
        {/* divide-border-divider */}
        {items.map((item, index) => (
          <AccordionItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

// 개별 아이템 컴포넌트
const AccordionItem = ({ item }: { item: NoticeItemData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* 헤더 버튼: 양끝 정렬 (justify-between) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-left group cursor-pointer"
      >
        {/* 제목 (왼쪽) */}
        <span className={cn(
          "text-xs leading-relaxed transition-colors pr-2",
          isOpen ? "text-label-900 font-medium" : "text-label-700 group-hover:text-label-800"
        )}>
          {item.title}
        </span>

        {/* 화살표 아이콘 (오른쪽/뒤쪽) */}
        <ChevronDown
          size={16}
          className={cn(
            "text-label-500 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-label-900"
          )}
        />
      </button>

      {/* 내용 (애니메이션 적용) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* 내용 박스: 약간의 패딩과 함께 하단 배치 */}
            <p className="pb-3 text-xs text-label-500 leading-relaxed whitespace-pre-line break-keep">
              {item.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};