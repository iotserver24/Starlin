/**
 * API ROUTE HANDLER
 * Automatically creates API endpoints from src/api/ files
 */

const path = require('path');
const fs = require('fs').promises;

class ApiHandler {
    constructor(starlin) {
        this.starlin = starlin;
        this.endpoints = new Map();
    }

    // Scan src/api/ and create endpoints
    async loadEndpoints() {
        const apiDir = path.join(process.cwd(), this.starlin.config.srcDir, 'api');

        try {
            // Check if directory exists
            try {
                await fs.access(apiDir);
            } catch (e) {
                this.starlin.log(`API directory not found: ${apiDir}`, 'warn');
                return;
            }

            const files = await fs.readdir(apiDir);

            for (const file of files) {
                if (file.endsWith('.js')) {
                    await this.registerEndpoint(file);
                }
            }

            this.starlin.log(`Loaded ${this.endpoints.size} API endpoints`, 'success');
        } catch (error) {
            this.starlin.log(`Error loading API routes: ${error.message}`, 'error');
        }
    }

    // Register API endpoint
    async registerEndpoint(filename) {
        // users.js → /api/users
        const endpointPath = this.starlin.config.apiPrefix + '/' +
            filename.replace('.js', '');

        const filePath = path.join(
            process.cwd(),
            this.starlin.config.srcDir,
            'api',
            filename
        );

        // Load the API handlers (GET, POST, PUT, DELETE)
        try {
            const handlers = await import(require('url').pathToFileURL(filePath).href);

            this.endpoints.set(endpointPath, {
                path: endpointPath,
                GET: handlers.GET,
                POST: handlers.POST,
                PUT: handlers.PUT,
                DELETE: handlers.DELETE
            });

            this.starlin.log(`API endpoint registered: ${endpointPath}`, 'info');
        } catch (e) {
            this.starlin.log(`Failed to load API ${filename}: ${e.message}`, 'error');
        }
    }

    // Handle API request
    async handleRequest(method, path, body) {
        // Basic matching. For params (like /users/123), we need regex or split.
        // The prompt's implementation is simple map lookup for now.

        // Check direct match
        let endpoint = this.endpoints.get(path);
        let params = {};

        // If no direct match, try to find one pattern match (very basic)
        if (!endpoint) {
            for (const [key, val] of this.endpoints.entries()) {
                // Basic check: if path starts with key/
                // This is not fully implementing standard routing logic but follows "ApiHandler.js" prompt logic
                // Prompt logic had: const endpoint = this.endpoints.get(path); (exact match)
                // I will leave it as exact match per prompt to avoid over-engineering unless user asked, 
                // but user asked for "users.js -> /api/users".
            }
        }

        if (endpoint && endpoint[method]) {
            try {
                const result = await endpoint[method]({ body, params });
                return { success: true, data: result };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        return { success: false, error: 'Endpoint not found' };
    }
}

module.exports = ApiHandler;
