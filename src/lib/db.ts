import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var` declarations in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Global Prisma Client Singleton
 * Prevents multiple instances of Prisma Client in development hot-reloading
 * and handles serverless connection reuse.
 */
export const db =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export default db;
