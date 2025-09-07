import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumeAnalyses = pgTable("resume_analyses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  personalDetails: jsonb("personal_details").$type<{
    name?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
    portfolio?: string;
  }>(),
  resumeContent: jsonb("resume_content").$type<{
    summary?: string;
    workExperience?: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      duration: string;
      details?: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies?: string[];
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
  }>(),
  skills: jsonb("skills").$type<{
    technical: string[];
    soft: string[];
  }>(),
  aiFeedback: jsonb("ai_feedback").$type<{
    rating: number;
    improvementAreas: string[];
    suggestedSkills: string[];
    summary: string;
  }>(),
  overallScore: real("overall_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
