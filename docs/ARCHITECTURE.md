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
│   │   └── ComponentRenderer.js # Server-side logic (legacy/ssr prep)
│   ├── client/                # Client-side Runtime
│   │   ├── client.js          # Browser routing, state, & events
│   │   ├── dom.js             # ⚡ Lightweight Virtual DOM (Diffing)
│   │   └── error-overlay.js   # 🚨 Runtime Error Display
```

## 🧠 Core Concepts

### 1. File-Based Routing (`Router.js`)

Starlin scans the `src/pages` directory.

- `index.js` maps to `/`
- `about.js` maps to `/about`
- Uses Dynamic Import (`import()`) to load these modules on demand in the browser.

### 2. Auto-API Endpoints (`ApiHandler.js`)

Starlin scans the `src/api` directory.

- Exports named `GET`, `POST`, `PUT`, `DELETE` are mapped to Express routes.
- Example: `src/api/users.js` -> `/api/users`.

### 3. Reactive State (`StateManager.js` & `client.js`)

Starlin uses JavaScript `Proxy` objects to track state.

- `state.count = 5` triggers the `set` trap.
- This immediately calls the `render()` function.

### 4. Virtual DOM Rendering (`dom.js`) ⚡ *NEW in v0.0.2*

Instead of wiping the document with `innerHTML` (which kills input focus and performance), Starlin now uses a smart diffing algorithm:

1. **Render**: The component function is called to generate an HTML string.
2. **Parse**: This string is parsed into a lightweight DOM tree (a `template`).
3. **Diff**: We compare the new template against the actual real DOM.
4. **Patch**: We only update the text nodes or attributes that changed.
    - *Result*: Input focus is preserved! Scrolling is smooth! Updates are fast!

### 5. Event Delegation

- Starlin attaches a single event listener to the root `#app` element.
- It listens for clicks on elements with `data-click`.
- This avoids the overhead of attaching/removing listeners on every render.

### 6. Error handling (`error-overlay.js`) 🚨 *NEW in v0.0.2*

- Starlin wraps API calls and Render cycles in try/catch blocks.
- It also listens for global `error` and `unhandledrejection` events.
- Errors are displayed in a highly visible overlay on top of your app, making debugging instant.
