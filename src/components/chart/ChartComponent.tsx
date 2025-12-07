import { ColorType, createChart, IChartApi, ISeriesApi, UTCTimestamp, CandlestickSeries, LineSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartComponentProps {
    data: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[];
    lastCandle?: { time: UTCTimestamp; open: number; high: number; low: number; close: number };
    smaData?: { time: UTCTimestamp; value: number }[];
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
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

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

        // Candlestick Series
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        candleSeriesRef.current = candleSeries;
        candleSeries.setData(data);

        // SMA Series (Line)
        const smaSeries = chart.addSeries(LineSeries, {
            color: '#2962FF',
            lineWidth: 2,
            priceScaleId: 'right', // Bind to same scale
            crosshairMarkerVisible: false,
        });
        smaSeriesRef.current = smaSeries;
        if (smaData) {
            smaSeries.setData(smaData);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, smaData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    // Real-time Updates
    useEffect(() => {
        if (candleSeriesRef.current && lastCandle) {
            candleSeriesRef.current.update(lastCandle);

            // Basic SMA update estimate for the last candle 
            // (Note: accurate live indicator updates usually require re-calc of whole window, 
            // but for visual smoothness we can append if we tracked history. 
            // For now, indicators update only on full refresh/history load to keep it simple, 
            // or we'd need to pass updated SMA last point too.)
        }
    }, [lastCandle]);

    return (
        <div
            ref={chartContainerRef}
            className="h-full w-full"
        />
    );
};
