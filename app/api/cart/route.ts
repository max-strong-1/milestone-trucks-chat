import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/cart
 * 
 * Adds or updates items in the cart
 * Used by ElevenLabs tool: create_or_update_cart
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, quantity, customer_notes } = body;

    // Validate required fields
    if (!product_id) {
      return NextResponse.json(
        { 
          error: "product_id required",
          message: "Please provide a product_id"
        },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { 
          error: "Invalid quantity",
          message: "Quantity must be at least 1"
        },
        { status: 400 }
      );
    }

    // TODO: Replace this mock response with actual WooCommerce REST API call
    // Example: POST https://milestonetrucks.com/wp-json/wc/v3/cart/add-item
    // Headers: { Authorization: 'Basic ' + base64(consumer_key:consumer_secret) }
    // Body: { id: product_id, quantity: quantity }

    // Mock response
    const mockResponse = {
      success: true,
      message: "Item added to cart successfully",
      cart_item_key: `mock_${product_id}_${Date.now()}`,
      product_id: product_id,
      quantity: quantity,
      customer_notes: customer_notes || null,
      item_count: quantity,
      subtotal: quantity * 45, // Mock calculation
      delivery_fee: 75,
      total: (quantity * 45) + 75
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Error in /api/cart:', error);
    return NextResponse.json(
      { 
        error: "Server error",
        message: "An error occurred while adding to cart"
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
