import { auth } from "@clerk/nextjs/server";
import { createProfileSchema, type Profile } from "@/db/schema";
import { prisma } from "@/db";

// ---- GET PROFILE ----
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

// ---- CREATE PROFILE ----
export async function createProfile(profileData: {
  userId: string;
  email: string;
  role: "worker" | "business" | "admin";
  name: string;
  phone?: string;
  city: string;
  skills?: string[];
  companyName?: string;
  companyVat?: string;
}): Promise<Profile> {
  const validated = createProfileSchema.parse(profileData);

  // Admin auto-promotion
  // Supports both JSON array format: ["admin@gmail.com", "admin2@gmail.com"]
  // and comma-separated format: "admin@gmail.com, admin2@gmail.com"
  let adminEmails: string[] = [];

  if (process.env.ADMIN_EMAILS) {
    try {
      // Try parsing as JSON array first
      adminEmails = JSON.parse(process.env.ADMIN_EMAILS);
      if (!Array.isArray(adminEmails)) {
        throw new Error('Not an array');
      }
    } catch {
      // Fallback to comma-separated format
      adminEmails = process.env.ADMIN_EMAILS.split(",").map((e) => e.trim());
    }
  }

  const isAdmin = adminEmails.includes(validated.email);

  try {
    const profile = await prisma.profile.upsert({
      where: { id: validated.userId },
      update: {
        email: validated.email,
        role: isAdmin ? "admin" : validated.role,
        name: validated.name,
        phone: validated.phone ?? null,
        city: validated.city,
        skills: validated.skills ?? undefined,
        companyName: validated.companyName ?? null,
        companyVat: validated.companyVat ?? null,
      },
      create: {
        id: validated.userId,
        email: validated.email,
        role: isAdmin ? "admin" : validated.role,
        name: validated.name,
        phone: validated.phone ?? null,
        city: validated.city,
        skills: validated.skills ?? undefined,
        companyName: validated.companyName ?? null,
        companyVat: validated.companyVat ?? null,
      },
    });

    return profile;
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    throw new Error("Failed to create/update profile");
  }
}

// ---- UPDATE PROFILE ----
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile> {
  // Remove undefined fields
  const cleanUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined)
  );

  try {
    const profile = await prisma.profile.update({
      where: { id: userId },
      data: cleanUpdates,
    });

    return profile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}

// ---- AUTH HELPERS ----
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function requireRole(
  userId: string,
  requiredRoles: string[]
): Promise<Profile> {
  const profile = await getProfile(userId);

  if (!profile || !requiredRoles.includes(profile.role)) {
    throw new Error("Forbidden");
  }

  return profile;
}

