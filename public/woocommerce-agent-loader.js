/**
 * Milestone Trucks Voice Agent Integration
 * Copy this entire script into your WordPress site (Elementor Custom Code -> Footer).
 */
(function () {
    // CONFIGURATION
    const AGENT_API = 'https://milestone-trucks-chat.vercel.app';
    const POLL_INTERVAL = 1000; // Check every 1 second

    let callId = null;
    let pollTimer = null;

    // --- CORE FUNCTIONS ---

    // 1. Start Polling
    function startAgent(id) {
        if (callId === id) return; // Already running
        console.log('[VoiceAgent] Connected. Call ID:', id);
        callId = id;
        pollTimer = setInterval(pollCommands, POLL_INTERVAL);
    }

    // 2. Stop Polling
    function stopAgent() {
        if (callId) {
            console.log('[VoiceAgent] Disconnected.');
            callId = null;
            clearInterval(pollTimer);
        }
    }

    // 3. Poll for Commands
    function pollCommands() {
        if (!callId) return;

        fetch(`${AGENT_API}/api/elevenlabs/commands?call_id=${callId}`)
            .then(res => res.json())
            .then(data => {
                const commands = data.commands || [];
                commands.forEach(cmd => executeCommand(cmd));
            })
            .catch(err => console.error('[VoiceAgent] Poll error:', err));
    }

    // 4. Command Router
    function executeCommand(cmd) {
        console.log('[VoiceAgent] Executing:', cmd.type, cmd.payload);

        switch (cmd.type) {
            case 'NAVIGATE':
                doNavigate(cmd.payload);
                break;
            case 'UPDATE_CART':
                doUpdateCart(cmd.payload);
                break;
            case 'PREFILL_FORM':
                doPrefillForm(cmd.payload);
                break;
            case 'UPDATE_SESSION':
                doUpdateSession(cmd.payload);
                break;
        }
    }

    // --- ACTION HANDLERS ---

    // Handler: Navigate
    function doNavigate(slug) {
        // Handle root/home or clean slugs
        const url = slug === '/' ? '/' : `/${slug.replace(/^\//, '')}/`;
        window.location.href = url;
    }

    // Handler: Update Cart (Standard WooCommerce)
    function doUpdateCart(payload) {
        // Uses the standard "?add-to-cart=ID&quantity=QTY" URL pattern
        // This triggers a page reload which adds the item.
        // It's the most robust way without custom AJAX.
        const productId = payload.product_id;
        const qty = payload.quantity || 1;

        if (!productId) return console.warn('[VoiceAgent] No product ID for cart.');

        // Redirect to self with add-to-cart params
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('add-to-cart', productId);
        currentUrl.searchParams.set('quantity', qty);

        window.location.href = currentUrl.toString();
    }

    // Handler: Prefill Form
    function doPrefillForm(data) {
        // 1. Save to Storage (for persistence across pages)
        localStorage.setItem('voice_agent_user_data', JSON.stringify(data));

        // 2. Try to fill right now (if we are on checkout)
        fillCheckoutFields(data);
    }

    // Handler: Session State
    function doUpdateSession(payload) {
        localStorage.setItem(`voice_agent_session_${payload.key}`, payload.value);
    }

    // --- HELPER: Form Filling Logic ---
    function fillCheckoutFields(data) {
        if (!data) return;

        // Map common keys to standard WooCommerce checkout field IDs
        // field IDs are usually "billing_first_name", "billing_email", etc.
        const fieldMap = {
            'first_name': 'billing_first_name',
            'last_name': 'billing_last_name',
            'email': 'billing_email',
            'phone': 'billing_phone',
            'address': 'billing_address_1',
            'city': 'billing_city',
            'state': 'billing_state',
            'zip': 'billing_postcode',
            'postcode': 'billing_postcode'
        };

        let filledAny = false;

        Object.entries(data).forEach(([key, value]) => {
            const fieldId = fieldMap[key] || `billing_${key}`;
            const input = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);

            if (input) {
                input.value = value;
                // Trigger events so validation/UI updates happen
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                filledAny = true;
            }
        });

        if (filledAny) console.log('[VoiceAgent] Form fields filled.');
    }

    // --- INITIALIZATION ---

    // A. Listen for Widget Events (ElevenLabs / Retell)
    document.addEventListener('elevenlabs-convai:call-start', e => startAgent(e.detail?.callId || 'default'));
    document.addEventListener('elevenlabs-convai:call-end', stopAgent);

    // B. Check for stored data to autofill (e.g. if we just navigated to checkout)
    window.addEventListener('load', () => {
        const storedData = localStorage.getItem('voice_agent_user_data');
        if (storedData) {
            try {
                fillCheckoutFields(JSON.parse(storedData));
            } catch (e) { }
        }
    });

    // C. Expose global for manual testing
    window.VoiceAgent = {
        start: startAgent,
        stop: stopAgent
    };

    console.log('[VoiceAgent] Script Loaded. Waiting for call...');

})();
