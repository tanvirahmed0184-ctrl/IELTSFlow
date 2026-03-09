// Prisma client singleton for Next.js
// NOTE: Prisma v7 requires a driver adapter at runtime.
// For scaffolding, we use a lazy initialization pattern.
// Actual adapter setup will be configured when Supabase is connected.

import { PrismaClient } from "@/lib/generated/prisma/client";

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientInstance | undefined;
};

function createPrismaClient(): PrismaClientInstance {
  // @ts-expect-error -- adapter will be provided when database is configured
  return new PrismaClient({ adapter: null });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
