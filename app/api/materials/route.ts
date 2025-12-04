import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/materials?zip=12345
 * 
 * Returns available construction materials for a given ZIP code
 * Used by ElevenLabs tool: get_materials_by_zip
 */

// Material database - all materials available to all 7,802 serviced ZIP codes
const MATERIALS_DATABASE = [
  {
    id: 1,
    name: "#304 Limestone Base",
    type: "limestone",
    description: "Crushed limestone base material, excellent for road base and driveways",
    price_per_cubic_yard: 42,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 101,
  },
  {
    id: 2,
    name: "#57 Limestone / Gravel",
    type: "gravel",
    description: "Clean crushed stone, ideal for driveways, drainage, and concrete aggregate",
    price_per_cubic_yard: 45,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 102,
  },
  {
    id: 3,
    name: "#2 Stone (and #1)",
    type: "stone",
    description: "Large angular stone for drainage and erosion control",
    price_per_cubic_yard: 50,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 103,
  },
  {
    id: 4,
    name: "#8 Gravel",
    type: "gravel",
    description: "Smaller crushed stone, great for pathways, landscaping, and drainage",
    price_per_cubic_yard: 48,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 104,
  },
  {
    id: 5,
    name: "River Gravel",
    type: "gravel",
    description: "Smooth rounded river rock, perfect for decorative landscaping and drainage",
    price_per_cubic_yard: 55,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 105,
  },
  {
    id: 6,
    name: "Concrete Sand",
    type: "sand",
    description: "Washed sand for concrete mixing, masonry work, and paver bases",
    price_per_cubic_yard: 38,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 106,
  },
  {
    id: 7,
    name: "Mulch (Black)",
    type: "mulch",
    description: "Dyed black mulch for a bold, modern landscaping look",
    price_per_cubic_yard: 30,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 107,
  },
  {
    id: 8,
    name: "Topsoil (Screened)",
    type: "soil",
    description: "Premium screened topsoil for gardens, lawns, and landscaping projects",
    price_per_cubic_yard: 35,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 108,
  },
  {
    id: 9,
    name: "Pea Gravel",
    type: "gravel",
    description: "Small smooth rounded stone, perfect for decorative landscaping and pathways",
    price_per_cubic_yard: 52,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 109,
  },
  {
    id: 10,
    name: "Fill Dirt",
    type: "soil",
    description: "Unscreened fill dirt for grading, filling, and leveling large areas",
    price_per_cubic_yard: 25,
    minimum_order_cubic_yards: 2,
    delivery_fee: 75,
    product_id: 110,
  },
  {
    id: 11,
    name: "#411 Limestone",
    type: "limestone",
    description: "Fine limestone screenings, ideal for walkways, patios, and as a compactable base",
    price_per_cubic_yard: 40,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 111,
  },
  {
    id: 12,
    name: "Mulch (Brown)",
    type: "mulch",
    description: "Natural brown mulch for traditional garden beds and landscaping",
    price_per_cubic_yard: 28,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 112,
  },
  {
    id: 13,
    name: "Mulch (Red)",
    type: "mulch",
    description: "Dyed red mulch for vibrant, eye-catching garden beds",
    price_per_cubic_yard: 30,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 113,
  },
  {
    id: 14,
    name: "Mason Sand",
    type: "sand",
    description: "Fine washed sand for masonry work, mortar mixing, and sandboxes",
    price_per_cubic_yard: 35,
    minimum_order_cubic_yards: 1,
    delivery_fee: 75,
    product_id: 114,
  },
];

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
    return NextResponse.json({
      success: true,
      zip: zip,
      message: `All ${MATERIALS_DATABASE.length} materials available for delivery to ZIP ${zip}`,
      materials: MATERIALS_DATABASE.map(m => ({
        id: m.id,
        name: m.name,
        type: m.type,
        description: m.description,
        price_per_cubic_yard: m.price_per_cubic_yard,
        minimum_order: m.minimum_order_cubic_yards,
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
