import { UTCTimestamp } from 'lightweight-charts';

export function generateData(numberOfCandles: number = 500) {
    const data = [];
    let time = new Date(Date.UTC(2023, 0, 1, 0, 0, 0, 0)).getTime() / 1000;
    let previousClose = 10000; // Starting BTC price roughly

    for (let i = 0; i < numberOfCandles; i++) {
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * previousClose * volatility;
        const close = previousClose + change;
        const open = previousClose;

        let high = Math.max(open, close) + Math.random() * previousClose * 0.01;
        let low = Math.min(open, close) - Math.random() * previousClose * 0.01;

        data.push({
            time: time as UTCTimestamp,
            open,
            high,
            low,
            close,
        });

        previousClose = close;
        time += 60 * 60 * 24; // Daily candles
    }

    return data;
}
