import axios from 'axios';
import { UTCTimestamp } from 'lightweight-charts';

// START: Temporary Hardcode to bypass Env Var issue
const API_KEY = '5787667ee1de48e2807600f886b4f217';
// const API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || 'demo'; 
// END: Temporary Hardcode

const BASE_URL = 'https://api.twelvedata.com';

export interface CandleData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

// Map our UI intervals to Twelve Data intervals
// TwelveData: 1min, 5min, 15min, 30min, 1h, 4h, 1day, 1week
const INTERVAL_MAP: Record<string, string> = {
    '1m': '1min',
    '5m': '5min',
    '15m': '15min',
    '30m': '30min',
    '1h': '1h',
    '4h': '4h',
    '1d': '1day',
    '1w': '1week'
};

export const fetchHistoricalData = async (symbol: string, interval: string): Promise<CandleData[]> => {
    try {
        // We use direct URL as Twelve Data supports CORS usually, or we can route via proxy if needed.
        // For simplicity, let's try direct first. If 403/CORS, we update proxy.
        // Twelve Data response format: { meta: {...}, values: [ { datetime: "2023-...", open: "...", ... } ] }
        const response = await axios.get(`${BASE_URL}/time_series`, {
            params: {
                symbol: symbol,
                interval: INTERVAL_MAP[interval] || '1h',
                apikey: API_KEY,
                outputsize: 500,
            }
        });

        if (response.data.status === 'error') {
            console.error('Twelve Data Error:', response.data.message);
            // Fallback: If error (like Invalid Key), returning empty array keeps the spinner.
            // We should maybe return a mock candle to stop spinner or throw error.
            // For now, let's log nicely.
            if (response.data.message.includes("demo")) {
                console.warn("Using DEMO key? Switching to symbol AAPL for test might work, or check key.");
            }
            return [];
        }

        const values = response.data.values || [];
        console.log(`[TwelveData] Fetched ${values.length} candles for ${symbol}`);

        if (values.length === 0) {
            console.warn("[TwelveData] No data returned (values is empty).");
            return [];
        }

        // Twelve Data returns newest first, so we reverse it for the chart
        return values.reverse().map((d: any) => ({
            time: (new Date(d.datetime).getTime() / 1000) as UTCTimestamp,
            open: parseFloat(d.open),
            high: parseFloat(d.high),
            low: parseFloat(d.low),
            close: parseFloat(d.close),
        }));
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return [];
    }
};

// Twelve Data WebSocket
// URL: wss://ws.twelvedata.com/v1/quotes/price?apikey=...
// But specific subscription needed.
let ws: WebSocket | null = null;
const subscribers: Record<string, ((price: number) => void)[]> = {};

export const subscribeToTicker = (symbol: string, callback: (price: number) => void) => {
    // Note: TD WebSocket Free tier might be limited.
    // If complex, we might fallback to polling for the MVP.
    // Let's implement a simple Poller for reliability first given the switch.

    // Fallback: Polling
    const intervalId = setInterval(async () => {
        try {
            const res = await axios.get(`${BASE_URL}/price`, {
                params: { symbol, apikey: API_KEY }
            });
            if (res.data.price) {
                callback(parseFloat(res.data.price));
            }
        } catch (e) {
            console.error("Polling error", e);
        }
    }, 5000); // 5 seconds poll to respect limits

    return () => clearInterval(intervalId);
};

export interface TickerData {
    symbol: string;
    lastPrice: string;
    priceChange: string;
    priceChangePercent: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
}

export const fetchTicker24h = async (symbol: string): Promise<TickerData> => {
    // Twelve Data /quote endpoint gives mostly what we need
    try {
        const response = await axios.get(`${BASE_URL}/quote`, {
            params: { symbol, apikey: API_KEY }
        });
        const d = response.data;
        return {
            symbol: d.symbol,
            lastPrice: d.close || d.price, // quote returns 'close' as previous close sometimes or 'price'
            priceChange: d.change,
            priceChangePercent: d.percent_change,
            highPrice: d.high,
            lowPrice: d.low,
            volume: d.volume || '0'
        };
    } catch (e) {
        console.error("Error fetching quota:", e);
        return {
            symbol,
            lastPrice: '0',
            priceChange: '0',
            priceChangePercent: '0',
            highPrice: '0',
            lowPrice: '0',
            volume: '0'
        };
    }
};
