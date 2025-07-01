import { db } from "./db";
import { users, familyMembers, securitySettings } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database with initial data...");

    // Create default parent user
    const [parentUser] = await db
      .insert(users)
      .values({
        username: "parent",
        password: "password", // In production, this should be hashed
        email: "parent@family.com",
        fullName: "Parent User",
        role: "parent"
      })
      .returning();

    console.log("Created parent user:", parentUser);

    // Create family members
    const [daughter] = await db
      .insert(familyMembers)
      .values({
        userId: parentUser.id,
        parentId: parentUser.id,
        name: "Emma",
        age: 14,
        role: "child",
        permissions: {
          apps: ["TikTok", "Instagram", "Snapchat"],
          timeRestrictions: {
            "TikTok": { start: "20:00", end: "08:00" },
            "Instagram": { start: "21:00", end: "07:00" }
          },
          networkAccess: true,
          contacts: ["Mom", "Dad", "School"]
        },
        isActive: true
      })
      .returning();

    const [spouse] = await db
      .insert(familyMembers)
      .values({
        userId: parentUser.id,
        parentId: parentUser.id,
        name: "Alex",
        age: 42,
        role: "parent",
        permissions: null,
        isActive: true
      })
      .returning();

    console.log("Created family members:", [daughter, spouse]);

    // Create default security settings
    const [defaultSettings] = await db
      .insert(securitySettings)
      .values({
        userId: parentUser.id,
        faceIdEnabled: true,
        touchIdEnabled: true,
        voiceIdEnabled: false,
        networkControlEnabled: true,
        emergencyContacts: ["911", "+1234567890"],
        aiAssistantEnabled: true
      })
      .returning();

    console.log("Created security settings:", defaultSettings);
    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seedDatabase();