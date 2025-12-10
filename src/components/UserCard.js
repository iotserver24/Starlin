// 🧩 UserCard Component
// File: src/components/UserCard.js

export default function UserCard({ user }) {
    return `
    <div class="user-card">
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <button data-click="editUser" data-id="${user.id}">
        Edit
      </button>
    </div>
  `;
}
