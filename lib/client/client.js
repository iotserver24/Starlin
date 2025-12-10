// Starlin Client Runtime
// Handles client-side routing and rendering

const state = new Proxy({}, {
    set(target, prop, value) {
        target[prop] = value;
        // Re-render on state change
        console.log(`State change: ${String(prop)} =`, value);
        render(); // Simple reactivity
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
        // Note: usage of .js extension is assumed
        currentModule = await import(`/src/pages/${pageName}.js`);
        render();
    } catch (err) {
        console.error('Failed to load page:', err);
        appRoot.innerHTML = `
            <div style="padding: 20px; color: red;">
                <h1>404 - Page Not Found</h1>
                <p>Could not find page: src/pages/${pageName}.js</p>
                <code style="background: #eee; padding: 5px;">${err.message}</code>
                <br><br>
                <a href="/" onclick="event.preventDefault(); window.history.pushState({},'', '/'); router();" style="color: blue; text-decoration: underline;">Back to Home</a>
            </div>
        `;
    }
}

function render() {
    if (!currentModule || !currentModule.default) return;

    const Component = currentModule.default;

    try {
        const html = Component({ state, api });
        appRoot.innerHTML = html;
        attachEvents();
    } catch (err) {
        console.error('Render error:', err);
        appRoot.innerHTML = `<div style="color:red">Render Error: ${err.message}</div>`;
    }
}

function attachEvents() {
    // Handle data-click
    const elements = document.querySelectorAll('[data-click]');
    elements.forEach(el => {
        el.addEventListener('click', async (e) => {
            const actionName = el.dataset.click;
            const id = el.dataset.id;

            if (currentModule.actions && currentModule.actions[actionName]) {
                try {
                    await currentModule.actions[actionName]({
                        state,
                        api,
                        event: e,
                        id
                    });
                    // render() is called by state proxy if state changes, but we force it here just in case action didn't update state but wants redraw?
                    // Actually let's rely on state proxy or manual render call if needed. 
                    // But for the simple "increment" example, state update triggers render.
                } catch (err) {
                    console.error(`Action ${actionName} failed:`, err);
                    alert(`Error: ${err.message}`);
                }
            } else {
                console.warn(`Action "${actionName}" not defined in page exports.`);
            }
        });
    });

    // Handle Links for SPA navigation
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
    router
};
