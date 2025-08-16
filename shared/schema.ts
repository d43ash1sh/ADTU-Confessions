import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const statusEnum = pgEnum('status', ['pending', 'approved', 'rejected']);
export const categoryEnum = pgEnum('category', ['funny', 'crush', 'hostel', 'sad', 'roast', 'academic', 'friendship', 'other']);

export const confessions = pgTable("confessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  category: categoryEnum("category").notNull(),
  status: statusEnum("status").notNull().default('pending'),
  reactions: text("reactions").default('{}'), // JSON string for reactions {love: 0, laugh: 0, fire: 0}
  createdAt: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  displayId: integer("display_id"), // Auto-incrementing display ID like #001, #002
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Will be bcrypt hashed
});

export const insertConfessionSchema = createInsertSchema(confessions).pick({
  text: true,
  category: true,
}).extend({
  text: z.string().min(10, "Confession must be at least 10 characters").max(500, "Confession must not exceed 500 characters"),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertConfession = z.infer<typeof insertConfessionSchema>;
export type Confession = typeof confessions.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
