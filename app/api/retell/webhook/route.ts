import { NextResponse } from 'next/server';
import { addCommand } from '../../../../lib/commandStore';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { event, call_id } = body;

        console.log('Webhook received:', event, call_id);

        if (event === 'tool_call') {
            const { tool_call_id, name, arguments: args } = body.tool_call;
            console.log('Tool call:', name, args);

            let result = {};

            switch (name) {
                case 'get_materials_by_zip':
                    // Mock logic for materials
                    const { zip } = args;
                    if (zip === '43537' || zip === '43528') {
                        result = {
                            available: true,
                            materials: ['57_gravel', 'topsoil', 'mulch', 'sand'],
                            message: `Yes, we deliver to ${zip}. We have 57 Gravel, Topsoil, Mulch, and Sand available.`
                        };
                    } else {
                        result = {
                            available: false,
                            message: `I'm sorry, but ${zip} is outside our primary delivery zone. However, we might be able to work something out properly. Let me check our extended range.`
                        };
                    }
                    break;

                case 'calculate_quantity':
                    const { length, width, depth } = args;
                    // simple cubic yards calculation: (L * W * D/12) / 27
                    const cubicFeet = length * width * (depth / 12);
                    const cubicYards = Math.ceil(cubicFeet / 27);
                    result = {
                        quantity: cubicYards,
                        unit: 'cubic yards',
                        message: `For an area of ${length}x${width} feet with a depth of ${depth} inches, you will need approximately ${cubicYards} cubic yards of material.`
                    };
                    break;

                case 'navigate_to':
                    addCommand(call_id, {
                        type: 'NAVIGATE',
                        payload: args.page_slug,
                        timestamp: Date.now()
                    });
                    result = { success: true, message: `Navigating user to ${args.page_slug}` };
                    break;

                case 'prefill_checkout_form':
                    addCommand(call_id, {
                        type: 'PREFILL_FORM',
                        payload: args,
                        timestamp: Date.now()
                    });
                    result = { success: true, message: 'Checkout form pre-filled with customer details.' };
                    break;

                default:
                    result = { error: 'Unknown tool' };
            }

            // Return the result to Retell
            return NextResponse.json({
                type: 'tool_call_result',
                tool_call_id: tool_call_id,
                content: JSON.stringify(result)
            });
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
