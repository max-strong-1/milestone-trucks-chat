import { NextResponse } from 'next/server';
import { getCommands } from '../../../../lib/commandStore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const call_id = searchParams.get('call_id');

    if (!call_id) {
        return NextResponse.json({ commands: [] });
    }

    const commands = getCommands(call_id);
    return NextResponse.json({ commands });
}
