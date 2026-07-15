import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

// Starter schema — replace with the real workflow model when you design it.
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
