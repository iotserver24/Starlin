# 🏁 Getting Started with Starlin

## 📦 Installation

To create a new Starlin app, ensure you have Node.js installed, then run:

```bash
# Create a new project
npx starlin-framework create my-app

# Navigate to directory
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Environment Variables (New in v0.0.3)

Starlin supports `.env` files out of the box using `dotenv`.

1. Create a `.env` file in your project root.
2. Add variables:

    ```ini
    PROD=false
    API_KEY=secret_123
    ```

### Public vs Private

- **Backend (`src/api/*`)**: Can access ALL variables via `process.env`.
- **Frontend (`src/pages/*`)**: Can ONLY access variables explicitly exposed by the server.
  - Currently, only `PROD` is exposed to the client via `window.STARLIN_ENV.PROD`.

### Production Mode

Set `PROD=true` in your `.env` file to:

1. Hide technical error details on the 404 page.
2. Show a user-friendly "Page Not Found" message instead.

## 🚀 Basic Usage

### 1. Create a Page

Create `src/pages/hello.js`:

```javascript
export default function Hello({ state }) {
    return `<h1>Hello ${state.name || 'World'}!</h1>`;
}
```

Visit `http://localhost:3000/hello`.

### 2. Create an API Endpoint

Create `src/api/time.js`:

```javascript
export function GET(req, res) {
    res.json({ time: new Date().toISOString() });
}
```

Visit `http://localhost:3000/api/time`.

### 3. Add Interactivity

Pages can export an `actions` object for event handling:

```javascript
export default function Counter({ state }) {
    return `
        <button data-click="increment">
            Count is: ${state.count || 0}
        </button>
    `;
}

export const actions = {
    increment({ state }) {
        state.count = (state.count || 0) + 1;
    }
};
```
