import { ColorType, createChart, IChartApi, ISeriesApi, UTCTimestamp, CandlestickSeries, LineSeries } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { DrawingOverlay } from './DrawingOverlay';

interface ChartComponentProps {
    data: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[];
    lastCandle?: { time: UTCTimestamp; open: number; high: number; low: number; close: number };
    smaData?: { time: UTCTimestamp; value: number }[];
    emaData?: { time: UTCTimestamp; value: number }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
    data,
    lastCandle,
    smaData,
    emaData,
    colors: {
        backgroundColor = '#131722',
        lineColor = '#2962FF',
        textColor = '#d1d4dc',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // State to expose instances to DrawingOverlay
    const [chartRef, setChartRef] = useState<IChartApi | null>(null);
    const [candleSeriesRef, setCandleSeriesRef] = useState<ISeriesApi<"Candlestick"> | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const emaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    // Initial Chart Creation & Historical Data
    useEffect(() => {
        if (!chartContainerRef.current) return;

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

        setChartRef(chart);

        // Candlestick Series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        setCandleSeriesRef(candleSeries);
        candleSeries.setData(data);

        // SMA Series
        const smaSeries = chart.addSeries(LineSeries, {
            color: '#2962FF',
            lineWidth: 2,
            priceScaleId: 'right',
            crosshairMarkerVisible: false,
        });
        smaSeriesRef.current = smaSeries;
        if (smaData) smaSeries.setData(smaData);

        // EMA Series
        const emaSeries = chart.addSeries(LineSeries, {
            color: '#FF9800', // Orange
            lineWidth: 2,
            priceScaleId: 'right',
            crosshairMarkerVisible: false,
        });
        emaSeriesRef.current = emaSeries;
        if (emaData) emaSeries.setData(emaData);

        // ResizeObserver for robust sizing
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
            const newRect = entries[0].contentRect;

            // Should usually use Math.max(1, ...) to avoid 0 errors
            const width = Math.max(1, newRect.width);
            const height = Math.max(1, newRect.height);

            chart.applyOptions({ width, height });
            setDimensions({ width, height });
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, []);

    // Handle updates efficiently
    useEffect(() => {
        if (!smaSeriesRef.current) return;
        smaSeriesRef.current.setData(smaData || []);
    }, [smaData]);

    useEffect(() => {
        if (!emaSeriesRef.current) return;
        emaSeriesRef.current.setData(emaData || []);
    }, [emaData]);

    // Update Candle Data when historical data changes
    useEffect(() => {
        if (!candleSeriesRef) return;
        candleSeriesRef.setData(data);
    }, [data, candleSeriesRef]);

    // Real-time Updates
    useEffect(() => {
        if (candleSeriesRef && lastCandle) {
            candleSeriesRef.update(lastCandle);
        }
    }, [lastCandle, candleSeriesRef]);

    return (
        <div className="relative h-full w-full">
            <div
                ref={chartContainerRef}
                className="h-full w-full"
            />
            {chartRef && candleSeriesRef && (
                <DrawingOverlay
                    chart={chartRef}
                    series={candleSeriesRef}
                    width={dimensions.width}
                    height={dimensions.height}
                />
            )}
        </div>
    );
};
