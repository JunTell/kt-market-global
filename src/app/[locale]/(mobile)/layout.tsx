import ChatBot from '@/features/inquiry/components/ChatBot';
import Header from '@/shared/components/layout/Header';
import ScrollToTop from '@/shared/components/ui/ScrollToTop';
import PartnerRibbon from '@/shared/components/ui/PartnerRibbon';
import ConsultationBar from '@/shared/components/ui/ConsultationBar';

type Props = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: Props) {
  return (
    <div
      id="main-scroll-container"
      className="w-full h-full min-w-[360px] min-h-screen overflow-x-hidden font-sans relative overflow-y-auto scrollbar-hide bg-white"
    >
      <ScrollToTop />

      <PartnerRibbon />
      <Header />
      <main>{children}</main>
      <ConsultationBar />
      <ChatBot />
    </div>
  );
}
