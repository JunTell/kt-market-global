import { create } from 'zustand';

interface UIState {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
    setChatOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isChatOpen: false,
    openChat: () => set({ isChatOpen: true }),
    closeChat: () => set({ isChatOpen: false }),
    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
}));
