export const Hero = ({ title, subtitle, cta }) => `
  <section class="container mt-16 animate-float" style="text-align: center; padding: 4rem 0;">
    <span class="badge" style="margin-bottom: 1rem; display: inline-block;">v0.0.2 Public Beta</span>
    <h1>${title}</h1>
    <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem auto;">${subtitle}</p>
    <div class="flex gap-4" style="justify-content: center;">
      <button class="btn btn-primary" data-click="${cta.action}">${cta.label}</button>
      <button class="btn btn-outline" data-click="learnMore">Learn More</button>
    </div>
  </section>
`;
