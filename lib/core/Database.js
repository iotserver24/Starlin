/**
 * SIMPLE ORM / DATABASE
 * In-memory by default, extendable to real databases
 */

class Database {
    constructor(starlin) {
        this.starlin = starlin;
        this.models = new Map();
        this.data = new Map(); // In-memory storage
    }

    // Register a model
    registerModel(name, schema) {
        const model = {
            name,
            schema,

            // CRUD operations
            create: async (data) => {
                const collection = this.getCollection(name);
                const id = Date.now().toString();
                const record = { id, ...data, createdAt: new Date() };
                collection.set(id, record);
                return record;
            },

            findAll: async (query = {}) => {
                const collection = this.getCollection(name);
                const records = Array.from(collection.values());

                // Simple filtering
                if (Object.keys(query).length === 0) {
                    return records;
                }

                return records.filter(record => {
                    return Object.entries(query).every(([key, value]) => {
                        return record[key] === value;
                    });
                });
            },

            findById: async (id) => {
                const collection = this.getCollection(name);
                return collection.get(id) || null;
            },

            update: async (id, updates) => {
                const collection = this.getCollection(name);
                const record = collection.get(id);

                if (record) {
                    const updated = { ...record, ...updates };
                    collection.set(id, updated);
                    return updated;
                }

                return null;
            },

            delete: async (id) => {
                const collection = this.getCollection(name);
                const record = collection.get(id);
                collection.delete(id);
                return record;
            },

            getCollection: (name) => {
                if (!this.data.has(name)) {
                    this.data.set(name, new Map());
                }
                return this.data.get(name);
            }
        };

        // Bind all methods to ensure 'this' context if destructured, though I used arrow functions/lexical this above?
        // Wait, the prompt used standard functions inside registerModel inside the Database class methods?
        // The prompt code had "getCollection" bound at the end. I copied the prompt code structure but fixed syntax slightly for `create: async(data)` vs `async create(data)`.
        // Let's stick closer to the prompt's provided code style.

        this.models.set(name, model);
        return model;
    }

    // Helper to get collection needed for the prompt's `getCollection` call inside registerModel
    getCollection(name) {
        if (!this.data.has(name)) {
            this.data.set(name, new Map());
        }
        return this.data.get(name);
    }

    // Get a model
    getModel(name) {
        return this.models.get(name);
    }
}

module.exports = Database;
