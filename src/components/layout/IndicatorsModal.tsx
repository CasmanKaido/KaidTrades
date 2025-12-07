import { Search, X, Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

interface IndicatorsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INDICATORS_LIST = [
    { id: 'sma', name: 'Simple Moving Average', short: 'SMA' },
    { id: 'ema', name: 'Exponential Moving Average', short: 'EMA' },
    // Expandable list for future
    { id: 'rsi', name: 'Relative Strength Index', short: 'RSI', disabled: true },
    { id: 'macd', name: 'MACD', short: 'MACD', disabled: true },
    { id: 'boll', name: 'Bollinger Bands', short: 'BB', disabled: true },
];

export function IndicatorsModal({ isOpen, onClose }: IndicatorsModalProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { indicators, toggleIndicator } = useStore();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredIndicators = INDICATORS_LIST.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.short.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[500px] overflow-hidden rounded-lg bg-[#1e222d] shadow-xl border border-[#2a2e39]">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#2a2e39] px-4 py-3">
                    <h2 className="text-base font-medium text-[#d1d4dc]">Indicators, Metrics & Strategies</h2>
                    <button onClick={onClose} className="rounded hover:bg-[#2a2e39] p-1 text-[#787b86] hover:text-[#d1d4dc]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="flex items-center border-b border-[#2a2e39] px-4 py-2">
                    <Search className="mr-2 h-5 w-5 text-[#787b86]" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search"
                        className="flex-1 bg-transparent text-sm text-[#d1d4dc] placeholder-[#505d74] focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* List */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {filteredIndicators.map((item) => (
                        <div
                            key={item.id}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-[#2a2e39] transition-colors ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (!item.disabled) {
                                    toggleIndicator(item.id as 'sma' | 'ema');
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-[#d1d4dc]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Active Badge */}
                                {(indicators as any)[item.id] && (
                                    <span className="rounded bg-[#2962ff]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#2962ff]">
                                        ACTIVE
                                    </span>
                                )}
                                {item.disabled && (
                                    <span className="rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] text-[#787b86]">
                                        SOON
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
