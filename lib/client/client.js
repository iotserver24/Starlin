// Starlin Client Runtime
// Handles client-side routing, rendering, and state

import { diff, stringToDOM } from '/starlin-client/dom.js';
import { showError } from '/starlin-client/error-overlay.js';

const state = new Proxy({}, {
    set(target, prop, value) {
        target[prop] = value;
        // Re-render on state change
        // console.log(`State change: ${String(prop)} =`, value);
        render(); // Efficient VDOM re-render
        return true;
    }
});

const api = {
    async get(endpoint) {
        try {
            const res = await fetch(`/api${endpoint}`);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
        } catch (e) {
            showError('API Error', `Failed to fetch ${endpoint}`, e.message);
            throw e;
        }
    },
    async post(endpoint, body) {
        try {
            const res = await fetch(`/api${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
        } catch (e) {
            showError('API Error', `POST ${endpoint} failed`, e.message);
            throw e;
        }
    },
    async put(endpoint, body) {
        try {
            const res = await fetch(`/api${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
        } catch (e) {
            showError('API Error', `PUT ${endpoint} failed`, e.message);
            throw e;
        }
    },
    async delete(endpoint) {
        try {
            const res = await fetch(`/api${endpoint}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
        } catch (e) {
            showError('API Error', `DELETE ${endpoint} failed`, e.message);
            throw e;
        }
    }
};

let currentModule = null;
const appRoot = document.getElementById('app');

async function router() {
    const path = window.location.pathname;
    // Simple Convention: / -> index, /about -> about
    let pageName = path === '/' ? 'index' : path.substring(1);

    // Remove trailing slash if present
    if (pageName.length > 1 && pageName.endsWith('/')) {
        pageName = pageName.slice(0, -1);
    }

    try {
        // Dynamic import of page component
        currentModule = await import(`/src/pages/${pageName}.js`);
        render();
    } catch (err) {
        console.error('Failed to load page:', err);
        render404(pageName, err);
    }
}



function render() {
    if (!currentModule || !currentModule.default) return;

    try {
        const Component = currentModule.default;
        const html = Component({ state, api });

        // VDOM MAGIC HERE ✨
        // 1. Convert new HTML string to a DOM structure (Template)
        const templateDOM = stringToDOM(html);

        // 2. Diff and Patch the real DOM
        // If appRoot is empty, just append
        if (appRoot.children.length === 0) {
            appRoot.appendChild(templateDOM);
        } else {
            // We assume the component returns a SINGLE root element.
            // If not, our current diff implementation might struggle (it diffs one node against one node).
            // Starlin convention: Component must return one root element (like React).
            diff(templateDOM, appRoot.firstElementChild);
        }

        // 3. Re-attach global event listener delegation? 
        // Actually, with VDOM, we lose the 'innerHTML' nuclear wipe.
        // Elements that were PRESERVED keep their event listeners?
        // Wait, earlier I was attaching listeners to *new* elements using querySelectorAll on appRoot and doing el.onclick = ...
        // If I replace a node, the new node needs listeners.
        // If I update text, the old node keeps listeners.
        // The simplest "Easy" way is to use Event Delegation on the root, so we don't need to re-attach listeners on every render!

    } catch (err) {
        console.error('Render error:', err);
        showError('Render Error', err.message, err.stack);
    }
}

// Global Event Delegation (Better Performance & Simpler)
// Instead of attaching to every button on every render
appRoot.addEventListener('click', async (e) => {
    // Find closest element with data-click
    const target = e.target.closest('[data-click]');
    if (!target) return;

    const actionName = target.dataset.click;
    const id = target.dataset.id;

    if (currentModule.actions && currentModule.actions[actionName]) {
        try {
            await currentModule.actions[actionName]({
                state,
                api,
                event: e,
                id
            });
            // State proxy triggers render, but if action is async and no state change happens immediately?
            // User might want to force render?
            // Usually state change is enough.
        } catch (err) {
            console.error(`Action ${actionName} failed:`, err);
            showError(`Action Error: ${actionName}`, err.message, err.stack);
        }
    } else {
        console.warn(`Action "${actionName}" not defined in page exports.`);
    }
});

// Handle Links for SPA navigation
document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/')) {
            e.preventDefault();
            window.history.pushState({}, '', href);
            router();
        }
    }
});

// Navigation handling
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Environment Variables
    try {
        const res = await fetch('/_starlin/env');
        const env = await res.json();
        window.STARLIN_ENV = env;
    } catch (e) {
        console.warn('Failed to load Starlin environment vars');
        window.STARLIN_ENV = { PROD: false };
    }

    // 2. Start Router
    router();
});

function render404(pageName, err) {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isProd = window.STARLIN_ENV && window.STARLIN_ENV.PROD;

    // ... (Styles same as before)
    const styles = {
        container: `
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: ${isDark ? '#09090b' : '#ffffff'};
            color: ${isDark ? '#fafafa' : '#09090b'};
            padding: 1rem;
        `,
        card: `
            max-width: 28rem;
            width: 100%;
            padding: 2.5rem;
            text-align: center;
            border-radius: 0.5rem;
            border: 1px solid ${isDark ? '#27272a' : '#e4e4e7'};
            background: ${isDark ? '#09090b' : '#ffffff'};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        `,
        button: `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            height: 2.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
            background-color: ${isDark ? '#fafafa' : '#18181b'};
            color: ${isDark ? '#18181b' : '#fafafa'};
            text-decoration: none;
            margin-top: 1.5rem;
            transition: opacity 0.2s;
            cursor: pointer;
            border: none;
        `
    };

    const detailsBlock = isProd ? '' : `
        <div style="margin-bottom: 2rem; padding: 1rem; background: ${isDark ? '#18181b' : '#f4f4f5'}; border-radius: 0.5rem; text-align: left;">
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: ${isDark ? '#71717a' : '#a1a1aa'}; margin-bottom: 0.5rem;">Dev Error Details</div>
            <code style="font-family: monospace; font-size: 0.875rem; color: #ef4444; word-break: break-all;">
                src/pages/${pageName}.js
            </code>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: ${isDark ? '#a1a1aa' : '#71717a'};">
                ${err.message}
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.7rem; color: ${isDark ? '#52525b' : '#a1a1aa'}; border-top: 1px solid ${isDark ? '#27272a' : '#e4e4e7'}; padding-top: 0.5rem;">
                Set <code style="background:transparent;color:inherit;padding:0;">PROD=true</code> in .env to hide this.
            </div>
        </div>
    `;

    appRoot.innerHTML = `
        <div style="${styles.container}">
            <div style="${styles.card}">
                <div style="font-size: 4rem; font-weight: 800; line-height: 1; letter-spacing: -0.05em; margin-bottom: 1rem;">404</div>
                <h2 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 1rem 0; letter-spacing: -0.025em;">Page not found</h2>
                <p style="color: ${isDark ? '#a1a1aa' : '#71717a'}; margin-bottom: 1.5rem; line-height: 1.5;">
                    ${isProd ? "We're sorry, the page you requested could not be found. Please go back to the homepage." : "Sorry, we couldn't find the page you're looking for."}
                </p>
                ${detailsBlock}
                <a href="/" id="starlin-home-link" style="${styles.button}">
                    Back to Home
                </a>
            </div>
        </div>
    `;

    // ... Event listener matches previous implementation
    document.getElementById('starlin-home-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/');
        router();
    });
}
// DevTools
window.Starlin = {
    state,
    api,
    router,
    forceRender: render
};
