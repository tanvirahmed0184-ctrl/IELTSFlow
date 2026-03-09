export const APP_NAME = "IELTS Flow";
export const APP_DESCRIPTION = "AI-Powered IELTS Mock Test Platform";

export const IELTS_MODULES = ["listening", "reading", "writing", "speaking"] as const;
export type IELTSModule = (typeof IELTS_MODULES)[number];

export const TEST_VARIANTS = ["academic", "general"] as const;
export type TestVariant = (typeof TEST_VARIANTS)[number];

export const LISTENING_DURATION_SECONDS = 30 * 60;
export const READING_DURATION_SECONDS = 60 * 60;
export const WRITING_DURATION_SECONDS = 60 * 60;
export const WRITING_TASK1_MIN_WORDS = 150;
export const WRITING_TASK2_MIN_WORDS = 250;

export const SPEAKING_PART1_DURATION_SECONDS = 4 * 60 + 30;
export const SPEAKING_PART2_PREP_SECONDS = 60;
export const SPEAKING_PART2_DURATION_SECONDS = 2 * 60;
export const SPEAKING_PART3_DURATION_SECONDS = 5 * 60;

export const USER_ROLES = ["guest", "student", "instructor", "admin", "super_admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
