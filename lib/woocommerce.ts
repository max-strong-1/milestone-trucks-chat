import { Material } from './materials';

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || 'https://staging12.milestonetrucks.com';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_5cfc3a63730922d5db1d06cf2bc78db5a7fd4f79';
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_db6c8c2125d1ff1eb522afeb150cd066c1eae49f';

interface WooCommerceProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: string;
    description: string;
    short_description: string;
    price: string;
    regular_price: string;
    sale_price: string;
    images: { id: number; src: string; alt: string }[];
    categories: { id: number; name: string; slug: string }[];
    attributes: { id: number; name: string; options: string[] }[];
    price_html: string;
    meta_data: { key: string; value: string }[];
}

export async function fetchWooCommerceProducts(): Promise<Material[]> {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        // In build time or if keys missing, invoke fallback or return empty
        // But for debugging, we log.
        // console.warn('WooCommerce credentials missing');
        return [];
    }

    try {
        const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
        const response = await fetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/products?per_page=100&status=publish`, {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`WooCommerce API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const products: WooCommerceProduct[] = await response.json();

        return products.map(product => {
            // Logic to determine unit, delivery fee, etc. from meta_data or attributes if available
            // For now, mapping known fields and using defaults/heuristics

            const deliveryFee = 150; // Default

            // Map 'type' from category
            const type = product.categories.length > 0 ? product.categories[0].slug : 'material';

            // Map 'unit' - check for common units
            let unit = 'cubic yard'; // Default
            if (product.name.toLowerCase().includes('pallet')) unit = 'pallet';
            if (product.name.toLowerCase().includes('bag')) unit = 'bag';
            if (product.name.toLowerCase().includes('ton')) unit = 'ton';

            return {
                id: product.id,
                name: product.name,
                type: type,
                description: product.short_description.replace(/<[^>]*>?/gm, '') || product.description.replace(/<[^>]*>?/gm, ''), // strip HTML
                price: parseFloat(product.price || '0'),
                unit: unit,
                minimum: 1, // Default
                delivery_fee: deliveryFee,
                product_id: product.id
            };
        });
    } catch (error) {
        console.error('Failed to fetch WooCommerce products:', error);
        return [];
    }
}
