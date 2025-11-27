import { z } from "zod";
import type { Prisma } from "@prisma/client";

// Re-export Prisma types
export type {
  Profile,
  Job,
  Application,
  Booking,
  Review,
  Role,
  JobStatus,
  ApplicationStatus,
  BookingStatus,
} from "@prisma/client";

// Zod validation schemas for API endpoints
export const createProfileSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  role: z.enum(['worker', 'business', 'admin']),
  name: z.string().min(1),
  phone: z.string().optional(),
  city: z.string().min(1),
  skills: z.array(z.string()).optional(),
  companyName: z.string().optional(),
  companyVat: z.string().optional(),
});

export const createJobSchema = z.object({
  createdBy: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  hourlyRate: z.number().positive(),
  joiningBy: z.date().optional(),
  status: z.enum(['open', 'closed', 'filled']).optional(),
});

export const createApplicationSchema = z.object({
  jobId: z.string(),
  workerId: z.string(),
  coverNote: z.string().optional(),
});

export const createBookingSchema = z.object({
  applicationId: z.string(),
  confirmedBy: z.string(),
  start: z.date(),
  end: z.date(),
  status: z.enum(['confirmed', 'completed', 'canceled']).optional(),
});

export const createReviewSchema = z.object({
  jobId: z.string(),
  raterId: z.string(),
  rateeId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// Prisma input types for convenience
export type ProfileCreateInput = Prisma.ProfileCreateInput;
export type ProfileUpdateInput = Prisma.ProfileUpdateInput;

export type JobCreateInput = Prisma.JobCreateInput;
export type JobUpdateInput = Prisma.JobUpdateInput;

export type ApplicationCreateInput = Prisma.ApplicationCreateInput;
export type ApplicationUpdateInput = Prisma.ApplicationUpdateInput;

export type BookingCreateInput = Prisma.BookingCreateInput;
export type BookingUpdateInput = Prisma.BookingUpdateInput;

export type ReviewCreateInput = Prisma.ReviewCreateInput;
export type ReviewUpdateInput = Prisma.ReviewUpdateInput;

// Legacy type aliases for backward compatibility
export type NewProfile = Prisma.ProfileCreateInput;
export type NewJob = Prisma.JobCreateInput;
export type NewApplication = Prisma.ApplicationCreateInput;
export type NewBooking = Prisma.BookingCreateInput;
export type NewReview = Prisma.ReviewCreateInput;
