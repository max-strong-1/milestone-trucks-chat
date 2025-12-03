import React from 'react';
import { createRoot } from 'react-dom/client';
import RetellWidget from '../../components/RetellWidget';
import '../../app/globals.css'; // Import styles

const WIDGET_ID = 'retell-chatbot-root';

function mount() {
    let container = document.getElementById(WIDGET_ID);

    if (!container) {
        container = document.createElement('div');
        container.id = WIDGET_ID;
        document.body.appendChild(container);
    }

    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <RetellWidget />
        </React.StrictMode>
    );
}

// Auto-mount when script loads
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
}
