import { NextRequest, NextResponse } from 'next/server';

// Mock material data
const mockMaterials = [
  {
    id: 1,
    name: 'Premium Concrete Mix',
    type: 'concrete',
    price_per_cubic_yard: 125.00,
    minimum_order_cubic_yards: 1.0,
    delivery_fee: 75.00
  },
  {
    id: 2,
    name: 'Standard Concrete Mix',
    type: 'concrete',
    price_per_cubic_yard: 95.00,
    minimum_order_cubic_yards: 1.0,
    delivery_fee: 75.00
  },
  {
    id: 3,
    name: 'Washed River Rock',
    type: 'aggregate',
    price_per_cubic_yard: 45.00,
    minimum_order_cubic_yards: 2.0,
    delivery_fee: 50.00
  },
  {
    id: 4,
    name: 'Crushed Limestone',
    type: 'aggregate',
    price_per_cubic_yard: 38.00,
    minimum_order_cubic_yards: 2.0,
    delivery_fee: 50.00
  },
  {
    id: 5,
    name: 'Pea Gravel',
    type: 'aggregate',
    price_per_cubic_yard: 42.00,
    minimum_order_cubic_yards: 2.0,
    delivery_fee: 50.00
  },
  {
    id: 6,
    name: 'Topsoil Premium Grade',
    type: 'soil',
    price_per_cubic_yard: 35.00,
    minimum_order_cubic_yards: 3.0,
    delivery_fee: 50.00
  },
  {
    id: 7,
    name: 'Fill Dirt',
    type: 'soil',
    price_per_cubic_yard: 25.00,
    minimum_order_cubic_yards: 5.0,
    delivery_fee: 50.00
  },
  {
    id: 8,
    name: 'Mulch - Cypress Blend',
    type: 'mulch',
    price_per_cubic_yard: 32.00,
    minimum_order_cubic_yards: 2.0,
    delivery_fee: 40.00
  }
];

/**
 * GET /api/cart
 * 
 * Handles cart operations via GET request with query parameters
 * Used by ElevenLabs webhook tool: add_to_cart
 * 
 * Query Parameters:
 * - action: "add" (required)
 * - material_id: Material ID from 1-8 (required for add)
 * - quantity: Quantity in cubic yards (required for add)
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const material_id = searchParams.get('material_id');
    const quantity = searchParams.get('quantity');
    
    // Convert to proper types
    const materialId = material_id ? parseInt(material_id) : null;
    const qty = quantity ? parseFloat(quantity) : null;

    // Validate action
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    if (action === 'add') {
      // Validate required fields for add action
      if (!materialId || !qty) {
        return NextResponse.json(
          { success: false, error: 'material_id and quantity are required for add action' },
          { status: 400 }
        );
      }

      // Find the material
      const material = mockMaterials.find(m => m.id === materialId);
      
      if (!material) {
        return NextResponse.json(
          { success: false, error: 'Material not found' },
          { status: 404 }
        );
      }

      // Check minimum order
      if (qty < material.minimum_order_cubic_yards) {
        return NextResponse.json(
          {
            success: false,
            error: `Minimum order for ${material.name} is ${material.minimum_order_cubic_yards} cubic yards`
          },
          { status: 400 }
        );
      }

      // Calculate totals
      const materialTotal = material.price_per_cubic_yard * qty;
      const deliveryFee = material.delivery_fee;
      const subtotal = materialTotal + deliveryFee;
      const tax = subtotal * 0.07; // 7% tax
      const total = subtotal + tax;

      const cartItem = {
        material_id: materialId,
        name: material.name,
        type: material.type,
        quantity: qty,
        price_per_cubic_yard: material.price_per_cubic_yard,
        material_total: materialTotal,
        delivery_fee: deliveryFee
      };

      return NextResponse.json({
        success: true,
        message: `Added ${qty} cubic yards of ${material.name} to cart`,
        cart: {
          items: [cartItem],
          subtotal,
          tax,
          total,
          estimated_delivery: '2-3 business days'
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * 
 * Handles cart operations via POST request with JSON body
 * Kept for backward compatibility with client-side tools
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, material_id, quantity } = body;

    // Validate action
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    if (action === 'add') {
      // Validate required fields
      if (!material_id || !quantity) {
        return NextResponse.json(
          { success: false, error: 'material_id and quantity are required for add action' },
          { status: 400 }
        );
      }

      // Find the material
      const material = mockMaterials.find(m => m.id === material_id);
      
      if (!material) {
        return NextResponse.json(
          { success: false, error: 'Material not found' },
          { status: 404 }
        );
      }

      // Check minimum order
      if (quantity < material.minimum_order_cubic_yards) {
        return NextResponse.json(
          {
            success: false,
            error: `Minimum order for ${material.name} is ${material.minimum_order_cubic_yards} cubic yards`
          },
          { status: 400 }
        );
      }

      // Calculate totals
      const materialTotal = material.price_per_cubic_yard * quantity;
      const deliveryFee = material.delivery_fee;
      const subtotal = materialTotal + deliveryFee;
      const tax = subtotal * 0.07; // 7% tax
      const total = subtotal + tax;

      const cartItem = {
        material_id,
        name: material.name,
        type: material.type,
        quantity,
        price_per_cubic_yard: material.price_per_cubic_yard,
        material_total: materialTotal,
        delivery_fee: deliveryFee
      };

      return NextResponse.json({
        success: true,
        message: `Added ${quantity} cubic yards of ${material.name} to cart`,
        cart: {
          items: [cartItem],
          subtotal,
          tax,
          total,
          estimated_delivery: '2-3 business days'
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
