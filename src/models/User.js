// 💾 User Model
// File: src/models/User.js

export const UserSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    createdAt: { type: Date, default: Date.now }
};

// Starlin auto-generates CRUD methods:
// User.create(data)
// User.findAll(query)
// User.findById(id)
// User.update(id, data)
// User.delete(id)

// To make this work in my simple implementation, I will export a mock class or rely on the framework to wrap it.
// However, the example usage is: "import User from '../models/User.js'" and then calling "User.findAll()".
// So "User" must be exported as an object with these methods.
// I will wrap it in a helper or just export the object so the user code (and my framework) works.
// Actually, in a real framework, the "import" would probably be processed or I should export a class that parses the schema.
// For now, I'll export a proxy or a class that uses the schema.

import { createModel } from '../../starlin/database.js';

export default createModel('User', UserSchema);
