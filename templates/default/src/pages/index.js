export default function HomePage({ state, api }) {
    return `
    <div style="padding: 40px; font-family: system-ui;">
      <h1>🚀 Welcome to Starlin!</h1>
      <p>Your AI-first full-stack framework is ready.</p>
      
      <button data-click="increment">
        Count: ${state.count || 0}
      </button>
    </div>
  `;
}

export const actions = {
    increment({ state }) {
        state.count = (state.count || 0) + 1;
    }
};
