/**
 * Milestone Trucks Voice Agent Integration (Strict Safe Version)
 * Copy this entire script into your WordPress site (Elementor Custom Code -> Footer).
 */
(function () {
    // CONFIGURATION
    var AGENT_API = 'https://milestone-trucks-chat.vercel.app';
    var POLL_INTERVAL = 1000;

    var callId = null;
    var pollTimer = null;

    // --- CORE FUNCTIONS ---

    function startAgent(id) {
        if (callId === id) return;
        console.log('[VoiceAgent] Connected. Call ID:', id);
        callId = id;
        pollTimer = setInterval(pollCommands, POLL_INTERVAL);
    }

    function stopAgent() {
        if (callId) {
            console.log('[VoiceAgent] Disconnected.');
            callId = null;
            clearInterval(pollTimer);
        }
    }

    function pollCommands() {
        if (!callId) return;
        fetch(AGENT_API + '/api/elevenlabs/commands?call_id=' + callId)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                var commands = data.commands || [];
                commands.forEach(function (cmd) { executeCommand(cmd); });
            })
            .catch(function (err) { console.error('[VoiceAgent] Poll error:', err); });
    }

    function executeCommand(cmd) {
        console.log('[VoiceAgent] Executing:', cmd.type, cmd.payload);
        switch (cmd.type) {
            case 'NAVIGATE': doNavigate(cmd.payload); break;
            case 'UPDATE_CART': doUpdateCart(cmd.payload); break;
            case 'PREFILL_FORM': doPrefillForm(cmd.payload); break;
            case 'UPDATE_SESSION': doUpdateSession(cmd.payload); break;
        }
    }

    // --- HANDLERS ---

    function doNavigate(slug) {
        // Remove leading slash using substring instead of regex
        var clean = (slug.charAt(0) === '/') ? slug.substring(1) : slug;
        var safeSlug = (slug === '/') ? '/' : '/' + clean + '/';
        window.location.href = safeSlug;
    }

    function doUpdateCart(payload) {
        var productId = payload.product_id;
        var qty = payload.quantity || 1;
        if (!productId) { console.warn('[VoiceAgent] No product ID'); return; }

        if (typeof URL !== 'undefined') {
            var currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('add-to-cart', productId);
            currentUrl.searchParams.set('quantity', qty);
            window.location.href = currentUrl.toString();
        } else {
            // Use \x26 for ampersand and \x3F for question mark to avoid parser issues
            var sep = window.location.href.indexOf('?') === -1 ? '\x3F' : '\x26';
            window.location.href = window.location.href + sep + 'add-to-cart=' + productId + '\x26quantity=' + qty;
        }
    }

    function doPrefillForm(data) {
        if (window.localStorage) {
            localStorage.setItem('voice_agent_user_data', JSON.stringify(data));
        }
        fillCheckoutFields(data);
    }

    function doUpdateSession(payload) {
        if (window.localStorage) {
            localStorage.setItem('voice_agent_session_' + payload.key, payload.value);
        }
    }

    function fillCheckoutFields(data) {
        if (!data) return;
        var fieldMap = {
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
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            var fieldId = fieldMap[key] || ('billing_' + key);

            // Use getElementById and getElementsByName to avoid complex query selectors
            var input = document.getElementById(fieldId);
            if (!input) {
                var byName = document.getElementsByName(fieldId);
                if (byName && byName.length > 0) input = byName[0];
            }

            if (input) {
                input.value = value;
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    input.dispatchEvent(evt);
                } else {
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    }

    document.addEventListener('elevenlabs-convai:call-start', function (e) {
        startAgent((e.detail && e.detail.callId) ? e.detail.callId : 'default');
    });
    document.addEventListener('elevenlabs-convai:call-end', stopAgent);

    window.addEventListener('load', function () {
        if (window.localStorage) {
            var d = localStorage.getItem('voice_agent_user_data');
            if (d) { try { fillCheckoutFields(JSON.parse(d)); } catch (e) { } }
        }
    });

    console.log('[VoiceAgent] Script Loaded');
})();
