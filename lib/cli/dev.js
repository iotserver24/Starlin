/**
 * DEVELOPMENT SERVER
 * Watches files and hot reloads
 */

const express = require('express');
const chokidar = require('chokidar');
const path = require('path');
const Starlin = require('../core/Starlin');

async function startDevServer() {
    console.log('🚀 Starting Starlin dev server...');

    // Load config
    let config = {};
    try {
        config = require(path.join(process.cwd(), 'starlin.config.js'));
    } catch (e) {
        console.warn('No starlin.config.js found, using defaults.');
    }

    // Initialize Starlin
    const app = new Starlin(config);
    await app.start();

    // Create Express server
    const server = express();

    // Serve static files
    server.use(express.static('public'));
    server.use('/src', express.static(path.join(process.cwd(), 'src'))); // Serve source content
    server.use('/starlin-client', express.static(path.join(__dirname, '../client')));
    server.use(express.json());

    // Handle API routes
    server.all('/api/*', async (req, res) => {
        const result = await app.api.handleRequest(
            req.method,
            req.path,
            req.body
        );
        res.json(result);
    });

    // Handle page routes
    server.get('*', (req, res) => {
        res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
    });

    // Start server
    const port = config.port || 3000;
    server.listen(port, () => {
        console.log(`✅ Server running at http://localhost:${port}`);
        console.log('📁 Watching for file changes...');
    });

    // Watch for file changes
    const watcher = chokidar.watch('src/**/*.js', {
        persistent: true
    });

    watcher.on('change', (filePath) => {
        console.log(`🔄 File changed: ${filePath}`);
        // TODO: Hot reload
    });
}

module.exports = startDevServer;
