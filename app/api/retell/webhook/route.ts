import { NextResponse } from 'next/server';
import { addCommand } from '@/lib/commandStore';
import SERVICED_ZIP_CODES from '@/lib/service-area-zips';

// Materials catalog (Product IDs 101-114)
const MATERIALS = [
    { id: 101, name: '#57 Limestone', price: 42, unit: 'ton', minimum: 2 },
    { id: 102, name: '#304 Limestone', price: 38, unit: 'cubic yard', minimum: 1 },
    { id: 103, name: '#8 Limestone', price: 45, unit: 'ton', minimum: 2 },
    { id: 104, name: 'Crusher Run', price: 35, unit: 'ton', minimum: 2 },
    { id: 105, name: 'Premium Topsoil', price: 32, unit: 'cubic yard', minimum: 1 },
    { id: 106, name: 'Fill Dirt', price: 18, unit: 'cubic yard', minimum: 3 },
    { id: 107, name: 'Black Mulch', price: 38, unit: 'cubic yard', minimum: 2 },
    { id: 108, name: 'Brown Mulch', price: 36, unit: 'cubic yard', minimum: 2 },
    { id: 109, name: 'Red Mulch', price: 40, unit: 'cubic yard', minimum: 2 },
    { id: 110, name: 'Playground Mulch', price: 42, unit: 'cubic yard', minimum: 2 },
    { id: 111, name: 'River Rock', price: 65, unit: 'ton', minimum: 1 },
    { id: 112, name: 'Pea Gravel', price: 48, unit: 'ton', minimum: 1 },
    { id: 113, name: 'Sand', price: 28, unit: 'ton', minimum: 2 },
    { id: 114, name: 'Slag', price: 32, unit: 'ton', minimum: 2 },
];

const DELIVERY_FEE = 75;

// Convert to Set for O(1) lookup
const servicedZipSet = new Set(SERVICED_ZIP_CODES);

function checkServiceArea(zipCode: string): boolean {
    return servicedZipSet.has(zipCode);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Handle ElevenLabs webhook format
        // ElevenLabs sends: { tool_name: string, ...args }
        const toolName = body.tool_name || body.name;
        const toolArgs = { ...body };
        delete toolArgs.tool_name;
        delete toolArgs.name;

        // Also handle Retell format for backwards compatibility
        const { event, call_id, tool_call } = body;

        console.log('Webhook received:', JSON.stringify(body, null, 2));

        // ElevenLabs direct tool call format
        if (toolName) {
            console.log('ElevenLabs Tool call:', toolName, toolArgs);
            const result = handleToolCall(toolName, toolArgs, call_id);
            return NextResponse.json({ result });
        }

        // Retell format
        if (event === 'tool_call' && tool_call) {
            const { tool_call_id, name, arguments: args } = tool_call;
            console.log('Retell Tool call:', name, args);

            const result = handleToolCall(name, args, call_id);

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

function handleToolCall(name: string, args: any, callId?: string): any {
    switch (name) {
        case 'check_service_area': {
            const zipCode = args.zip_code || args.zipCode;
            const isServiced = checkServiceArea(zipCode);
            return {
                in_service_area: isServiced,
                result: isServiced
                    ? `Yes, we service ZIP code ${zipCode}! It's within our delivery area covering Ohio, Indiana, Pennsylvania, West Virginia, Kentucky, and Michigan.`
                    : `Sorry, ZIP code ${zipCode} is outside our current service area. We currently deliver to Ohio, Indiana, Pennsylvania, West Virginia, Kentucky, and Michigan.`
            };
        }

        case 'get_materials_by_zip': {
            const zipCode = args.zip_code || args.zip;
            const isServiced = checkServiceArea(zipCode);

            if (!isServiced) {
                return {
                    available: false,
                    materials: [],
                    message: `ZIP code ${zipCode} is outside our delivery area. We service Ohio, Indiana, Pennsylvania, West Virginia, Kentucky, and Michigan.`
                };
            }

            return {
                available: true,
                materials: MATERIALS.map(m => ({
                    id: m.id,
                    name: m.name,
                    price: m.price,
                    unit: m.unit,
                    minimum: m.minimum
                })),
                delivery_fee: DELIVERY_FEE,
                message: `We have ${MATERIALS.length} materials available for delivery to ${zipCode}. Delivery fee is $${DELIVERY_FEE}.`
            };
        }

        case 'get_material_details': {
            const { material_id } = args;
            const material = MATERIALS.find(m => m.id === Number(material_id));

            if (!material) {
                return {
                    found: false,
                    error: `Material with ID ${material_id} not found.`
                };
            }

            return {
                found: true,
                id: material.id,
                name: material.name,
                price: material.price,
                unit: material.unit,
                minimum: material.minimum,
                delivery_fee: DELIVERY_FEE,
                message: `${material.name} is $${material.price} per ${material.unit} with a minimum order of ${material.minimum} ${material.unit}${material.minimum > 1 ? 's' : ''}. Delivery is $${DELIVERY_FEE}.`
            };
        }

        case 'calculate_quantity': {
            const { length, width, depth } = args;
            // Formula: (L × W × D in inches) / 27 = cubic yards
            // If depth is in inches, convert to feet first
            const depthInFeet = depth / 12;
            const cubicFeet = length * width * depthInFeet;
            const cubicYards = cubicFeet / 27;
            const roundedYards = Math.ceil(cubicYards * 10) / 10; // Round to 1 decimal

            return {
                length_ft: length,
                width_ft: width,
                depth_in: depth,
                cubic_yards: roundedYards,
                message: `For an area ${length}' × ${width}' with ${depth}" depth, you'll need approximately ${roundedYards} cubic yards of material.`
            };
        }

        // Client tools that push commands to frontend
        case 'navigate_to': {
            const page = args.page_slug || args.page;
            if (callId) {
                addCommand(callId, {
                    type: 'NAVIGATE',
                    payload: page,
                    timestamp: Date.now()
                });
            }
            return { success: true, message: `Navigating to ${page}` };
        }

        case 'prefill_checkout_form': {
            if (callId) {
                addCommand(callId, {
                    type: 'PREFILL_FORM',
                    payload: args.fields || args,
                    timestamp: Date.now()
                });
            }
            return { success: true, message: 'Checkout form pre-filled with customer details.' };
        }

        case 'create_or_update_cart': {
            if (callId) {
                addCommand(callId, {
                    type: 'UPDATE_CART',
                    payload: args.items || args,
                    timestamp: Date.now()
                });
            }
            return { success: true, message: 'Cart updated.', cart: args };
        }

        case 'update_session_state': {
            if (callId) {
                addCommand(callId, {
                    type: 'UPDATE_SESSION',
                    payload: { key: args.key, value: args.value },
                    timestamp: Date.now()
                });
            }
            return { success: true, message: `Session state updated: ${args.key}` };
        }

        case 'get_session_state': {
            // This would need frontend to respond - for now return acknowledgment
            return { message: 'Session state request sent to client.' };
        }

        default:
            return { error: `Unknown tool: ${name}` };
    }
}
