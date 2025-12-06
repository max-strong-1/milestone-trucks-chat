import { fetchWooCommerceProducts } from './woocommerce';

export interface Material {
    id: number;
    name: string;
    type: string;
    description: string;
    price: number;
    unit: string;
    minimum: number;
    delivery_fee: number;
    product_id: number;
}

export const DELIVERY_FEE = 150;

// Internal cache to avoid fetching on every simple lookup if possible, 
// though Next.js fetch cache handles it too. 
// We will rely on fetch cache for now.

export async function getAllMaterials(): Promise<Material[]> {
    return await fetchWooCommerceProducts();
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
    const materials = await getAllMaterials();
    return materials.find(m => m.id === id);
}

// Helper to match legacy IDs if needed, though we should prefer the integer ID
export async function getMaterialByProductId(productId: number): Promise<Material | undefined> {
    const materials = await getAllMaterials();
    return materials.find(m => m.product_id === productId);
}
