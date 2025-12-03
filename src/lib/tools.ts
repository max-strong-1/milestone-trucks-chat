export const tools = [
    {
        type: "function",
        name: "navigate_to",
        description: "Navigate the user to a specific page on the website.",
        parameters: {
            type: "object",
            properties: {
                page_slug: {
                    type: "string",
                    description: "The slug of the page to navigate to (e.g., '/checkout', '/products/gravel').",
                },
            },
            required: ["page_slug"],
        },
    },
    {
        type: "function",
        name: "get_materials_by_zip",
        description: "Get a list of available materials for a specific ZIP code.",
        parameters: {
            type: "object",
            properties: {
                zip: {
                    type: "string",
                    description: "The 5-digit ZIP code.",
                },
            },
            required: ["zip"],
        },
    },
    {
        type: "function",
        name: "get_material_details",
        description: "Get detailed specifications for a specific material.",
        parameters: {
            type: "object",
            properties: {
                material_id: {
                    type: "string",
                    description: "The ID of the material.",
                },
            },
            required: ["material_id"],
        },
    },
    {
        type: "function",
        name: "calculate_quantity",
        description: "Calculate the required quantity of material based on dimensions.",
        parameters: {
            type: "object",
            properties: {
                length: { type: "number", description: "Length in feet." },
                width: { type: "number", description: "Width in feet." },
                depth: { type: "number", description: "Depth in inches." },
                material: { type: "string", description: "Material name or ID." },
            },
            required: ["length", "width", "depth", "material"],
        },
    },
    {
        type: "function",
        name: "create_or_update_cart",
        description: "Add or update items in the user's cart.",
        parameters: {
            type: "object",
            properties: {
                material_id: { type: "string" },
                quantity: { type: "number" },
                zip: { type: "string" },
                delivery_time: { type: "string" },
            },
            required: ["material_id", "quantity", "zip"],
        },
    },
    {
        type: "function",
        name: "prefill_checkout_form",
        description: "Pre-fill the checkout form with user details.",
        parameters: {
            type: "object",
            properties: {
                fields: {
                    type: "object",
                    description: "Key-value pairs of field names and values.",
                },
            },
            required: ["fields"],
        },
    },
    {
        type: "function",
        name: "update_session_state",
        description: "Update a value in the session state.",
        parameters: {
            type: "object",
            properties: {
                key: { type: "string" },
                value: { type: "string" },
            },
            required: ["key", "value"],
        },
    },
    {
        type: "function",
        name: "get_session_state",
        description: "Retrieve a value from the session state.",
        parameters: {
            type: "object",
            properties: {
                key: { type: "string" },
            },
            required: ["key"],
        },
    },
    {
        type: "function",
        name: "get_alternate_zip_material",
        description: "Find availability of a material in a nearby ZIP code if not available in the primary one.",
        parameters: {
            type: "object",
            properties: {
                material: { type: "string" },
            },
            required: ["material"],
        },
    },
];
