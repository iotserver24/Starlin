export const FeatureCard = ({ icon, title, description }) => `
  <div class="card">
    <div style="font-size: 2rem; margin-bottom: 1rem;">${icon}</div>
    <h3>${title}</h3>
    <p>${description}</p>
  </div>
`;
