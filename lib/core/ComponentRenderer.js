/**
 * COMPONENT RENDERER
 * Renders React-style components to DOM
 */

class ComponentRenderer {
    constructor(starlin) {
        this.starlin = starlin;
        this.rootElement = null;
    }

    // Set root element
    setRoot(selector) {
        if (typeof document !== 'undefined') {
            this.rootElement = document.querySelector(selector);
        }
    }

    // Render a component
    render(route) {
        if (typeof document === 'undefined') return; // Server side check

        if (!this.rootElement) {
            // Try to find default
            this.rootElement = document.querySelector('#app');
            if (!this.rootElement) {
                this.starlin.log('No root element set', 'error');
                return;
            }
        }

        // Get component
        const component = route.component;

        // Render component with props
        const html = typeof component === 'function'
            ? component({
                state: this.starlin.state.getState(),
                api: this.starlin.api
            })
            : component;

        // Update DOM
        this.rootElement.innerHTML = html;

        // Attach event listeners
        this.attachEventListeners(route.actions);
    }

    // Attach event listeners to rendered elements
    attachEventListeners(actions) {
        if (!actions) return;

        // Handle data-click attributes
        this.rootElement.querySelectorAll('[data-click]').forEach(el => {
            const actionName = el.getAttribute('data-click');
            const action = actions[actionName];

            if (action) {
                el.onclick = () => action({
                    state: this.starlin.state.getState(),
                    api: this.starlin.api
                });
            }
        });
    }
}

module.exports = ComponentRenderer;
