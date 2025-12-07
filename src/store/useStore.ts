import { create } from 'zustand';

interface AppState {
    symbol: string;
    interval: string;
    setSymbol: (symbol: string) => void;
    setInterval: (interval: string) => void;
}

export const useStore = create<AppState>((set) => ({
    symbol: 'BTCUSDT',
    interval: '1h',
    setSymbol: (symbol) => set({ symbol }),
    setInterval: (interval) => set({ interval }),
}));
