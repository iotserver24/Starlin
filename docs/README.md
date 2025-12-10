# 🚀 Starlin Framework (v0.0.3)

> **"Just for fun, using AI for AI"**

A simplified, AI-first full-stack JavaScript framework designed to be easy for Artificial Intelligence to understand, generate, and debug.

**Author:** Anish Kumar  
**GitHub:** [iotserver24](https://github.com/iotserver24)

---

## 🌟 What is Starlin?

Starlin is a lightweight framework that combines the best concepts of modern web development (file-based routing, API routes, component-based UI) into a package that is stripped of complex configurations and compilation steps.

It is explicitly designed to be **AI-Friendly**. Its consistent structure and "Convention over Configuration" approach make it trivial for LLMs (like ChatGPT, Claude, Gemini) to generate entire features without getting lost in boilerplate.

## 📚 Documentation

- [**Getting Started**](./GETTING_STARTED.md) - Installation, Usage, and **Environment Variables**.
- [**Architecture**](./ARCHITECTURE.md) - VDOM, Error Overlay, and Client Runtime.
- [**Comparison**](./COMPARISON.md) - Starlin vs React/Next.js.
- [**Roadmap & Reality Check**](./ROADMAP.md) - What's missing and what's coming next.

## ✨ Key Features (v0.0.3)

- ✅ **File-Based Routing**: Just like Next.js. `src/pages/about.js` -> `/about`.
- ✅ **Auto-API Endpoints**: `src/api/users.js` -> `/api/users`.
- ✅ **Virtual DOM Rendering**: Smart diffing algorithm updates only what changed. Preserves focus & scroll.
- ✅ **Environment Variables**: Full `.env` support. Securely access `PROD` and other configs.
- ✅ **Smart 404 Page**: Stunning built-in 404 page that changes behavior based on `PROD` mode.
- ✅ **Error Overlay**: Runtime errors pop up instantly in a beautiful dark-mode overlay.
- ✅ **Reactive State**: Simple proxy-based state management that triggers smart re-renders.
- ✅ **Zero Config**: It just works out of the box.

## ⚠️ Disclaimer

This is a **v0.0.3** release created for educational and experimental purposes. It is getting closer to being usable for real prototypes! Please read the [Roadmap](./ROADMAP.md) for details.

---

*Built with ❤️ (and AI) by Anish Kumar.*
