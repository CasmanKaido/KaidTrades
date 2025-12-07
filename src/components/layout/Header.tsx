import {
    Plus,
    ChevronDown,
    Camera,
    BarChart2,
    Undo2,
    Redo2,
    LayoutTemplate,
    Settings
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { SymbolSearch } from "./SymbolSearch";
import { IndicatorsModal } from "./IndicatorsModal";
// Switched to Twelve Data
import { fetchTicker24h, TickerData } from "@/services/twelveDataService";

export function Header() {
    const { symbol, interval, setInterval } = useStore();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
    const [ticker, setTicker] = useState<TickerData | null>(null);

    useEffect(() => {
        const loadTicker = async () => {
            try {
                // Ticker data for header
                const data = await fetchTicker24h(symbol);
                setTicker(data);
            } catch (error) {
                console.error("Failed to load ticker", error);
            }
        };

        loadTicker();
        // Polling for header stats (every 10s to be safe on limits)
        const intervalId = setInterval(loadTicker, 10000);

        return () => clearInterval(intervalId);
    }, [symbol]);

    const formatPrice = (price: string | undefined) => price ? parseFloat(price).toFixed(2) : '0.00';
    const formatVol = (vol: string | undefined) => {
        if (!vol) return '0';
        const v = parseFloat(vol);
        if (v >= 1000000) return (v / 1000000).toFixed(2) + 'M';
        if (v >= 1000) return (v / 1000).toFixed(2) + 'K';
        return v.toFixed(2);
    };

    return (
        <>
            <header className="flex h-[52px] w-full items-center justify-between border-b border-[#2a2e39] bg-[#131722] px-3 font-sans text-[#d1d4dc]">
                {/* Left Section */}
                <div className="flex items-center gap-0">
                    <button className="flex h-10 w-10 items-center justify-center rounded hover:bg-[#2a2e39] transition-colors">
                        <div className="h-6 w-6 rounded-full bg-[#d1d4dc] text-[#131722] flex items-center justify-center font-bold text-xs">K</div>
                    </button>

                    <div className="h-6 w-px bg-[#2a2e39] mx-2" />

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-2 rounded hover:bg-[#2a2e39] px-2 py-1.5 transition-colors group"
                        title="Symbol Search"
                    >
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-bold text-sm text-white">{symbol}</span>
                            <span className="text-[10px] text-[#505d74]">BINANCE</span>
                        </div>
                    </button>

                    <div className="h-6 w-px bg-[#2a2e39] mx-2" />

                    <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] transition-colors" title="Compare">
                        <Plus className="h-5 w-5" />
                    </button>

                    <div className="hidden items-center gap-0.5 sm:flex mx-1">
                        {['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setInterval(tf)}
                                className={`min-w-[28px] h-[28px] rounded flex items-center justify-center text-sm font-medium transition-colors ${interval === tf ? 'text-[#2962ff] bg-[#2962ff]/10' : 'hover:bg-[#2a2e39] hover:text-[#2962ff]'}`}
                            >
                                {tf}
                            </button>
                        ))}
                        <button className="flex h-7 w-4 items-center justify-center rounded hover:bg-[#2a2e39] text-[#787b86]">
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="h-5 w-px bg-[#2a2e39] mx-2" />

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsIndicatorsOpen(true)}
                            className="flex items-center gap-1 hover:bg-[#2a2e39] hover:text-[#2962ff] px-2 py-1.5 rounded transition-colors text-sm font-medium text-[#d1d4dc]"
                            title="Indicators"
                        >
                            <BarChart2 className="h-4 w-4" />
                            <span className="hidden lg:inline">Indicators</span>
                        </button>
                    </div>
                </div>

                {/* Middle Stats Section */}
                <div className="hidden xl:flex flex-1 items-center justify-center gap-6 text-xs font-medium">
                    {ticker && (
                        <>
                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-bold ${parseFloat(ticker.priceChange) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                    {formatPrice(ticker.lastPrice)}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#787b86]">24h Change</span>
                                <span className={`${parseFloat(ticker.priceChange) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                                    {formatPrice(ticker.priceChange)} ({parseFloat(ticker.priceChangePercent).toFixed(2)}%)
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#787b86]">24h High</span>
                                <span>{formatPrice(ticker.highPrice)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#787b86]">24h Low</span>
                                <span>{formatPrice(ticker.lowPrice)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#787b86]">24h Vol</span>
                                <span>{formatVol(ticker.volume)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Center/Right Section */}
                <div className="flex items-center gap-1">
                    <div className="hidden md:flex items-center gap-0 text-[#787b86]">
                        <button className="h-9 w-9 flex items-center justify-center rounded hover:bg-[#2a2e39] hover:text-[#d1d4dc]" title="Undo">
                            <Undo2 className="h-4 w-4" />
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded hover:bg-[#2a2e39] hover:text-[#d1d4dc]" title="Redo">
                            <Redo2 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="h-5 w-px bg-[#2a2e39] mx-2 hidden md:block" />

                    <button className="hidden md:flex items-center gap-1 hover:bg-[#2a2e39] hover:text-[#2962ff] px-2 py-1.5 rounded transition-colors text-[#d1d4dc]">
                        <span className="text-sm">Unnamed</span>
                        <ChevronDown className="h-3 w-3" />
                    </button>

                    <button className="h-9 w-9 flex items-center justify-center rounded hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]" title="Settings">
                        <Settings className="h-5 w-5" />
                    </button>

                    <button className="h-9 w-9 flex items-center justify-center rounded hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]" title="Fullscreen">
                        <LayoutTemplate className="h-5 w-5" />
                    </button>

                    <button className="h-9 w-9 flex items-center justify-center rounded hover:bg-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]" title="Snapshot">
                        <Camera className="h-5 w-5" />
                    </button>

                    <div className="h-5 w-px bg-[#2a2e39] mx-2" />

                    <button className="flex items-center justify-center rounded bg-[#2962ff] hover:bg-[#1e53e5] h-8 px-4 text-xs font-semibold text-white transition-colors">
                        Publish
                    </button>
                </div>
            </header>
            <SymbolSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <IndicatorsModal isOpen={isIndicatorsOpen} onClose={() => setIsIndicatorsOpen(false)} />
        </>
    );
}
