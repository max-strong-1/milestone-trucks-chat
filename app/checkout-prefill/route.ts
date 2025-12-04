import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/checkout-prefill
 * 
 * Saves customer information to prefill checkout form
 * Used by ElevenLabs tool: prefill_checkout_form
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, address, zip, delivery_notes } = body;

    // Validate required fields
    if (!name || !phone || !email || !address) {
      return NextResponse.json(
        { 
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
