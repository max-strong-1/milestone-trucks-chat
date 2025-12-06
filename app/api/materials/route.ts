import { NextRequest, NextResponse } from 'next/server';
import { getAllMaterials, DELIVERY_FEE } from '@/lib/materials';

/**
 * GET /api/materials?zip=12345
 * 
 * Returns available construction materials for a given ZIP code
 * Used by ElevenLabs tool: get_materials_by_zip
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zip = searchParams.get('zip');

    if (!zip) {
      return NextResponse.json(
        {
          error: "ZIP code required",
          message: "Please provide a 5-digit ZIP code as a query parameter"
        },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json(
        {
          error: "Invalid ZIP code format",
          message: "ZIP code must be exactly 5 digits"
        },
        { status: 400 }
      );
    }

    // Check if ZIP is in our service area
    const { checkServiceArea } = await import('@/lib/check-service-area');
    const isServiced = checkServiceArea(zip);

    if (!isServiced) {
      return NextResponse.json({
        success: false,
        zip: zip,
        message: "Sorry, we don't currently deliver to this ZIP code. We serve Northwest Ohio and surrounding areas.",
        materials: [],
        service_area_info: "We deliver to 7,802 ZIP codes across our service region. Please contact us to confirm availability."
      });
    }

    // All materials available to all serviced ZIPs
    const materials = await getAllMaterials();

    return NextResponse.json({
      success: true,
      zip: zip,
      message: `All ${materials.length} materials available for delivery to ZIP ${zip}`,
      materials: materials.map(m => ({
        id: m.id,
        name: m.name,
        type: m.type,
        description: m.description,
        price_per_cubic_yard: m.price,
        minimum_order: m.minimum,
        delivery_fee: m.delivery_fee,
        product_id: m.product_id
      }))
    });

  } catch (error) {
    console.error('Error in /api/materials:', error);
    return NextResponse.json(
      {
        error: "Server error",
        message: "An error occurred while fetching materials"
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

