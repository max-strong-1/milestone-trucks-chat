import { NextResponse } from 'next/server';
import { getCommands } from '../../../../lib/commandStore';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://staging12.milestonetrucks.com',
    'https://milestonetrucks.com',
    'https://www.milestonetrucks.com',
];

function getCorsHeaders(request: Request) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export async function OPTIONS(request: Request) {
    return NextResponse.json({}, { headers: getCorsHeaders(request) });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const call_id = searchParams.get('call_id');
    const corsHeaders = getCorsHeaders(request);

    if (!call_id) {
        return NextResponse.json({ commands: [] }, { headers: corsHeaders });
    }

    const commands = getCommands(call_id);
    return NextResponse.json({ commands }, { headers: corsHeaders });
}
