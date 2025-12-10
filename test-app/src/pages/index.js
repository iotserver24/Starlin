import { Nav } from '../components/Nav.js';
import { Hero } from '../components/Hero.js';
import { FeatureCard } from '../components/FeatureCard.js';

export default function HomePage({ state }) {
  return `
    <div style="min-height: 100vh; display: flex; flex-direction: column;">
      ${Nav()}
      
      <main>
        ${Hero({
    title: "The AI-First Framework",
    subtitle: "Build full-stack web apps with file-based routing, auto-APIs, and virtual DOM. Designed for AI generation.",
    cta: { label: `Count: ${state.count || 0}`, action: "increment" }
  })}

        <section class="container mt-16">
          <div class="grid">
            ${FeatureCard({
    icon: "⚡",
    title: "Lightning Fast",
    description: "New Virtual DOM rendering preserves input focus and ensures 60fps performance."
  })}
            ${FeatureCard({
    icon: "🤖",
    title: "AI Native",
    description: "Code structure designed for LLMs. One file per feature means zero hallucinations."
  })}
            ${FeatureCard({
    icon: "📁",
    title: "File Routing",
    description: "Just create a file in <code>src/pages</code> and it works. No config required."
  })}
          </div>
        </section>

        <section class="container mt-16" style="margin-bottom: 4rem;">
            <div class="card" style="border-color: var(--primary);">
                <div class="flex justify-between">
                    <div>
                        <h3>Ready for Production?</h3>
                        <p>Not quite, but it's perfect for prototypes!</p>
                    </div>
                    <div>
                         <div class="stat-value">${state.count || 0}</div>
                         <div style="color: var(--text-muted); font-size: 0.875rem;">Global Clicks</div>
                    </div>
                </div>
                <div style="margin-top: 2rem;">
                  <button class="btn btn-primary" data-click="increment">Increase Counter</button>
                   <input type="text" placeholder="Type here (I won't lose focus!)" style="padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--bg); color: white; margin-left: 1rem;" />
                </div>
            </div>
        </section>
      </main>
      
      <footer style="text-align: center; padding: 2rem; border-top: 1px solid var(--border); margin-top: auto; color: var(--text-muted);">
        Built with Starlin v0.0.2 • <a href="#" style="color: var(--primary);">Documentation</a>
      </footer>
    </div>
  `;
}

export const actions = {
  increment({ state }) {
    state.count = (state.count || 0) + 1;
  },
  learnMore() {
    alert("Check out the docs folder!");
  }
};
