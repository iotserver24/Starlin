// 💾 Starlin Database (Simple In-Memory)
// File: starlin/database.js

const store = {};

export function createModel(name, schema) {
    if (!store[name]) {
        store[name] = [];
    }

    return {
        async findAll() {
            return store[name];
        },

        async create(data) {
            // Very basic validation based on schema could go here
            const item = {
                id: Date.now().toString(),
                ...data,
                createdAt: new Date()
            };
            store[name].push(item);
            return item;
        },

        async findById(id) {
            return store[name].find(item => item.id === id);
        },

        async update(id, data) {
            const index = store[name].findIndex(item => item.id === id);
            if (index === -1) return null;
            store[name][index] = { ...store[name][index], ...data };
            return store[name][index];
        },

        async delete(id) {
            const index = store[name].findIndex(item => item.id === id);
            if (index !== -1) {
                store[name].splice(index, 1);
                return true;
            }
            return false;
        }
    };
}
