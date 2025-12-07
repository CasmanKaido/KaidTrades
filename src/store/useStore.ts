import { create } from 'zustand';

interface StoreState {
    symbol: string;
    interval: string;
    selectedTool: string | null;
    setSymbol: (symbol: string) => void;
    setInterval: (interval: string) => void;
    setSelectedTool: (tool: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
    symbol: 'BTCUSDT',
    interval: '1h',
    selectedTool: null,
    setSymbol: (symbol) => set({ symbol }),
    setInterval: (interval) => set({ interval }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
}));
