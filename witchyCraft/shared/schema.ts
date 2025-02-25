import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Define the video track structure
export const trackSchema = z.object({
  id: z.string(),
  type: z.enum(["video", "audio", "text"]),
  startTime: z.number(),
  endTime: z.number(),
  clips: z.array(z.object({
    id: z.string(),
    source: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    effects: z.array(z.object({
      type: z.string(),
      params: z.record(z.any())
    })).optional()
  }))
});

export const timelineSchema = z.object({
  tracks: z.array(trackSchema),
  duration: z.number()
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  timeline: jsonb("timeline").notNull().$type<z.infer<typeof timelineSchema>>(),
  created: text("created").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  timeline: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Timeline = z.infer<typeof timelineSchema>;
export type Track = z.infer<typeof trackSchema>;