// @ts-nocheck
import { 
  users, familyMembers, devices, securitySettings, activities, emergencyEvents,
  type User, type InsertUser,
  type FamilyMember, type InsertFamilyMember,
  type Device, type InsertDevice,
  type SecuritySettings, type InsertSecuritySettings,
  type Activity, type InsertActivity,
  type EmergencyEvent, type InsertEmergencyEvent
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private familyMembers: Map<number, FamilyMember> = new Map();
  private devices: Map<number, Device> = new Map();
  private securitySettings: Map<number, SecuritySettings> = new Map();
  private activities: Map<number, Activity> = new Map();
  private emergencyEvents: Map<number, EmergencyEvent> = new Map();
  private currentId: number = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default parent user
    const parentUser: User = {
      id: 1,
      username: "parent",
      password: "password",
      email: "parent@family.com",
      fullName: "John Doe",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      role: "parent",
      createdAt: new Date(),
    };
    this.users.set(1, parentUser);

    // Create family members
    const daughter: FamilyMember = {
      id: 1,
      userId: 1,
      parentId: 1,
      name: "Emma",
      role: "child",
      profileImage: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
      age: 12,
      permissions: {
        apps: ["Games", "Educational"],
        timeRestrictions: {
          "Social Media": { start: "20:00", end: "08:00" },
          "YouTube": { start: "21:00", end: "08:00" }
        },
        networkAccess: true,
        contacts: ["Mom", "Dad", "School"]
      },
      isActive: true,
      createdAt: new Date()
    };

    const spouse: FamilyMember = {
      id: 2,
      userId: 1,
      parentId: 1,
      name: "Sarah",
      role: "spouse",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b332c269?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
      age: 35,
      permissions: {
        apps: [],
        timeRestrictions: {},
        networkAccess: true,
        contacts: []
      },
      isActive: true,
      createdAt: new Date()
    };

    this.familyMembers.set(1, daughter);
    this.familyMembers.set(2, spouse);

    // Create default security settings
    const defaultSettings: SecuritySettings = {
      id: 1,
      userId: 1,
      faceIdEnabled: true,
      touchIdEnabled: true,
      voiceIdEnabled: true,
      networkControlEnabled: true,
      emergencyContacts: ["+1234567890", "+0987654321"],
      aiAssistantEnabled: true,
      createdAt: new Date()
    };
    this.securitySettings.set(1, defaultSettings);

    this.currentId = 3;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      profileImage: insertUser.profileImage || null,
      role: insertUser.role || "parent",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Family member methods
  async getFamilyMembers(parentId: number): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values()).filter(
      member => member.parentId === parentId
    );
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    return this.familyMembers.get(id);
  }

  async createFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const id = this.currentId++;
    const member: FamilyMember = { 
      ...insertMember, 
      id, 
      profileImage: insertMember.profileImage || null,
      age: insertMember.age || null,
      permissions: insertMember.permissions || null,
      isActive: insertMember.isActive ?? true,
      createdAt: new Date() 
    };
    this.familyMembers.set(id, member);
    return member;
  }

  async updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const member = this.familyMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates };
    this.familyMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteFamilyMember(id: number): Promise<boolean> {
    return this.familyMembers.delete(id);
  }

  // Device methods
  async getDevices(userId: number): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(
      device => device.userId === userId
    );
  }

  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.currentId++;
    const device: Device = { 
      ...insertDevice, 
      id, 
      createdAt: new Date() 
    };
    this.devices.set(id, device);
    return device;
  }

  async updateDevice(id: number, updates: Partial<Device>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updates };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<boolean> {
    return this.devices.delete(id);
  }

  // Security settings methods
  async getSecuritySettings(userId: number): Promise<SecuritySettings | undefined> {
    return Array.from(this.securitySettings.values()).find(
      settings => settings.userId === userId
    );
  }

  async createSecuritySettings(insertSettings: InsertSecuritySettings): Promise<SecuritySettings> {
    const id = this.currentId++;
    const settings: SecuritySettings = { 
      ...insertSettings, 
      id, 
      createdAt: new Date() 
    };
    this.securitySettings.set(id, settings);
    return settings;
  }

  async updateSecuritySettings(userId: number, updates: Partial<SecuritySettings>): Promise<SecuritySettings | undefined> {
    const settings = Array.from(this.securitySettings.values()).find(
      s => s.userId === userId
    );
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates };
    this.securitySettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }

  // Activity methods
  async getActivities(userId: number, limit: number = 50): Promise<Activity[]> {
    const userActivities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())
      .slice(0, limit);
    
    return userActivities;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      timestamp: new Date() 
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Emergency methods
  async getEmergencyEvents(userId: number): Promise<EmergencyEvent[]> {
    return Array.from(this.emergencyEvents.values())
      .filter(event => event.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createEmergencyEvent(insertEvent: InsertEmergencyEvent): Promise<EmergencyEvent> {
    const id = this.currentId++;
    const event: EmergencyEvent = { 
      ...insertEvent, 
      id, 
      createdAt: new Date() 
    };
    this.emergencyEvents.set(id, event);
    return event;
  }

  async updateEmergencyEvent(id: number, updates: Partial<EmergencyEvent>): Promise<EmergencyEvent | undefined> {
    const event = this.emergencyEvents.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.emergencyEvents.set(id, updatedEvent);
    return updatedEvent;
  }
}

export const storage = new MemStorage();
