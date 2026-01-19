
import { NextResponse } from 'next/server';
import { getLinkedInTokens } from '@/lib/wix-system-settings';

export async function GET() {
    try {
        const tokens = await getLinkedInTokens();
        // If we have tokens, we function as "connected"
        return NextResponse.json({ connected: !!tokens });
    } catch (error) {
        console.error('Status Check Error:', error);
        return NextResponse.json({ connected: false }, { status: 500 });
    }
}
