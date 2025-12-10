# 🏁 Getting Started with Starlin

Welcome to Starlin! This guide will help you create your first AI-first web application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 📥 Installation

Since Starlin is currently in development (v0.0.1), you can run it from the source or link it locally.

### 1. Install Globally (from source)

```bash
# Clone the repository
git clone https://github.com/iotserver24/starlin.git
cd Starlin

# Install framework dependencies
npm install

# Link the CLI command globally
npm link
```

## 🚀 Creating a New Project

Once installed, you can create a new project using the CLI:

```bash
starlin create my-app
```

This will create a new directory `my-app` with the default template.

## 🏃 Running Your App

```bash
cd my-app

# Install project dependencies
npm install

# Start the development server
npm run dev
```

Open your browser to **<http://localhost:3000>**. You should see the Starlin welcome page!

## 🛠️ Basic Usage

### creating a Page

Create a new file in `src/pages/contact.js`:

```javascript
export default function ContactPage({ state }) {
  return `
    <div class="container">
      <h1>Contact Us</h1>
      <p>Send us a message!</p>
    </div>
  `;
}
```

Visit `http://localhost:3000/contact` to see it live!

### Creating an API Endpoint

Create a new file in `src/api/hello.js`:

```javascript
export async function GET(req) {
  return { message: "Hello from Starlin API!" };
}
```

Visit `http://localhost:3000/api/hello` to see the JSON response.

### Using State

State is automatically passed to your pages.

```javascript
export default function Counter({ state }) {
  return `
    <button data-click="increment">
      Count: ${state.count || 0}
    </button>
  `;
}

export const actions = {
  increment({ state }) {
    state.count = (state.count || 0) + 1;
  }
};
```
