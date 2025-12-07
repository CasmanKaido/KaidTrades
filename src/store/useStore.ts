import { create } from 'zustand';

export interface Drawing {
    id: string;
    type: 'trend' | 'ray'; // Start simple with Trend Line
    points: { time: number, price: number }[]; // keeping time as number (UTCTimestamp is number) to avoid type issues in store
    color: string;
}

interface StoreState {
    symbol: string;
    interval: string;
    selectedTool: string | null;
    indicators: {
        sma: boolean;
        ema: boolean;
    };
    drawings: Drawing[];
    setSymbol: (symbol: string) => void;
    setInterval: (interval: string) => void;
    setSelectedTool: (tool: string | null) => void;
    toggleIndicator: (key: 'sma' | 'ema') => void;
    addDrawing: (drawing: Drawing) => void;
    removeDrawing: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
    symbol: 'BTCUSDT',
    interval: '1h',
    selectedTool: null,
    indicators: {
        sma: true, // Default active
        ema: false,
    },
    drawings: [],
    setSymbol: (symbol) => set({ symbol }),
    setInterval: (interval) => set({ interval }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    toggleIndicator: (key) => set((state) => ({
        indicators: { ...state.indicators, [key]: !state.indicators[key] }
    })),
    addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
    removeDrawing: (id) => set((state) => ({ drawings: state.drawings.filter(d => d.id !== id) })),
}));
