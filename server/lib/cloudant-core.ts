// Fallback Cloudant implementation for development without Cloudant dependencies
export const DBNAME = process.env.CLOUDANT_DBNAME || "spiral";

const memStore = new Map();

export async function getDb() {
  return {
    get: async (id: string) => {
      if (memStore.has(id)) return memStore.get(id);
      throw new Error('Not found');
    },
    insert: async (doc: any) => {
      const id = doc._id;
      memStore.set(id, { ...doc, _rev: `1-${Math.random().toString(36)}` });
      return { ok: true, id, rev: memStore.get(id)._rev };
    }
  };
}