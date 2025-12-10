// 🔌 Users API
// File: src/api/users.js
// Endpoint: /api/users (automatically)

import User from '../models/User.js';

// GET /api/users
export async function GET(req) {
    const users = await User.findAll();
    return { users };
}

// POST /api/users
export async function POST(req) {
    const user = await User.create(req.body);
    return { user };
}

// PUT /api/users/:id
export async function PUT(req) {
    const user = await User.update(req.params.id, req.body);
    return { user };
}

// DELETE /api/users/:id
export async function DELETE(req) {
    await User.delete(req.params.id);
    return { success: true };
}
