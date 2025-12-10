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
        // We render the 404 manually without VDOM diffing for simplicity on error
        appRoot.innerHTML = `
            <div style="padding: 20px; color: red; font-family: system-ui;">
                <h1>404 - Page Not Found</h1>
                <p>Could not find page: <code>src/pages/${pageName}.js</code></p>
                <div style="background: #eee; padding: 10px; border-radius: 4px; margin: 10px 0;">
                    ${err.message}
                </div>
                <a href="/" onclick="event.preventDefault(); window.history.pushState({},'', '/'); router();" style="color: blue; text-decoration: underline;">Back to Home</a>
            </div>
        `;
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
window.addEventListener('DOMContentLoaded', router);

// DevTools
window.Starlin = {
    state,
    api,
    router,
    forceRender: render
};
