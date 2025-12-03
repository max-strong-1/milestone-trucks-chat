import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Mock Data
const MATERIALS = [
    { id: 'gravel-57', name: '#57 Gravel', price: 45, available_zips: ['43537', '43528'] },
    { id: 'topsoil-premium', name: 'Premium Topsoil', price: 35, available_zips: ['43537', '43528', '43604'] },
    { id: 'mulch-black', name: 'Black Mulch', price: 40, available_zips: ['43537'] },
];

// In-memory session store (for demo purposes only - use Redis/DB in prod)
const sessionStore: Record<string, any> = {};

// In-memory command store for frontend polling (since we don't have websockets set up yet)
// Key: call_id, Value: Array of commands
export const commandStore: Record<string, any[]> = {};

export async function POST(request: Request) {
    try {
        // Verify signature (skip for staging/demo, but recommended for prod)
        // const signature = request.headers.get('x-retell-signature');

        const body = await request.json();
        const { interaction_type, call_id, name, args } = body;

        console.log(`Received webhook: ${interaction_type} for call ${call_id}`);

        if (interaction_type === 'call_analyzed') {
            return NextResponse.json({ message: 'Analysis received' });
        }

        if (interaction_type === 'tool_call') {
            console.log(`Tool Call: ${name}`, args);
            let result: any = { success: true };

            switch (name) {
                case 'get_materials_by_zip':
                    const available = MATERIALS.filter(m => m.available_zips.includes(args.zip));
                    result = {
                        materials: available.map(m => ({ id: m.id, name: m.name, price: m.price })),
                        count: available.length
                    };
                    break;

                case 'get_material_details':
                    const material = MATERIALS.find(m => m.id === args.material_id);
                    result = material || { error: 'Material not found' };
                    break;

                case 'calculate_quantity':
                    // Simple logic: (L * W * D/12) / 27 = Cubic Yards
                    const cubicYards = (args.length * args.width * (args.depth / 12)) / 27;
                    result = {
                        quantity_cubic_yards: Math.ceil(cubicYards * 10) / 10, // Round to 1 decimal
                        unit: 'cubic yards'
                    };
                    break;

                case 'create_or_update_cart':
                    // Store in session and send command to frontend
                    sessionStore[call_id] = { ...sessionStore[call_id], cart: args };
                    pushCommand(call_id, { type: 'UPDATE_CART', payload: args });
                    result = { message: 'Cart updated', cart: args };
                    break;

                case 'navigate_to':
                    // Send command to frontend
                    pushCommand(call_id, { type: 'NAVIGATE', payload: args.page_slug });
                    result = { message: `Navigating to ${args.page_slug}` };
                    break;

                case 'prefill_checkout_form':
                    pushCommand(call_id, { type: 'PREFILL_FORM', payload: args.fields });
                    result = { message: 'Form pre-filled' };
                    break;

                case 'update_session_state':
                    sessionStore[call_id] = { ...sessionStore[call_id], [args.key]: args.value };
                    result = { success: true, [args.key]: args.value };
                    break;

                case 'get_session_state':
                    result = { value: sessionStore[call_id]?.[args.key] || null };
                    break;

                case 'get_alternate_zip_material':
                    // Mock logic: return same material but say it's from "Nearby Yard"
                    result = {
                        available: true,
                        source: 'Nearby Yard (15 miles)',
                        delivery_surcharge: 25
                    };
                    break;

                default:
                    result = { error: 'Unknown tool' };
            }

            return NextResponse.json(result);
        }

        return NextResponse.json({ message: 'Event received' });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function pushCommand(callId: string, command: any) {
    if (!commandStore[callId]) {
        commandStore[callId] = [];
    }
    commandStore[callId].push(command);
}
