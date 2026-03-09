export const APP_NAME = "IELTS Flow";
export const APP_DESCRIPTION = "AI-Powered IELTS Mock Test Platform";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const IELTS_MODULES = ["LISTENING", "READING", "WRITING", "SPEAKING"] as const;
export type IELTSModule = (typeof IELTS_MODULES)[number];

export const TEST_VARIANTS = ["ACADEMIC", "GENERAL"] as const;
export type TestVariantType = (typeof TEST_VARIANTS)[number];

export const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const WRITING_TASK_TYPES = ["TASK_1_ACADEMIC", "TASK_1_GENERAL", "TASK_2"] as const;
export type WritingTaskType = (typeof WRITING_TASK_TYPES)[number];

export const SPEAKING_PARTS = ["PART_1", "PART_2", "PART_3"] as const;
export type SpeakingPart = (typeof SPEAKING_PARTS)[number];

export const USER_ROLES = ["GUEST", "STUDENT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"] as const;
export type UserRoleType = (typeof USER_ROLES)[number];

export const SUBSCRIPTION_TIERS = ["FREE", "BASIC", "PRO", "PREMIUM"] as const;
export type SubscriptionTierType = (typeof SUBSCRIPTION_TIERS)[number];

// IELTS timing constants (in seconds)
export const LISTENING_DURATION_SECS = 30 * 60;
export const READING_DURATION_SECS = 60 * 60;
export const WRITING_DURATION_SECS = 60 * 60;
export const WRITING_TASK1_DURATION_SECS = 20 * 60;
export const WRITING_TASK2_DURATION_SECS = 40 * 60;

export const WRITING_TASK1_MIN_WORDS = 150;
export const WRITING_TASK2_MIN_WORDS = 250;

export const SPEAKING_PART1_DURATION_SECS = 4 * 60 + 30;
export const SPEAKING_PART2_PREP_SECS = 60;
export const SPEAKING_PART2_SPEAK_SECS = 2 * 60;
export const SPEAKING_PART3_DURATION_SECS = 5 * 60;
export const SPEAKING_TOTAL_DURATION_SECS = 11 * 60 + 30;

// IELTS question counts per module
export const LISTENING_TOTAL_QUESTIONS = 40;
export const READING_TOTAL_QUESTIONS = 40;
export const LISTENING_SECTIONS = 4;
export const READING_SECTIONS = 3;

// Band score constants
export const MIN_BAND = 0;
export const MAX_BAND = 9;
export const BAND_INCREMENT = 0.5;
export const BAND_SCORES = Array.from(
  { length: (MAX_BAND - MIN_BAND) / BAND_INCREMENT + 1 },
  (_, i) => MIN_BAND + i * BAND_INCREMENT
);

// Gemini embedding dimensions
export const EMBEDDING_DIMENSIONS = 768;

// File upload limits
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_FILE_TYPES = ["pdf", "docx", "txt", "csv", "png", "jpg", "jpeg", "webp"] as const;

// Booking defaults
export const DEFAULT_SESSION_DURATION_MINS = 15;
export const BOOKING_REMINDER_HOURS_BEFORE = 1;

// Autosave interval for writing
export const WRITING_AUTOSAVE_INTERVAL_MS = 30_000;
