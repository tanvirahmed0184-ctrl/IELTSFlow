// Prisma client singleton for Next.js
// Uses lazy initialization so the build doesn't fail without a DB.
// Actual adapter setup will be configured when Supabase is connected.

import { PrismaClient } from "@/lib/generated/prisma/client";

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  _prisma: PrismaClientInstance | undefined;
};

function createPrismaClient(): PrismaClientInstance {
  // @ts-expect-error -- adapter will be provided when database is configured
  return new PrismaClient({ adapter: null });
}

export function getPrisma(): PrismaClientInstance {
  if (globalForPrisma._prisma) return globalForPrisma._prisma;
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma._prisma = client;
  }
  return client;
}

/**
 * Lazy proxy that defers PrismaClient creation until first property access.
 * This prevents build-time errors when no database adapter is configured.
 */
export const prisma = new Proxy({} as PrismaClientInstance, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default prisma;
