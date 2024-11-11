import { defineDb, defineTable, column } from 'astro:db';

export const Subscribers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    external_id: column.text(),
    email: column.text(),
    subscription_status: column.text(),
    subscription_tier: column.text(),
  },
});

export const BlorboEntries = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    supporter_id: column.number(),
    name: column.text(),
    fandom: column.text(),
    image_url: column.text(),
    },
});

const db = defineDb({
  tables: {
    Subscribers,
    BlorboEntries,
  },
});

export default db;
