import {
    Crosshair,
    MousePointer2,
    TrendingUp,
    LayoutGrid,
    Pencil,
    Type,
    Activity,
    Target,
    Smile,
    Ruler,
    ZoomIn,
    Magnet,
    Lock,
    EyeOff,
    Trash2,
    MoreHorizontal
} from "lucide-react";

const SidebarItem = ({ icon: Icon, active = false }: { icon: any, active?: boolean }) => (
    <button className={`group relative flex h-8 w-8 items-center justify-center rounded hover:bg-[#2a2e39] ${active ? 'text-[#2962ff] bg-[#2a2e39]' : 'text-[#d1d4dc]'} transition-colors`}>
        <Icon className="h-5 w-5 stroke-[1.5]" />
        <div className="absolute right-0 bottom-0 h-1.5 w-1.5 translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-full w-full text-[#787b86]" />
        </div>
    </button>
);

export function Sidebar() {
    return (
        <aside className="flex h-full w-[52px] flex-col items-center border-r border-[#2a2e39] bg-[#131722] py-3 gap-1">
            <SidebarItem icon={Crosshair} active />

            <div className="h-px w-8 bg-[#2a2e39] my-1" />

            <SidebarItem icon={TrendingUp} />
            <SidebarItem icon={LayoutGrid} /> {/* Gann/Fib proxy */}
            <SidebarItem icon={Pencil} />
            <SidebarItem icon={Type} />
            <SidebarItem icon={Activity} /> {/* Patterns proxy */}
            <SidebarItem icon={Target} /> {/* Prediction proxy */}
            <SidebarItem icon={Smile} />
            <SidebarItem icon={Ruler} />
            <SidebarItem icon={ZoomIn} />

            <div className="h-px w-8 bg-[#2a2e39] my-1" />

            <SidebarItem icon={Magnet} />
            <SidebarItem icon={Lock} />
            <SidebarItem icon={EyeOff} />
            <SidebarItem icon={Trash2} />
        </aside>
    );
}
