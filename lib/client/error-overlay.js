/**
 * Starlin Error Overlay
 * Displays runtime errors in a beautiful, helpful way.
 */

export function showError(title, message, code) {
    // Check if overlay already exists
    let overlay = document.getElementById('starlin-error-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'starlin-error-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            color: #ff5555;
            font-family: monospace;
            z-index: 10000;
            padding: 40px;
            box-sizing: border-box;
            overflow: auto;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div style="
            background: #1a1a1a;
            border: 1px solid #ff5555;
            border-radius: 8px;
            max-width: 900px;
            margin: 0 auto;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
        ">
            <div style="
                background: #ff5555;
                color: black;
                padding: 15px 20px;
                font-weight: bold;
                font-size: 1.2em;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>🚨 ${title}</span>
                <button onclick="document.getElementById('starlin-error-overlay').remove()" style="
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1.2em;
                ">✕</button>
            </div>
            <div style="padding: 30px;">
                <h2 style="margin-top: 0; color: #fff;">${message}</h2>
                ${code ? `
                <div style="
                    background: #000;
                    padding: 20px;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin-top: 20px;
                    border-left: 4px solid #ff5555;
                ">
                    <pre style="margin: 0;">${code}</pre>
                </div>
                ` : ''}
                <div style="margin-top: 30px; color: #888;">
                    💡 Tip: Check the file mentioned above or your browser console for more details.
                </div>
            </div>
        </div>
    `;
}

// Hook into global errors
window.addEventListener('error', (event) => {
    // Don't show overlay for 404s (handled by router)
    showError('Runtime Error', event.message, `${event.filename}:${event.lineno}:${event.colno}`);
});

window.addEventListener('unhandledrejection', (event) => {
    showError('Unhandled Promise Rejection', event.reason.message || event.reason, event.reason.stack);
});
