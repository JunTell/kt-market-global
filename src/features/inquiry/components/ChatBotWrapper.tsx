'use client';

import dynamic from 'next/dynamic';

const ChatBot = dynamic(
  () => import('@/features/inquiry/components/ChatBot'),
  { ssr: false }
);

export default function ChatBotWrapper() {
  return <ChatBot />;
}
