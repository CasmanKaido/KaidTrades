import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const query = searchParams.toString().replace(`path=${path}&`, '');

    if (!path) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
        const url = `https://api.binance.com/api/v3/${path}?${query}`;
        const res = await fetch(url);

        if (!res.ok) {
            return NextResponse.json({ error: 'Binance API error', status: res.status }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
