/**
 * STARLIN FRAMEWORK - Main Class
 * This is the heart of the framework
 */

const Router = require('./Router');
const ApiHandler = require('./ApiHandler');
const StateManager = require('./StateManager');
const ComponentRenderer = require('./ComponentRenderer');
const Database = require('./Database');

class Starlin {
    constructor(config = {}) {
        this.config = {
            port: config.port || 3000,
            apiPrefix: config.apiPrefix || '/api',
            srcDir: config.srcDir || './src',
            debug: config.debug || false,
            ...config
        };

        // Initialize subsystems
        this.router = new Router(this);
        this.api = new ApiHandler(this);
        this.state = new StateManager(this);
        this.renderer = new ComponentRenderer(this);
        this.db = new Database(this);

        this.log('Starlin Framework initialized', 'success');
    }

    // Load all pages from src/pages/
    async loadPages() {
        // TODO: Scan src/pages/ directory
        // For each .js file, create a route
        // Example: src/pages/about.js → route: /about
        // Implemented in Router.js loadRoutes
        await this.router.loadRoutes();
    }

    // Load all API routes from src/api/
    async loadApiRoutes() {
        // TODO: Scan src/api/ directory
        // For each .js file, create API endpoints
        // Example: src/api/users.js → endpoint: /api/users
        // Implemented in ApiHandler.js loadEndpoints
        await this.api.loadEndpoints();
    }

    // Load all models from src/models/
    async loadModels() {
        // TODO: Scan src/models/ directory
        // For each .js file, register model with database
    }

    // Start the framework
    async start() {
        try {
            await this.loadPages();
            await this.loadApiRoutes();
            await this.loadModels();

            // Start server (if Node.js)
            if (typeof window === 'undefined') {
                this.startServer();
            } else {
                // Initialize client-side
                this.initClient();
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    startServer() {
        // TODO: Create Express/HTTP server
        // Handle routing and API requests
        // This part is handled by lib/cli/dev.js which sets up express and calls api.handleRequest
    }

    initClient() {
        // TODO: Initialize client-side routing
        // Set up page rendering
    }

    log(message, type = 'info') {
        if (this.config.debug) {
            console.log(`[Starlin ${type}] ${message}`);
        }
    }

    handleError(error) {
        // TODO: Show clear, helpful error messages
        if (this.config.debug) {
            console.error(`[Starlin Error] ${error.message}`);
            console.error(error.stack);
        }
    }
}

module.exports = Starlin;
