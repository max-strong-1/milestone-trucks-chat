import { NextResponse } from 'next/server';
import { commandStore } from '../webhook/route';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('call_id');

    if (!callId) {
        return NextResponse.json({ error: 'Call ID required' }, { status: 400 });
    }

    const commands = commandStore[callId] || [];
    // Clear commands after fetching to avoid duplicates
    commandStore[callId] = [];

    return NextResponse.json({ commands });
}
