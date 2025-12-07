import Link from "next/link";
import { Search, User, Bell, Settings } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-14 w-full items-center justify-between border-b border-[#2a2e39] bg-[#131722] px-4 text-[#d1d4dc]">
            <div className="flex items-center gap-4">
                {/* Logo / Title */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-600"></div>
                    <span className="text-lg font-bold tracking-tight">TradingView</span>
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-[#2a2e39]" />

                {/* Symbol Search */}
                <button className="flex items-center gap-2 rounded hover:bg-[#2a2e39] px-2 py-1 text-sm transition-colors">
                    <Search className="h-4 w-4 text-[#787b86]" />
                    <span className="font-semibold">BTCUSDT</span>
                </button>

                {/* Timeframes */}
                <div className="hidden items-center gap-1 sm:flex">
                    {['1m', '5m', '15m', '1H', '4H', 'D', 'W'].map((tf) => (
                        <button key={tf} className="rounded px-2 py-1 text-sm hover:bg-[#2a2e39] transition-colors">
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="rounded p-2 hover:bg-[#2a2e39] transition-colors">
                    <Settings className="h-4 w-4" />
                </button>
                <button className="rounded p-2 hover:bg-[#2a2e39] transition-colors">
                    <Bell className="h-4 w-4" />
                </button>
                <button className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                    Sign In
                </button>
            </div>
        </header>
    );
}
