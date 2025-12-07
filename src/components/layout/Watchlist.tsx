import { MoreHorizontal, Plus } from "lucide-react";

export function Watchlist() {
    const watchlistItems = [
        { symbol: "BTCUSDT", last: 85234.12, change: 0.04, up: true },
        { symbol: "ETHUSDT", last: 2130.45, change: -0.03, up: false },
        { symbol: "BNBUSDT", last: 630.12, change: 0.45, up: true },
        { symbol: "NDX", last: 18450.00, change: 0.25, up: true },
        { symbol: "SPX", last: 5200.50, change: -0.08, up: false },
        { symbol: "XAUUSD", last: 2350.10, change: -10.25, up: false },
    ];

    return (
        <aside className="hidden w-72 flex-col border-l border-[#2a2e39] bg-[#131722] text-[#d1d4dc] lg:flex">
            {/* Watchlist Header */}
            <div className="flex items-center justify-between border-b border-[#2a2e39] p-3">
                <span className="font-medium text-sm">Watchlist</span>
                <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 hover:text-white cursor-pointer" />
                    <MoreHorizontal className="h-4 w-4 hover:text-white cursor-pointer" />
                </div>
            </div>

            {/* Column Headers */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-[#787b86]">
                <span className="w-20">Symbol</span>
                <span className="flex-1 text-right">Last</span>
                <span className="w-14 text-right">Chg%</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {watchlistItems.map((item) => (
                    <div key={item.symbol} className="group flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-[#2a2e39]">
                        <div className="flex flex-col w-20">
                            <span className="text-sm font-semibold text-[#d1d4dc] group-hover:text-white">{item.symbol}</span>
                            <span className="text-[10px] text-[#505d74]">USDT</span>
                        </div>
                        <div className="flex-1 text-right text-sm">
                            {item.last.toLocaleString()}
                        </div>
                        <div className={`w-14 text-right text-xs font-medium ${item.up ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                            {item.change > 0 ? '+' : ''}{item.change}%
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Panel Header Mock */}
            <div className="border-t border-[#2a2e39] p-3">
                <span className="text-xs font-bold text-[#d1d4dc]">Details</span>
            </div>
        </aside>
    );
}
