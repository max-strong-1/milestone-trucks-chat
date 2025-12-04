import { NextResponse } from 'next/server';
import { addCommand } from '@/lib/commandStore';
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
        case 'check_service_area': {
          const { zipCode } = args;
          const { checkServiceArea } = await import('@/lib/check-service-area');
          const isServiced = checkServiceArea(zipCode);
          
          result = {
            success: true,
            isServiced,
            message: isServiced 
              ? `ZIP ${zipCode} is in our service area` 
              : `ZIP ${zipCode} is outside our current service area. We serve Ohio, Indiana, Pennsylvania, West Virginia, Kentucky, and Michigan.`
          };
          break;
        }

        case 'get_materials_by_zip': {
          const { zip } = args;
          if (zip === '43537' || zip === '43528' || zip === '43604') {
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
        }

        case 'get_material_details': {
          const { material_id } = args;
          result = {
            name: material_id,
            price_per_yard: 45,
            description: 'High quality material for your project'
          };
          break;
        }

        case 'calculate_quantity': {
          const { length, width, depth } = args;
          const cubicFeet = length * width * (depth / 12) / 27;
          result = {
            cubic_yards: Math.ceil(cubicFeet),
            message: `You'll need approximately ${Math.ceil(cubicFeet)} cubic yards`
          };
          break;
        }

        case 'create_or_update_cart': {
          const { items } = args;
          addCommand(call_id, {
            type: 'create_or_update_cart',
            payload: { items },
            timestamp: Date.now()
          });
          result = {
            success: true,
            message: 'Cart updated successfully'
          };
          break;
        }

        case 'navigate_to': {
          const { page } = args;
          addCommand(call_id, {
            type: 'navigate_to',
            payload: { page },
            timestamp: Date.now()
          });
          result = {
            success: true,
            message: `Navigating to ${page}`
          };
          break;
        }

        case 'prefill_checkout_form': {
          const formData = args;
          addCommand(call_id, {
            type: 'prefill_checkout_form',
            payload: formData,
            timestamp: Date.now()
          });
          result = {
            success: true,
            message: 'Form prefilled successfully'
          };
          break;
        }

        case 'update_session_state': {
          const { key, value } = args;
          addCommand(call_id, {
            type: 'update_session_state',
            payload: { key, value },
            timestamp: Date.now()
          });
          result = {
            success: true,
            message: 'Session state updated'
          };
          break;
        }

        default:
          result = {
            error: `Unknown tool: ${name}`
          };
      }

      return NextResponse.json({
        response_type: 'response',
        response: result
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
