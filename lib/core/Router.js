/**
 * FILE-BASED ROUTER
 * Automatically creates routes from src/pages/ files
 */

const path = require('path');
const fs = require('fs').promises;

class Router {
    constructor(starlin) {
        this.starlin = starlin;
        this.routes = new Map();
    }

    // Scan src/pages/ and create routes
    async loadRoutes() {
        const pagesDir = path.join(process.cwd(), this.starlin.config.srcDir, 'pages');

        try {
            // Check if directory exists
            try {
                await fs.access(pagesDir);
            } catch (e) {
                this.starlin.log(`Pages directory not found: ${pagesDir}`, 'warn');
                return;
            }

            const files = await fs.readdir(pagesDir);

            for (const file of files) {
                if (file.endsWith('.js')) {
                    await this.registerRoute(file);
                }
            }

            this.starlin.log(`Loaded ${this.routes.size} routes`, 'success');
        } catch (error) {
            this.starlin.log(`Error loading routes: ${error.message}`, 'error');
        }
    }

    // Register a single route
    async registerRoute(filename) {
        // Convert filename to route
        // index.js → /
        // about.js → /about
        // blog/post.js → /blog/post

        const routePath = this.filenameToRoute(filename);
        const filePath = path.join(
            process.cwd(),
            this.starlin.config.srcDir,
            'pages',
            filename
        );

        // Load the page component
        try {
            // Use dynamic import for ESM support
            // Note: cache invalidation for ESM is complex/not supported natively in this simple implementation
            const pageModule = await import(require('url').pathToFileURL(filePath).href);
            const page = pageModule.default || pageModule;

            this.routes.set(routePath, {
                path: routePath,
                component: page,
                actions: pageModule.actions || {}
            });

            this.starlin.log(`Route registered: ${routePath}`, 'info');
        } catch (e) {
            this.starlin.log(`Failed to load route ${filename}: ${e.message}`, 'error');
        }
    }

    // Convert filename to route path
    filenameToRoute(filename) {
        // index.js → /
        if (filename === 'index.js') return '/';

        // about.js → /about
        return '/' + filename.replace('.js', '');
    }

    // Get route by path
    getRoute(path) {
        return this.routes.get(path);
    }

    // Navigate to route (client-side)
    navigate(path) {
        const route = this.getRoute(path);
        if (route) {
            if (typeof window !== 'undefined') {
                window.history.pushState({}, '', path);
                this.starlin.renderer.render(route);
            }
        }
    }
}

module.exports = Router;
