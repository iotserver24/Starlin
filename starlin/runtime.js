// 🏃 Starlin Runtime (Client-Side)
// File: starlin/runtime.js

const state = new Proxy({}, {
    set(target, prop, value) {
        target[prop] = value;
        // Basic reactivity: re-render on state change (if desired, or wait for explicit render)
        // For this demo, we re-render after actions mostly, but this helps debug
        console.log(`State change: ${String(prop)} =`, value);
        return true;
    }
});

const api = {
    async get(endpoint) {
        const res = await fetch(`/api${endpoint}`);
        return res.json();
    },
    async post(endpoint, body) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },
    async put(endpoint, body) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },
    async delete(endpoint) {
        const res = await fetch(`/api${endpoint}`, { method: 'DELETE' });
        return res.json();
    }
};

let currentModule = null;

async function router() {
    const path = window.location.pathname;
    // Simple Convention: /foo -> src/pages/foo.js
    // / -> src/pages/index.js
    const pageName = path === '/' ? 'index' : path.substring(1);

    try {
        currentModule = await import(`/src/pages/${pageName}.js`);
        render();
    } catch (err) {
        console.error('Failed to load page:', err);
        document.getElementById('app').innerHTML = `
            <div class="container">
                <h1>404 - Page Not Found</h1>
                <p>Could not find page: src/pages/${pageName}.js</p>
                <a href="/">Go Home</a>
            </div>
        `;
    }
}

async function render() {
    if (!currentModule || !currentModule.default) return;

    const Component = currentModule.default;
    // Pass state and api to component
    try {
        const html = Component({ state, api });
        document.getElementById('app').innerHTML = html;
        attachEvents();
    } catch (err) {
        console.error('Render error:', err);
        document.getElementById('app').innerHTML = `<div style="color:red">Render Error: ${err.message}</div>`;
    }
}

function attachEvents() {
    const elements = document.querySelectorAll('[data-click]');
    elements.forEach(el => {
        el.addEventListener('click', async (e) => {
            const actionName = el.dataset.click;
            // Get data-id if present
            const id = el.dataset.id;
            // Merge dataset into event or params

            if (currentModule.actions && currentModule.actions[actionName]) {
                try {
                    await currentModule.actions[actionName]({
                        state,
                        api,
                        render,
                        event: e,
                        id
                    });
                    // Auto re-render after action
                    render();
                } catch (err) {
                    console.error(`Action ${actionName} failed:`, err);
                    alert(`Error: ${err.message}`);
                }
            } else {
                console.warn(`Action "${actionName}" not defined in page exports.`);
            }
        });
    });

    // Handle Links just to be SPA-like (optional, but good for "Back to Home")
    document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/')) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState({}, '', href);
                router();
            });
        }
    });
}

// Navigation handling
window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

// DevTools
window.Starlin = {
    state,
    api,
    debug: {
        log: () => console.log(state)
    }
};
