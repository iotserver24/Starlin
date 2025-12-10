/**
 * GLOBAL STATE MANAGER
 * Simple reactive state like React
 */

class StateManager {
    constructor(starlin) {
        this.starlin = starlin;
        this.state = {};
        this.listeners = new Set();
    }

    // Create reactive state
    createState(initialState) {
        this.state = new Proxy(initialState, {
            set: (target, property, value) => {
                target[property] = value;
                this.notify();
                return true;
            }
        });

        return this.state;
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // Notify all listeners
    notify() {
        this.listeners.forEach(listener => {
            listener(this.state);
        });
    }

    // Get current state
    getState() {
        return this.state;
    }
}

module.exports = StateManager;
