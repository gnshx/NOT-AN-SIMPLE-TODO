// Canonical database client wrapper for DayNight Pilot.

let PrismaClientClass: any = null;

try {
  // Dynamically require @prisma/client to prevent build-time type errors
  const prismaModule = require('@prisma/client');
  PrismaClientClass = prismaModule.PrismaClient;
} catch (e) {
  // Prisma client not yet generated
}

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma =
  globalForPrisma.prisma ??
  (PrismaClientClass
    ? new PrismaClientClass({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    : null);

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma;
