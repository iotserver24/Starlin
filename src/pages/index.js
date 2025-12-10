// 📄 Home Page Component
// File: src/pages/index.js
// Route: / (automatically)

export default function HomePage({ state, api }) {
    return `
    <div class="container">
      <h1>Welcome to Starlin!</h1>
      <p>Count: ${state.count || 0}</p>
      
      <button data-click="increment">Increment</button>
      <button data-click="loadUsers">Load Users</button>
      
      <div id="user-list"></div>
    </div>
  `;
}

// Page actions (like React event handlers)
export const actions = {
    increment({ state }) {
        state.count = (state.count || 0) + 1;
    },

    async loadUsers({ api, render }) {
        const users = await api.get('/users');
        document.querySelector('#user-list').innerHTML =
            users.map(u => `<p>${u.name}</p>`).join('');
    }
};
