import { ColorType, createChart, IChartApi, ISeriesApi, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartComponentProps {
    data: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const ChartComponent: React.FC<ChartComponentProps & { lastCandle?: { time: UTCTimestamp; open: number; high: number; low: number; close: number } }> = ({
    data,
    lastCandle,
    colors: {
        backgroundColor = '#131722',
        lineColor = '#2962FF',
        textColor = '#d1d4dc',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    // Initial Chart Creation & Historical Data
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            grid: {
                vertLines: { color: '#1e222d' },
                horzLines: { color: '#1e222d' },
            },
            timeScale: {
                borderColor: '#2B2B43',
                timeVisible: true,
            },
            rightPriceScale: {
                borderColor: '#2B2B43',
            },
            crosshair: {
                vertLine: {
                    color: '#758696',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#758696',
                },
                horzLine: {
                    color: '#758696',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#758696',
                },
            },
        });

        chartRef.current = chart;

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        seriesRef.current = candleSeries;

        candleSeries.setData(data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    // Real-time Updates
    useEffect(() => {
        if (seriesRef.current && lastCandle) {
            seriesRef.current.update(lastCandle);
        }
    }, [lastCandle]);

    return (
        <div
            ref={chartContainerRef}
            className="h-full w-full"
        />
    );
};
