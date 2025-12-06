import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

async function main() {
    const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY, // Set this in your .env
    });

    console.log("Creating client tools for Milestone Trucks agent...\n");

    // ============================================
    // TOOL 1: add_to_cart
    // ============================================
    try {
        const addToCart = await client.conversationalAi.tools.create({
            toolConfig: {
                type: "client",
                name: "add_to_cart",
                description: "Adds items to the customer's shopping cart on the website. Use when customer confirms they want to add materials to their cart.",
                parameters: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            description: "Array of items to add to cart",
                            items: {
                                type: "object",
                                properties: {
                                    product_id: {
                                        type: "string",
                                        description: "Product ID (e.g., '101' for #304 Limestone)"
                                    },
                                    quantity: {
                                        type: "number",
                                        description: "Quantity in cubic yards"
                                    },
                                    name: {
                                        type: "string",
                                        description: "Product name for display"
                                    },
                                    price: {
                                        type: "number",
                                        description: "Price per cubic yard"
                                    }
                                }
                            }
                        }
                    },
                    required: ["items"]
                },
                expects_response: false,
                execution_mode: "immediate"
            }
        });
        console.log("✅ Created add_to_cart tool:", addToCart.id);
    } catch (error) {
        console.error("❌ Failed to create add_to_cart:", error);
    }

    // ============================================
    // TOOL 2: navigate_to
    // ============================================
    try {
        const navigateTo = await client.conversationalAi.tools.create({
            toolConfig: {
                type: "client",
                name: "navigate_to",
                description: "Navigate customer to a specific page on the website. Use to send them to checkout, products page, or contact page.",
                parameters: {
                    type: "object",
                    properties: {
                        page: {
                            type: "string",
                            description: "Page slug: '/checkout', '/products', '/contact', '/about'"
                        }
                    },
                    required: ["page"]
                },
                expects_response: false,
                execution_mode: "immediate"
            }
        });
        console.log("✅ Created navigate_to tool:", navigateTo.id);
    } catch (error) {
        console.error("❌ Failed to create navigate_to:", error);
    }

    // ============================================
    // TOOL 3: prefill_checkout_form
    // ============================================
    try {
        const prefillCheckout = await client.conversationalAi.tools.create({
            toolConfig: {
                type: "client",
                name: "prefill_checkout_form",
                description: "Pre-fill the checkout form with customer information collected during the conversation. Use before navigating to checkout.",
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Customer's full name"
                        },
                        email: {
                            type: "string",
                            description: "Customer's email address"
                        },
                        phone: {
                            type: "string",
                            description: "Customer's phone number"
                        },
                        zip: {
                            type: "string",
                            description: "Delivery ZIP code"
                        },
                        address: {
                            type: "string",
                            description: "Full delivery address"
                        }
                    },
                    required: []
                },
                expects_response: false,
                execution_mode: "immediate"
            }
        });
        console.log("✅ Created prefill_checkout_form tool:", prefillCheckout.id);
    } catch (error) {
        console.error("❌ Failed to create prefill_checkout_form:", error);
    }

    // ============================================
    // TOOL 4: update_session_state
    // ============================================
    try {
        const updateSession = await client.conversationalAi.tools.create({
            toolConfig: {
                type: "client",
                name: "update_session_state",
                description: "Store information in browser session for use across pages. Use to save customer preferences, quote details, or conversation context.",
                parameters: {
                    type: "object",
                    properties: {
                        key: {
                            type: "string",
                            description: "Storage key (e.g., 'customer_name', 'quote_id', 'delivery_notes')"
                        },
                        value: {
                            type: "string",
                            description: "Value to store"
                        }
                    },
                    required: ["key", "value"]
                },
                expects_response: false,
                execution_mode: "immediate"
            }
        });
        console.log("✅ Created update_session_state tool:", updateSession.id);
    } catch (error) {
        console.error("❌ Failed to create update_session_state:", error);
    }

    console.log("\n✅ All client tools created successfully!");
}

main();
