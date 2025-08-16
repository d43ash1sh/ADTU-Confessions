import { confessions, admins, type Confession, type InsertConfession, type Admin, type InsertAdmin } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // Confession methods
  getConfessions(status?: 'pending' | 'approved', search?: string, category?: string): Promise<Confession[]>;
  getConfessionById(id: string): Promise<Confession | undefined>;
  createConfession(confession: InsertConfession): Promise<Confession>;
  updateConfessionStatus(id: string, status: 'approved' | 'rejected'): Promise<Confession | undefined>;
  updateConfessionReactions(id: string, reactions: string): Promise<Confession | undefined>;
  deleteConfession(id: string): Promise<boolean>;
  getConfessionStats(): Promise<{ totalConfessions: number; totalReactions: number; pendingCount: number }>;
  
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  async getConfessions(status?: 'pending' | 'approved', search?: string, category?: string): Promise<Confession[]> {
    const conditions = [];
    
    if (status) {
      conditions.push(eq(confessions.status, status));
    }
    
    if (search) {
      conditions.push(ilike(confessions.text, `%${search}%`));
    }
    
    if (category) {
      conditions.push(eq(confessions.category, category as any));
    }
    
    const query = db.select().from(confessions);
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(confessions.createdAt));
    }
    
    return await query.orderBy(desc(confessions.createdAt));
  }

  async getConfessionById(id: string): Promise<Confession | undefined> {
    const [confession] = await db.select().from(confessions).where(eq(confessions.id, id));
    return confession || undefined;
  }

  async createConfession(insertConfession: InsertConfession): Promise<Confession> {
    // Get the next display ID
    const [{ nextDisplayId }] = await db.select({ 
      nextDisplayId: sql<number>`COALESCE(MAX(${confessions.displayId}), 0) + 1` 
    }).from(confessions);

    const [confession] = await db
      .insert(confessions)
      .values({
        ...insertConfession,
        displayId: nextDisplayId,
        reactions: JSON.stringify({ love: 0, laugh: 0, fire: 0 })
      })
      .returning();
    return confession;
  }

  async updateConfessionStatus(id: string, status: 'approved' | 'rejected'): Promise<Confession | undefined> {
    const [confession] = await db
      .update(confessions)
      .set({ status })
      .where(eq(confessions.id, id))
      .returning();
    return confession || undefined;
  }

  async updateConfessionReactions(id: string, reactions: string): Promise<Confession | undefined> {
    const [confession] = await db
      .update(confessions)
      .set({ reactions })
      .where(eq(confessions.id, id))
      .returning();
    return confession || undefined;
  }

  async deleteConfession(id: string): Promise<boolean> {
    const result = await db.delete(confessions).where(eq(confessions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getConfessionStats(): Promise<{ totalConfessions: number; totalReactions: number; pendingCount: number }> {
    const [stats] = await db.select({
      totalConfessions: sql<number>`COUNT(CASE WHEN ${confessions.status} = 'approved' THEN 1 END)`,
      pendingCount: sql<number>`COUNT(CASE WHEN ${confessions.status} = 'pending' THEN 1 END)`,
    }).from(confessions);

    // Calculate total reactions from all approved confessions
    const approvedConfessions = await db.select({ reactions: confessions.reactions })
      .from(confessions)
      .where(eq(confessions.status, 'approved'));
    
    let totalReactions = 0;
    approvedConfessions.forEach(c => {
      try {
        const reactions = JSON.parse(c.reactions || '{}');
        totalReactions += (reactions.love || 0) + (reactions.laugh || 0) + (reactions.fire || 0);
      } catch {}
    });

    return {
      totalConfessions: stats.totalConfessions,
      totalReactions,
      pendingCount: stats.pendingCount
    };
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }
}

export const storage = new DatabaseStorage();
