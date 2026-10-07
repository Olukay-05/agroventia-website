import { NextResponse } from 'next/server';
import { deleteLinkedInTokens } from '@/lib/system-settings';

export async function POST() {
    try {
        await deleteLinkedInTokens();
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to disconnect' }, { status: 500 });
    }
}
