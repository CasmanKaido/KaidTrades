import axios from 'axios';
import { UTCTimestamp } from 'lightweight-charts';

// Binance uses different interval codes than we display visually (sometimes)
// But for now we'll match them: 1m, 5m, 1h, 4h, 1d, 1w, 1M are all valid Binance intervals.
export type BinanceInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';

export interface CandleData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchHistoricalData = async (symbol: string, interval: string): Promise<CandleData[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/klines`, {
            params: {
                symbol: symbol.toUpperCase(),
                interval: interval,
                limit: 1000, // Max data points to fetch
            },
        });

        return response.data.map((d: any) => ({
            time: (d[0] / 1000) as UTCTimestamp,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
        }));
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return [];
    }
};

export const subscribeToTicker = (symbol: string, interval: string, onUpdate: (candle: CandleData) => void) => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.e === 'kline') {
            const k = message.k;
            const candle: CandleData = {
                time: (k.t / 1000) as UTCTimestamp,
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
            };
            onUpdate(candle);
        }
    };

    return () => {
        ws.close();
    };
};

export interface TickerData {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export const fetchTicker24h = async (symbol: string): Promise<TickerData> => {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`);
    return response.data;
};

export const subscribeToTicker24h = (symbol: string, callback: (data: TickerData) => void) => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // Map WS format to Rest format
        const mappedData: TickerData = {
            symbol: message.s,
            priceChange: message.p,
            priceChangePercent: message.P,
            weightedAvgPrice: message.w,
            prevClosePrice: message.x,
            lastPrice: message.c,
            lastQty: message.Q,
            bidPrice: message.b,
            bidQty: message.B,
            askPrice: message.a,
            askQty: message.A,
            openPrice: message.o,
            highPrice: message.h,
            lowPrice: message.l,
            volume: message.v,
            quoteVolume: message.q,
            openTime: message.O,
            closeTime: message.C,
            firstId: message.F,
            lastId: message.L,
            count: message.n
        };
        callback(mappedData);
    };

    return () => ws.close();
};
