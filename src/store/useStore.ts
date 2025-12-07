import { create } from 'zustand';

interface StoreState {
    symbol: string;
    interval: string;
    selectedTool: string | null;
    indicators: {
        sma: boolean;
        ema: boolean;
    };
    setSymbol: (symbol: string) => void;
    setInterval: (interval: string) => void;
    setSelectedTool: (tool: string | null) => void;
    toggleIndicator: (key: 'sma' | 'ema') => void;
}

export const useStore = create<StoreState>((set) => ({
    symbol: 'BTCUSDT',
    interval: '1h',
    selectedTool: null,
    indicators: {
        sma: true, // Default active
        ema: false,
    },
    setSymbol: (symbol) => set({ symbol }),
    setInterval: (interval) => set({ interval }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    toggleIndicator: (key) => set((state) => ({
        indicators: { ...state.indicators, [key]: !state.indicators[key] }
    })),
}));
