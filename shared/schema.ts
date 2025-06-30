import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  profileImage: text("profile_image"),
  role: text("role").notNull().default("parent"), // parent, child, spouse
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  parentId: integer("parent_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // child, spouse, caregiver
  profileImage: text("profile_image"),
  age: integer("age"),
  permissions: json("permissions").$type<{
    apps: string[];
    timeRestrictions: { [app: string]: { start: string; end: string } };
    networkAccess: boolean;
    contacts: string[];
  }>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  deviceName: text("device_name").notNull(),
  deviceType: text("device_type").notNull(), // phone, tablet, computer
  deviceId: text("device_id").notNull().unique(),
  isLocked: boolean("is_locked").default(false),
  lastActivity: timestamp("last_activity").defaultNow(),
  location: json("location").$type<{ 
    lat: number; 
    lng: number; 
    address: string;
    speed?: number;
    direction?: string;
    accuracy?: number;
    timestamp?: string;
  }>(),
  biometricEnabled: boolean("biometric_enabled").default(false),
  batteryLevel: integer("battery_level").default(100),
  isOnline: boolean("is_online").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const securitySettings = pgTable("security_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  faceIdEnabled: boolean("face_id_enabled").default(false),
  touchIdEnabled: boolean("touch_id_enabled").default(false),
  voiceIdEnabled: boolean("voice_id_enabled").default(false),
  networkControlEnabled: boolean("network_control_enabled").default(false),
  emergencyContacts: json("emergency_contacts").$type<string[]>(),
  aiAssistantEnabled: boolean("ai_assistant_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  familyMemberId: integer("family_member_id").references(() => familyMembers.id),
  deviceId: integer("device_id").references(() => devices.id),
  activityType: text("activity_type").notNull(), // app_usage, location_change, security_event
  description: text("description").notNull(),
  metadata: json("metadata").$type<any>(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const emergencyEvents = pgTable("emergency_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventType: text("event_type").notNull(), // emergency_lock, panic_button, unauthorized_access
  description: text("description").notNull(),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
});

export const insertSecuritySettingsSchema = createInsertSchema(securitySettings).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertEmergencyEventSchema = createInsertSchema(emergencyEvents).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;

export type SecuritySettings = typeof securitySettings.$inferSelect;
export type InsertSecuritySettings = z.infer<typeof insertSecuritySettingsSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type EmergencyEvent = typeof emergencyEvents.$inferSelect;
export type InsertEmergencyEvent = z.infer<typeof insertEmergencyEventSchema>;
