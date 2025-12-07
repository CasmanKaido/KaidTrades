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
import { useStore } from "@/store/useStore";

const SidebarItem = ({
    icon: Icon,
    active = false,
    label,
    onClick
}: {
    icon: any,
    active?: boolean,
    label: string,
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        title={label}
        className={`group relative flex h-8 w-8 items-center justify-center rounded hover:bg-[#2a2e39] ${active ? 'text-[#2962ff] bg-[#2a2e39]' : 'text-[#d1d4dc]'} transition-colors`}
    >
        <Icon className="h-5 w-5 stroke-[1.5]" />
    </button>
);

export function Sidebar() {
    const { selectedTool, setSelectedTool } = useStore();

    const tools = [
        { icon: Crosshair, label: 'Crosshair' },
        { separator: true },
        { icon: TrendingUp, label: 'Trend Line' },
        { icon: LayoutGrid, label: 'Fibonacci' },
        { icon: Pencil, label: 'Brush' },
        { icon: Type, label: 'Text' },
        { icon: Activity, label: 'Patterns' },
        { icon: Target, label: 'Prediction' },
        { icon: Smile, label: 'Icons' },
        { icon: Ruler, label: 'Measure' },
        { icon: ZoomIn, label: 'Zoom' },
        { separator: true },
        { icon: Magnet, label: 'Magnet', toggle: true },
        { icon: Lock, label: 'Lock All', toggle: true },
        { icon: EyeOff, label: 'Hide All', toggle: true },
        { icon: Trash2, label: 'Remove All', action: true },
    ];

    const handleToolClick = (tool: any) => {
        if (tool.action) {
            // Action, don't select
            console.log(`Action: ${tool.label}`);
        } else if (tool.toggle) {
            // Toggle logic could go here
            setSelectedTool(selectedTool === tool.label ? null : tool.label);
        } else {
            setSelectedTool(tool.label);
        }
    };

    return (
        <aside className="flex h-full w-[52px] flex-col items-center border-r border-[#2a2e39] bg-[#131722] py-3 gap-1">
            {tools.map((tool, index) => {
                if (tool.separator) {
                    return <div key={index} className="h-px w-8 bg-[#2a2e39] my-1" />;
                }

                return (
                    <SidebarItem
                        key={tool.label}
                        icon={tool.icon}
                        label={tool.label || ''}
                        active={selectedTool === tool.label || (tool.label === 'Crosshair' && !selectedTool)}
                        onClick={() => handleToolClick(tool)}
                    />
                );
            })}
        </aside>
    );
}
