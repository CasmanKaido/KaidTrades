import { CandleData } from "@/services/binanceService";
import { UTCTimestamp } from "lightweight-charts";

export interface LineData {
    time: UTCTimestamp;
    value: number;
}

export const calculateSMA = (data: CandleData[], period: number = 20): LineData[] => {
    const smaData: LineData[] = [];

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            continue; // Not enough data for calculating average
        }

        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }

        smaData.push({
            time: data[i].time,
            value: sum / period
        });
    }

    return smaData;
};

export const calculateEMA = (data: CandleData[], period: number = 20): LineData[] => {
    const emaData: LineData[] = [];
    const k = 2 / (period + 1);

    let previousEma = data[0].close; // Simple starting point

    // Better initialization would be SMA of first N periods, but simple start for now
    for (let i = 0; i < data.length; i++) {
        const close = data[i].close;
        const ema = close * k + previousEma * (1 - k);

        emaData.push({
            time: data[i].time,
            value: ema
        });

        previousEma = ema;
    }

    return emaData;
};
