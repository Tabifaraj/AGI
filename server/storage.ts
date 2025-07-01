import { 
  users, familyMembers, devices, securitySettings, activities, emergencyEvents,
  type User, type InsertUser,
  type FamilyMember, type InsertFamilyMember,
  type Device, type InsertDevice,
  type SecuritySettings, type InsertSecuritySettings,
  type Activity, type InsertActivity,
  type EmergencyEvent, type InsertEmergencyEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Family member methods
  getFamilyMembers(parentId: number): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: number): Promise<boolean>;

  // Device methods
  getDevices(userId: number): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, updates: Partial<Device>): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;

  // Security settings methods
  getSecuritySettings(userId: number): Promise<SecuritySettings | undefined>;
  createSecuritySettings(settings: InsertSecuritySettings): Promise<SecuritySettings>;
  updateSecuritySettings(userId: number, updates: Partial<SecuritySettings>): Promise<SecuritySettings | undefined>;

  // Activity methods
  getActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Emergency methods
  getEmergencyEvents(userId: number): Promise<EmergencyEvent[]>;
  createEmergencyEvent(event: InsertEmergencyEvent): Promise<EmergencyEvent>;
  updateEmergencyEvent(id: number, updates: Partial<EmergencyEvent>): Promise<EmergencyEvent | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
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

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getFamilyMembers(parentId: number): Promise<FamilyMember[]> {
    return await db.select().from(familyMembers).where(eq(familyMembers.parentId, parentId));
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    const [member] = await db.select().from(familyMembers).where(eq(familyMembers.id, id));
    return member || undefined;
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const [member] = await db
      .insert(familyMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const [member] = await db
      .update(familyMembers)
      .set(updates)
      .where(eq(familyMembers.id, id))
      .returning();
    return member || undefined;
  }

  async deleteFamilyMember(id: number): Promise<boolean> {
    const result = await db.delete(familyMembers).where(eq(familyMembers.id, id));
    return (result as any).rowCount > 0;
  }

  async getDevices(userId: number): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.userId, userId));
  }

  async getDevice(id: number): Promise<Device | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device || undefined;
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const [device] = await db
      .insert(devices)
      .values(insertDevice)
      .returning();
    return device;
  }

  async updateDevice(id: number, updates: Partial<Device>): Promise<Device | undefined> {
    const [device] = await db
      .update(devices)
      .set(updates)
      .where(eq(devices.id, id))
      .returning();
    return device || undefined;
  }

  async deleteDevice(id: number): Promise<boolean> {
    const result = await db.delete(devices).where(eq(devices.id, id));
    return (result as any).rowCount > 0;
  }

  async getSecuritySettings(userId: number): Promise<SecuritySettings | undefined> {
    const [settings] = await db.select().from(securitySettings).where(eq(securitySettings.userId, userId));
    return settings || undefined;
  }

  async createSecuritySettings(insertSettings: InsertSecuritySettings): Promise<SecuritySettings> {
    const [settings] = await db
      .insert(securitySettings)
      .values(insertSettings)
      .returning();
    return settings;
  }

  async updateSecuritySettings(userId: number, updates: Partial<SecuritySettings>): Promise<SecuritySettings | undefined> {
    const [settings] = await db
      .update(securitySettings)
      .set(updates)
      .where(eq(securitySettings.userId, userId))
      .returning();
    return settings || undefined;
  }

  async getActivities(userId: number, limit: number = 50): Promise<Activity[]> {
    return await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getEmergencyEvents(userId: number): Promise<EmergencyEvent[]> {
    return await db.select().from(emergencyEvents)
      .where(eq(emergencyEvents.userId, userId))
      .orderBy(desc(emergencyEvents.createdAt));
  }

  async createEmergencyEvent(insertEvent: InsertEmergencyEvent): Promise<EmergencyEvent> {
    const [event] = await db
      .insert(emergencyEvents)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEmergencyEvent(id: number, updates: Partial<EmergencyEvent>): Promise<EmergencyEvent | undefined> {
    const [event] = await db
      .update(emergencyEvents)
      .set(updates)
      .where(eq(emergencyEvents.id, id))
      .returning();
    return event || undefined;
  }
}

export const storage = new DatabaseStorage();