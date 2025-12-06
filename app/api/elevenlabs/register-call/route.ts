import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

const retell = new Retell({
    apiKey: process.env.RETELL_API_KEY || 'YOUR_RETELL_API_KEY',
});

export async function POST(request: Request) {
    try {
        const { agent_id } = await request.json();

        if (!agent_id) {
            return NextResponse.json(
                { error: 'Agent ID is required' },
                { status: 400 }
            );
        }

        const callResponse = await retell.call.createWebCall({
            agent_id: agent_id,
        });

        return NextResponse.json({
            access_token: callResponse.access_token,
            call_id: callResponse.call_id,
        });
    } catch (error) {
        console.error('Error registering call:', error);
        return NextResponse.json(
            { error: 'Failed to register call' },
            { status: 500 }
        );
    }
}
