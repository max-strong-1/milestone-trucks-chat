export interface Material {
    id: number;
    name: string;
    type?: string;
    description?: string;
    price: number; // Price per unit
    unit: string;
    minimum: number;
    delivery_fee: number;
    product_id?: number; // WooCommerce ID
}

export const DELIVERY_FEE = 75;

export const MATERIALS_DATABASE: Material[] = [
    {
        id: 1,
        name: "#304 Limestone Base",
        type: "limestone",
        description: "Crushed limestone base material, excellent for road base and driveways",
        price: 42,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 101,
    },
    {
        id: 2,
        name: "#57 Limestone / Gravel",
        type: "gravel",
        description: "Clean crushed stone, ideal for driveways, drainage, and concrete aggregate",
        price: 45,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 102,
    },
    {
        id: 3,
        name: "#2 Stone (and #1)",
        type: "stone",
        description: "Large angular stone for drainage and erosion control",
        price: 50,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 103,
    },
    {
        id: 4,
        name: "#8 Gravel",
        type: "gravel",
        description: "Smaller crushed stone, great for pathways, landscaping, and drainage",
        price: 48,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 104,
    },
    {
        id: 5,
        name: "River Gravel",
        type: "gravel",
        description: "Smooth rounded river rock, perfect for decorative landscaping and drainage",
        price: 55,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 105,
    },
    {
        id: 6,
        name: "Concrete Sand",
        type: "sand",
        description: "Washed sand for concrete mixing, masonry work, and paver bases",
        price: 38,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 106,
    },
    {
        id: 7,
        name: "Mulch (Black)",
        type: "mulch",
        description: "Dyed black mulch for a bold, modern landscaping look",
        price: 30,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 107,
    },
    {
        id: 8,
        name: "Topsoil (Screened)",
        type: "soil",
        description: "Premium screened topsoil for gardens, lawns, and landscaping projects",
        price: 35,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 108,
    },
    {
        id: 9,
        name: "Pea Gravel",
        type: "gravel",
        description: "Small smooth rounded stone, perfect for decorative landscaping and pathways",
        price: 52,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 109,
    },
    {
        id: 10,
        name: "Fill Dirt",
        type: "soil",
        description: "Unscreened fill dirt for grading, filling, and leveling large areas",
        price: 25,
        unit: 'cubic yard',
        minimum: 2,
        delivery_fee: DELIVERY_FEE,
        product_id: 110,
    },
    {
        id: 11,
        name: "#411 Limestone",
        type: "limestone",
        description: "Fine limestone screenings, ideal for walkways, patios, and as a compactable base",
        price: 40,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 111,
    },
    {
        id: 12,
        name: "Mulch (Brown)",
        type: "mulch",
        description: "Natural brown mulch for traditional garden beds and landscaping",
        price: 28,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 112,
    },
    {
        id: 13,
        name: "Mulch (Red)",
        type: "mulch",
        description: "Dyed red mulch for vibrant, eye-catching garden beds",
        price: 30,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 113,
    },
    {
        id: 14,
        name: "Mason Sand",
        type: "sand",
        description: "Fine washed sand for masonry work, mortar mixing, and sandboxes",
        price: 35,
        unit: 'cubic yard',
        minimum: 1,
        delivery_fee: DELIVERY_FEE,
        product_id: 114,
    },
];

export function getAllMaterials(): Material[] {
    return MATERIALS_DATABASE;
}

export function getMaterialById(id: number): Material | undefined {
    return MATERIALS_DATABASE.find(m => m.id === id);
}

// Helper to match legacy IDs if needed, though we should prefer the integer ID
export function getMaterialByProductId(productId: number): Material | undefined {
    return MATERIALS_DATABASE.find(m => m.product_id === productId);
}
