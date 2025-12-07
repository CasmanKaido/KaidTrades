import React, { useEffect, useState, useRef } from 'react';
import { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useStore, Drawing } from '@/store/useStore';
import { v4 as uuidv4 } from 'uuid';

interface DrawingOverlayProps {
    chart: IChartApi;
    series: ISeriesApi<"Candlestick">;
    width: number;
    height: number;
}

export const DrawingOverlay: React.FC<DrawingOverlayProps> = ({ chart, series, width, height }) => {
    const { selectedTool, drawings, addDrawing, setSelectedTool } = useStore();
    const [currentPoints, setCurrentPoints] = useState<{ time: number, price: number }[]>([]);
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);

    // Helpers to convert coordinates
    const toCoords = (time: number, price: number) => {
        const timeScale = chart.timeScale();
        const x = timeScale.timeToCoordinate(time as Time);
        const y = series.priceToCoordinate(price);
        return { x: x ?? -100, y: y ?? -100 };
    };

    const fromCoords = (x: number, y: number) => {
        const timeScale = chart.timeScale();
        const time = timeScale.coordinateToTime(x) as number;
        const price = series.coordinateToPrice(y);
        return { time, price };
    };

    // Interaction Handlers
    const handleClick = (e: React.MouseEvent) => {
        if (!selectedTool) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const { time, price } = fromCoords(x, y);
        if (!time || !price) return;

        const newPoints = [...currentPoints, { time, price }];

        if (selectedTool === 'Trend Line') {
            if (newPoints.length === 2) {
                // Finish drawing
                addDrawing({
                    id: uuidv4(),
                    type: 'trend',
                    points: newPoints,
                    color: '#2962FF'
                });
                setCurrentPoints([]);
                setSelectedTool(null); // Deselect after drawing one line? Optional.
            } else {
                setCurrentPoints(newPoints);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selectedTool) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Render Logic
    return (
        <svg
            className="absolute inset-0 z-10 cursor-crosshair pointer-events-auto"
            style={{ width, height, pointerEvents: selectedTool ? 'auto' : 'none' }}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
        >
            {/* Existing Drawings */}
            {drawings.map(d => {
                const p1 = toCoords(d.points[0].time, d.points[0].price);
                const p2 = toCoords(d.points[1].time, d.points[1].price);
                if (!p1 || !p2) return null;

                return (
                    <g key={d.id}>
                        <line
                            x1={p1.x} y1={p1.y}
                            x2={p2.x} y2={p2.y}
                            stroke={d.color}
                            strokeWidth={2}
                        />
                        <circle cx={p1.x} cy={p1.y} r={3} fill={d.color} />
                        <circle cx={p2.x} cy={p2.y} r={3} fill={d.color} />
                    </g>
                );
            })}

            {/* Current Drawing (Ghost) */}
            {currentPoints.length === 1 && mousePos && (
                <line
                    x1={toCoords(currentPoints[0].time, currentPoints[0].price).x}
                    y1={toCoords(currentPoints[0].time, currentPoints[0].price).y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke="#2962FF"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                />
            )}
        </svg>
    );
};
