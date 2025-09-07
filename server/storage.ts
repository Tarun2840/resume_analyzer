import { resumeAnalyses, type ResumeAnalysis, type InsertResumeAnalysis, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  getResumeAnalyses(): Promise<ResumeAnalysis[]>;
  getResumeAnalysisById(id: string): Promise<ResumeAnalysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const [result] = await db
      .insert(resumeAnalyses)
      .values(analysis)
      .returning();
    return result;
  }

  async getResumeAnalyses(): Promise<ResumeAnalysis[]> {
    return await db
      .select()
      .from(resumeAnalyses)
      .orderBy(desc(resumeAnalyses.createdAt));
  }

  async getResumeAnalysisById(id: string): Promise<ResumeAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(resumeAnalyses)
      .where(eq(resumeAnalyses.id, id));
    return analysis || undefined;
  }
}

export const storage = new DatabaseStorage();
