import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/material/[id]
 * 
 * Returns detailed information about a specific material
 * Used by ElevenLabs tool: get_material_details
 */

// Mock data - extended with more details
const MATERIALS_DATABASE = [
  {
    id: 1,
    name: "#57 Stone",
    type: "gravel",
    description: "Clean crushed stone, ideal for driveways and drainage",
    long_description: "Our #57 stone is a versatile, clean crushed stone that's perfect for driveways, drainage projects, and as a base material. Each stone is approximately 1/2 to 1 inch in size. This is our most popular gravel option for residential and commercial projects.",
    price_per_cubic_yard: 45,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 101,
    typical_uses: ["Driveways", "Drainage", "Walkways", "Base material", "Around foundations"],
    coverage: "1 cubic yard covers approximately 100 square feet at 3 inches deep",
    weight_per_cubic_yard: 2800,
    color: "Gray with white specks",
    stock_status: "in_stock"
  },
  {
    id: 2,
    name: "#8 Stone",
    type: "gravel",
    description: "Smaller crushed stone, great for pathways and landscaping",
    long_description: "Our #8 stone features smaller crushed stones (approximately 3/8 to 1/2 inch) that create a smooth, compact surface perfect for pathways, landscaping, and decorative applications.",
    price_per_cubic_yard: 48,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 102,
    typical_uses: ["Pathways", "Landscaping", "Decorative borders", "Garden beds"],
    coverage: "1 cubic yard covers approximately 120 square feet at 2-3 inches deep",
    weight_per_cubic_yard: 2700,
    color: "Light gray",
    stock_status: "in_stock"
  },
  {
    id: 3,
    name: "Pea Gravel",
    type: "gravel",
    description: "Smooth rounded stone, perfect for decorative landscaping",
    long_description: "Pea gravel consists of small, smooth, rounded stones that are comfortable to walk on and visually appealing. Excellent for pathways, dog runs, playgrounds, and decorative landscaping.",
    price_per_cubic_yard: 52,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405"],
    delivery_fee: 75,
    product_id: 103,
    typical_uses: ["Pathways", "Dog runs", "Playground surfaces", "Decorative landscaping", "Around plants"],
    coverage: "1 cubic yard covers approximately 120 square feet at 2-3 inches deep",
    weight_per_cubic_yard: 2600,
    color: "Mixed earth tones (tan, brown, white)",
    stock_status: "in_stock"
  },
  {
    id: 4,
    name: "Mason Sand",
    type: "sand",
    description: "Fine sand for masonry work, paver bases, and sandboxes",
    long_description: "Mason sand is a fine-grade sand perfect for masonry projects, creating smooth mortar, leveling pavers, and children's sandboxes. Clean and screened for consistency.",
    price_per_cubic_yard: 35,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 104,
    typical_uses: ["Masonry mortar", "Paver base", "Sandboxes", "Leveling", "Between pavers"],
    coverage: "1 cubic yard covers approximately 150 square feet at 2 inches deep",
    weight_per_cubic_yard: 2400,
    color: "Light tan to beige",
    stock_status: "in_stock"
  },
  {
    id: 5,
    name: "Fill Sand",
    type: "sand",
    description: "Coarse sand for filling and leveling projects",
    long_description: "Fill sand is a coarser sand ideal for large filling projects, leveling ground, and creating solid bases. More economical than mason sand for bulk applications.",
    price_per_cubic_yard: 32,
    minimum_order_cubic_yards: 2,
    available_zips: ["32401", "32402", "32403", "32404", "32405", "32407", "32408", "32409"],
    delivery_fee: 75,
    product_id: 105,
    typical_uses: ["Fill material", "Leveling", "Base layers", "Backfill", "Large projects"],
    coverage: "1 cubic yard covers approximately 130 square feet at 2-3 inches deep",
    weight_per_cubic_yard: 2500,
    color: "Brown to tan",
    stock_status: "in_stock"
  },
  {
    id: 6,
    name: "Brown Mulch",
    type: "mulch",
    description: "Natural brown mulch for garden beds and landscaping",
    long_description: "Our brown mulch is made from natural hardwood, providing excellent moisture retention and weed control. The natural brown color complements any landscape design.",
    price_per_cubic_yard: 28,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405"],
    delivery_fee: 75,
    product_id: 106,
    typical_uses: ["Garden beds", "Around trees", "Flower beds", "Erosion control", "Moisture retention"],
    coverage: "1 cubic yard covers approximately 160 square feet at 2 inches deep",
    weight_per_cubic_yard: 600,
    color: "Natural brown",
    stock_status: "in_stock"
  },
  {
    id: 7,
    name: "Black Mulch",
    type: "mulch",
    description: "Dyed black mulch for a bold landscaping look",
    long_description: "Our premium black mulch is dyed with safe, long-lasting colorant that provides a striking contrast to plants and flowers. Excellent for modern and contemporary landscapes.",
    price_per_cubic_yard: 30,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403", "32404", "32405"],
    delivery_fee: 75,
    product_id: 107,
    typical_uses: ["Modern landscapes", "Around colorful plants", "Contemporary designs", "Accent areas"],
    coverage: "1 cubic yard covers approximately 160 square feet at 2 inches deep",
    weight_per_cubic_yard: 600,
    color: "Deep black",
    stock_status: "in_stock"
  },
  {
    id: 8,
    name: "Red Mulch",
    type: "mulch",
    description: "Dyed red mulch for vibrant garden beds",
    long_description: "Our red mulch features a vibrant, eye-catching color that makes flower beds and landscaping pop. Safe, non-toxic dye that maintains color throughout the season.",
    price_per_cubic_yard: 30,
    minimum_order_cubic_yards: 1,
    available_zips: ["32401", "32402", "32403"],
    delivery_fee: 75,
    product_id: 108,
    typical_uses: ["Flower beds", "Around shrubs", "Accent areas", "Front yard landscaping"],
    coverage: "1 cubic yard covers approximately 160 square feet at 2 inches deep",
    weight_per_cubic_yard: 600,
    color: "Bright red",
    stock_status: "limited"
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
const materialId = parseInt(id);

    if (isNaN(materialId)) {
      return NextResponse.json(
        { 
          error: "Invalid material ID",
          message: "Material ID must be a number"
        },
        { status: 400 }
      );
    }

    const material = MATERIALS_DATABASE.find(m => m.id === materialId);

    if (!material) {
      return NextResponse.json(
        { 
          error: "Material not found",
          message: `No material found with ID ${materialId}`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      material: material
    });

  } catch (error) {
    console.error('Error in /api/material/[id]:', error);
    return NextResponse.json(
      { 
        error: "Server error",
        message: "An error occurred while fetching material details"
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
