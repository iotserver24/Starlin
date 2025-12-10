import { Nav } from '../components/Nav.js';
import { Hero } from '../components/Hero.js';
import { FeatureCard } from '../components/FeatureCard.js';

export default function FeaturesPage({ state }) {
    return `
    <div style="min-height: 100vh; display: flex; flex-direction: column;">
      ${Nav()}
      
      <main class="container mt-16" style="margin-bottom: 4rem;">
        <h1 style="text-align: center;">Framework Features</h1>
        <p style="text-align: center; max-width: 600px; margin: 0 auto 3rem auto; font-size: 1.25rem;">
            Explore the capabilities of Starlin v0.0.2
        </p>

        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
            <div class="card">
                <h2>⚡ Virtual DOM</h2>
                <p>The new rendering engine diffs your HTML changes against the real DOM. This means:</p>
                <ul style="color: var(--text-muted); padding-left: 1.5rem;">
                    <li>Input focus is never lost</li>
                    <li>Scroll position is maintained</li>
                    <li>Updates are blazing fast (60fps)</li>
                </ul>
            </div>

            <div class="card">
                <h2>🚨 Error Overlay</h2>
                <p>Runtime errors are no longer hidden continuously in the console.</p>
                <ul style="color: var(--text-muted); padding-left: 1.5rem;">
                    <li>Instant visual feedback</li>
                    <li>Shows error message & stack trace</li>
                    <li>Beautiful dark mode design</li>
                </ul>
            </div>

            <div class="card">
                <h2>📁 File-Based Routing</h2>
                <p>The filesystem is the API. No configuration files needed.</p>
                <code style="display: block; background: #000; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; font-family: monospace;">
                    src/<br>
                    &nbsp;&nbsp;pages/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;index.js&nbsp;&nbsp;&rarr; /<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;about.js&nbsp;&nbsp;&rarr; /about<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;features.js&nbsp;&rarr; /features
                </code>
            </div>

            <div class="card">
                <h2>🔌 Auto-API</h2>
                <p>Backend endpoints are just files too.</p>
                <code style="display: block; background: #000; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; font-family: monospace;">
                    src/<br>
                    &nbsp;&nbsp;api/<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;users.js&nbsp;&nbsp;&rarr; /api/users
                </code>
            </div>
        </div>
      </main>

      <footer style="text-align: center; padding: 2rem; border-top: 1px solid var(--border); margin-top: auto; color: var(--text-muted);">
        <a href="/" class="btn btn-outline">Back to Home</a>
      </footer>
    </div>
  `;
}
