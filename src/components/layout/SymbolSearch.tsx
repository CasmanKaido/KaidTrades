import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

interface SymbolSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

// Popular Binance pairs for demo
// Demo Symbols
const SYMBOLS = [
    { symbol: 'EUR/USD', description: 'Euro / US Dollar', type: 'Forex' },
    { symbol: 'USD/JPY', description: 'US Dollar / Japanese Yen', type: 'Forex' },
    { symbol: 'GBP/USD', description: 'British Pound / US Dollar', type: 'Forex' },
    { symbol: 'USD/CAD', description: 'US Dollar / Canadian Dollar', type: 'Forex' },
    { symbol: 'AUD/USD', description: 'Australian Dollar / US Dollar', type: 'Forex' },
    { symbol: 'BTC/USD', description: 'Bitcoin / US Dollar', type: 'Crypto' },
    { symbol: 'ETH/USD', description: 'Ethereum / US Dollar', type: 'Crypto' },
    { symbol: 'SPX', description: 'S&P 500', type: 'Index' },
    { symbol: 'NDX', description: 'Nasdaq 100', type: 'Index' },
    { symbol: 'DJI', description: 'Dow Jones Industrial Average', type: 'Index' },
    { symbol: 'XAU/USD', description: 'Gold / US Dollar', type: 'Forex' }, // Processed as stock/forex by TD
    { symbol: 'AAPL', description: 'Apple Inc', type: 'Stock' },
    { symbol: 'TSLA', description: 'Tesla Inc', type: 'Stock' },
    { symbol: 'NVDA', description: 'NVIDIA Corp', type: 'Stock' },
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

    const filteredSymbols = SYMBOLS.filter(s =>
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
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
                        placeholder="Search symbol (e.g. EUR/USD)..."
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
                    {filteredSymbols.length > 0 ? (
                        filteredSymbols.map((item) => (
                            <button
                                key={item.symbol}
                                onClick={() => handleSelect(item.symbol)}
                                className="flex w-full items-center px-4 py-2 hover:bg-[#2a2e39] transition-colors gap-3"
                            >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-[#d1d4dc] ${item.type === 'Crypto' ? 'bg-orange-500/20 text-orange-400' : item.type === 'Forex' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {item.symbol.substring(0, 1)}
                                </div>
                                <div className="flex flex-col items-start whitespace-nowrap">
                                    <span className="font-bold text-sm text-[#d1d4dc]">{item.symbol}</span>
                                    <span className="text-xs text-[#505d74]">{item.description}</span>
                                </div>
                                <div className="ml-auto text-[10px] text-[#505d74] border border-[#2a2e39] rounded px-1.5 py-0.5">
                                    {item.type.toUpperCase()}
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
