import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

interface SymbolSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

// Popular Binance pairs for demo
const POPULAR_PAIRS = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT",
    "DOGEUSDT", "SHIBUSDT", "AVAXUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT",
    "UNIUSDT", "LINKUSDT", "ATOMUSDT", "ETCUSDT", "XLMUSDT", "BCHUSDT",
    "NEARUSDT", "ALGOUSDT", "FILUSDT", "TRXUSDT", "APEUSDT", "SANDUSDT",
    "MANAUSDT", "AXSUSDT", "GALAUSDT", "FTMUSDT", "AAVEUSDT", "EGLDUSDT"
];

export function SymbolSearch({ isOpen, onClose }: SymbolSearchProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { setSymbol } = useStore();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredPairs = POPULAR_PAIRS.filter(pair =>
        pair.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (symbol: string) => {
        setSymbol(symbol);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[400px] overflow-hidden rounded-lg bg-[#1e222d] shadow-xl border border-[#2a2e39]">

                {/* Header */}
                <div className="flex items-center border-b border-[#2a2e39] px-4 py-3">
                    <Search className="mr-2 h-5 w-5 text-[#787b86]" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search symbol (e.g. BTCUSDT)..."
                        className="flex-1 bg-transparent text-lg text-[#d1d4dc] placeholder-[#505d74] focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="rounded hover:bg-[#2a2e39] p-1 text-[#787b86] hover:text-[#d1d4dc]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* List */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    <div className="px-4 py-1.5 text-xs font-semibold text-[#505d74]">CRYPTO</div>
                    {filteredPairs.length > 0 ? (
                        filteredPairs.map((pair) => (
                            <button
                                key={pair}
                                onClick={() => handleSelect(pair)}
                                className="flex w-full items-center px-4 py-2 hover:bg-[#2a2e39] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2a2e39] text-[10px] font-bold text-[#d1d4dc]">
                                        {pair.substring(0, 1)}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-sm text-[#d1d4dc]">{pair}</span>
                                        <span className="text-xs text-[#505d74]">BINANCE</span>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-4 text-center text-sm text-[#505d74]">
                            No results found
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[#2a2e39] bg-[#1e222d] px-4 py-2 text-xs text-[#505d74]">
                    Press <span className="font-bold text-[#787b86]">ESC</span> to close
                </div>
            </div>
        </div>
    );
}
