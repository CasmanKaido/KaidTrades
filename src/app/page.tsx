"use client";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Watchlist } from "@/components/layout/Watchlist";
import { useStore } from "@/store/useStore";
import { fetchHistoricalData, subscribeToTicker, CandleData } from "@/services/binanceService";
import { useEffect, useState, useMemo } from "react";
import { calculateSMA, calculateEMA, LineData } from "@/utils/indicators";

const ChartComponent = dynamic(
  () => import("@/components/chart/ChartComponent").then((mod) => mod.ChartComponent),
  { ssr: false }
);

export default function Home() {
  const { symbol, interval, indicators } = useStore();
  const [data, setData] = useState<CandleData[]>([]);
  const [lastCandle, setLastCandle] = useState<CandleData | undefined>(undefined);

  // Calculate Indicators
  const smaData = useMemo(() => indicators.sma ? calculateSMA(data, 20) : undefined, [data, indicators.sma]);
  const emaData = useMemo(() => indicators.ema ? calculateEMA(data, 20) : undefined, [data, indicators.ema]);

  useEffect(() => {
    // Reset data on symbol/interval change to avoid showing old data
    setData([]);
    setLastCandle(undefined);

    const loadData = async () => {
      const historical = await fetchHistoricalData(symbol, interval);
      setData(historical);
    };

    loadData();

    const unsubscribe = subscribeToTicker(symbol, interval, (candle) => {
      setLastCandle(candle);
    });

    return () => {
      unsubscribe();
    };
  }, [symbol, interval]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#131722] text-[#d1d4dc]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1">
          {data.length > 0 ? (
            <ChartComponent
              data={data}
              lastCandle={lastCandle}
              smaData={smaData}
              emaData={emaData}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </main>
        <Watchlist />
      </div>
    </div>
  );
}
