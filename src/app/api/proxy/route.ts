import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');

    if (!path) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (key !== 'path') {
            queryParams.append(key, value);
        }
    });

    try {
        const url = `https://api.binance.com/api/v3/${path}?${queryParams.toString()}`;
        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Binance API Error:", res.status, errorText);
            return NextResponse.json({ error: 'Binance API error', details: errorText }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
