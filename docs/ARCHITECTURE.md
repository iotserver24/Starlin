# 🏗️ Starlin Architecture

Starlin is designed to be simple and transparent. Here is how it works under the hood.

## 📂 Project Structure

```
├── bin/
│   └── starlin.js             # CLI Entry Point
├── lib/
│   ├── core/                  # Core Framework Logic
│   │   ├── Starlin.js         # Main Framework Class
│   │   ├── Router.js          # File-based Routing Logic
│   │   ├── ApiHandler.js      # API Request Handling
│   │   ├── StateManager.js    # Reactive Proxy State
│   │   └── ComponentRenderer.js # DOM Rendering Engine
│   ├── client/                # Client-side Runtime
│   │   └── client.js          # Browser routing & state
```

## 🧠 Core Concepts

### 1. File-Based Routing (`Router.js`)

Starlin scans the `src/pages` directory.

- `index.js` maps to `/`
- `about.js` maps to `/about`
- Nested folders are supported (e.g., `blog/post.js` -> `/blog/post`).

It uses Dynamic Import (`import()`) to load these modules on demand.

### 2. Auto-API Endpoints (`ApiHandler.js`)

Starlin scans the `src/api` directory.

- Files export functions named `GET`, `POST`, `PUT`, `DELETE`.
- These are automatically mapped to Express routes under `/api/`.
- Example: `src/api/users.js` -> `/api/users`.

### 3. Reactive State (`StateManager.js`)

Starlin uses JavaScript `Proxy` objects to create a global state.

- When a property on `state` is modified, the Proxy intercepts the change.
- It triggers a re-render of the current page component.
- This provides a React-like "reactivity" without a complex Virtual DOM (currently acts more like a full refresh of the component DOM).

### 4. Component Rendering (`ComponentRenderer.js`)

- Components are simple functions that return HTML strings (Template Literals).
- The renderer injects this HTML into the `#app` div.
- It scans the HTML for `data-click` attributes and attaches event listeners that map to the exported `actions` object of the page.

### 5. Client Runtime (`client.js`)

- Runs in the browser.
- Intercepts link clicks for SPA (Single Page Application) navigation.
- syncs state changes to the view.
- Handles API requests via `fetch`.
