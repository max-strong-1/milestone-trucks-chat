import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/checkout-prefill
 * 
 * Saves customer information to prefill checkout form via GET request with query parameters
 * Used by ElevenLabs webhook tool: prefill_checkout_form
 * 
 * Query Parameters:
 * - name: Customer full name (required)
 * - email: Customer email address (required)
 * - phone: Customer phone number (required)
 * - address: Customer street address (required)
 * - zip: ZIP code (optional)
 * - delivery_notes: Special delivery instructions (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const address = searchParams.get('address');
    const zip = searchParams.get('zip');
    const delivery_notes = searchParams.get('delivery_notes');
    
    // Validate required fields
    if (!name || !phone || !email || !address) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields",
          message: "name, phone, email, and address are required"
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid email",
          message: "Please provide a valid email address"
        },
        { status: 400 }
      );
    }

    // Validate phone format (basic check for 10+ digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid phone",
          message: "Please provide a valid phone number"
        },
        { status: 400 }
      );
    }

    // TODO: Replace this mock response with actual storage mechanism
    // Options:
    // 1. Store in WordPress session API
    // 2. Store in Redis/database with session token
    // 3. Store in WordPress wp_options table with unique key
    // 4. Pass directly to WooCommerce checkout via URL parameters

    // Mock response
    const mockResponse = {
      success: true,
      message: "Customer information saved successfully",
      saved_data: {
        name,
        phone,
        email,
        address,
        zip: zip || null,
        delivery_notes: delivery_notes || null,
        saved_at: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Error in /api/checkout-prefill:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Server error",
        message: "An error occurred while saving customer information"
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/checkout-prefill
 * 
 * Saves customer information to prefill checkout form via POST request with JSON body
 * Kept for backward compatibility with client-side tools
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, zip, delivery_notes } = body;

    // Validate required fields
    if (!name || !phone || !email || !address) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields",
          message: "name, phone, email, and address are required"
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid email",
          message: "Please provide a valid email address"
        },
        { status: 400 }
      );
    }

    // Validate phone format (basic check for 10+ digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid phone",
          message: "Please provide a valid phone number"
        },
        { status: 400 }
      );
    }

    // TODO: Replace this mock response with actual storage mechanism
    // Options:
    // 1. Store in WordPress session API
    // 2. Store in Redis/database with session token
    // 3. Store in WordPress wp_options table with unique key
    // 4. Pass directly to WooCommerce checkout via URL parameters

    // Mock response
    const mockResponse = {
      success: true,
      message: "Customer information saved successfully",
      saved_data: {
        name,
        phone,
        email,
        address,
        zip: zip || null,
        delivery_notes: delivery_notes || null,
        saved_at: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Error in /api/checkout-prefill:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Server error",
        message: "An error occurred while saving customer information"
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
