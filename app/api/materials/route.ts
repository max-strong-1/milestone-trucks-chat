import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/materials?zip=12345
 * 
 * Returns available construction materials for a given ZIP code
 * Used by ElevenLabs tool: get_materials_by_zip
 */

// Mock data - replace with real WordPress/WooCommerce query later
const MATERIALS_DATABASE = [
  {
    id: 1,
    name: "#57 Stone",
    type: "gravel",
    description: "Clean crushed stone, ideal for driveways and drainage",
    price_per_cubic_yard: 45,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 101,
  },
  {
    id: 2,
    name: "#8 Stone",
    type: "gravel",
    description: "Smaller crushed stone, great for pathways and landscaping",
    price_per_cubic_yard: 48,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 102,
  },
  {
    id: 3,
    name: "Pea Gravel",
    type: "gravel",
    description: "Smooth rounded stone, perfect for decorative landscaping",
    price_per_cubic_yard: 52,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405"],
    delivery_fee: 75,
    product_id: 103,
  },
  {
    id: 4,
    name: "Mason Sand",
    type: "sand",
    description: "Fine sand for masonry work, paver bases, and sandboxes",
    price_per_cubic_yard: 35,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 104,
  },
  {
    id: 5,
    name: "Fill Sand",
    type: "sand",
    description: "Coarse sand for filling and leveling projects",
    price_per_cubic_yard: 32,
    minimum_order_cubic_yards: 2,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 105,
  },
  {
    id: 6,
    name: "Brown Mulch",
    type: "mulch",
    description: "Natural brown mulch for garden beds and landscaping",
    price_per_cubic_yard: 28,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405"],
    delivery_fee: 75,
    product_id: 106,
  },
  {
    id: 7,
    name: "Black Mulch",
    type: "mulch",
    description: "Dyed black mulch for a bold landscaping look",
    price_per_cubic_yard: 30,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405"],
    delivery_fee: 75,
    product_id: 107,
  },
  {
    id: 8,
    name: "Red Mulch",
    type: "mulch",
    description: "Dyed red mulch for vibrant garden beds",
    price_per_cubic_yard: 30,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403"],
    delivery_fee: 75,
    product_id: 108,
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

    const availableMaterials = MATERIALS_DATABASE.filter(material => 
      material.available_zips.includes(zip)
    );

    if (availableMaterials.length === 0) {
      return NextResponse.json({
        success: true,
        zip: zip,
        message: "Sorry, we don't currently deliver to this ZIP code. We serve Panama City and surrounding areas (ZIP codes: 32401-32409).",
        materials: [],
        service_area: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"]
      });
    }

    return NextResponse.json({
      success: true,
      zip: zip,
      message: `Found ${availableMaterials.length} materials available for delivery to ZIP ${zip}`,
      materials: availableMaterials.map(m => ({
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
