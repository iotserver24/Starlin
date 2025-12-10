import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../starlin.config.js';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
app.use(bodyParser.json());

// 1. Serve Static Assets
app.use(express.static(path.join(projectRoot, 'public')));
app.use('/src', express.static(path.join(projectRoot, 'src')));
app.use('/starlin', express.static(path.join(projectRoot, 'starlin')));
app.use('/node_modules', express.static(path.join(projectRoot, 'node_modules'))); // Just in case

// 2. Load API Routes
async function loadApiRoutes() {
    const apiDir = path.join(projectRoot, 'src', 'api');
    if (!fs.existsSync(apiDir)) return;

    const files = fs.readdirSync(apiDir);
    for (const file of files) {
        if (file.endsWith('.js')) {
            const routeName = file.replace('.js', '');
            const modulePath = path.join(apiDir, file);
            // Import using file:// protocol for Windows compatibility
            const moduleUrl = `file://${modulePath.replace(/\\/g, '/')}`;

            try {
                const apiModule = await import(moduleUrl);
                const baseRoute = `${config.apiPrefix}/${routeName}`;

                const register = (method, handler) => {
                    const expressMethod = method.toLowerCase();

                    // Handler wrapper
                    const wrapper = async (req, res) => {
                        try {
                            const result = await handler(req);
                            if (result !== undefined) res.json(result);
                        } catch (err) {
                            console.error(`Error in ${method} ${req.path}:`, err);
                            res.status(500).json({ error: err.message });
                        }
                    };

                    // Register for both /api/resource and /api/resource/:id
                    app[expressMethod](baseRoute, wrapper);
                    app[expressMethod](`${baseRoute}/:id`, wrapper);
                };

                if (apiModule.GET) register('GET', apiModule.GET);
                if (apiModule.POST) register('POST', apiModule.POST);
                if (apiModule.PUT) register('PUT', apiModule.PUT);
                if (apiModule.DELETE) register('DELETE', apiModule.DELETE);

                console.log(`🔌 API Ready: ${baseRoute}`);
            } catch (err) {
                console.error(`Failed to load API ${file}:`, err);
            }
        }
    }
}

await loadApiRoutes();

// 3. Fallback for SPA (Single Page Application)
app.get('*', (req, res) => {
    // If not an API call, serve index.html
    if (!req.path.startsWith(config.apiPrefix) && req.headers.accept?.includes('text/html')) {
        res.sendFile(path.join(projectRoot, 'public', 'index.html'));
    } else {
        // If it's a 404 on an asset
        if (!res.headersSent) res.status(404).send('Not Found');
    }
});

app.listen(config.port, () => {
    console.log(`
🚀 Starlin Framework is running!
-------------------------------
🌍 Server: http://localhost:${config.port}
📁 Root:   ${projectRoot}
-------------------------------
  `);
});
