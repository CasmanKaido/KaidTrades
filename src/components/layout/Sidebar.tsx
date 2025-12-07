import { Pencil, TrendingUp, Wallet, LayoutGrid, Info } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="flex h-full w-14 flex-col items-center border-r border-[#2a2e39] bg-[#131722] py-4 text-[#d1d4dc]">
            <div className="flex flex-col gap-4">
                <button className="rounded p-2 hover:bg-[#2a2e39] hover:text-blue-500 transition-colors" title="Draw">
                    <Pencil className="h-5 w-5" />
                </button>
                <button className="rounded p-2 hover:bg-[#2a2e39] hover:text-blue-500 transition-colors" title="Trend">
                    <TrendingUp className="h-5 w-5" />
                </button>
                <button className="rounded p-2 hover:bg-[#2a2e39] hover:text-blue-500 transition-colors" title="Wallet">
                    <Wallet className="h-5 w-5" />
                </button>
                <button className="rounded p-2 hover:bg-[#2a2e39] hover:text-blue-500 transition-colors" title="Layout">
                    <LayoutGrid className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-auto flex flex-col gap-4">
                <button className="rounded p-2 hover:bg-[#2a2e39] hover:text-blue-500 transition-colors" title="Info">
                    <Info className="h-5 w-5" />
                </button>
            </div>
        </aside>
    );
}
