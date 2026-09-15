const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DayNight Pilot canonical database...');

  // 1. Organization & Workspace
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-org' },
    update: {},
    create: {
      name: 'Acme Career Org',
      slug: 'acme-org'
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: 'ws-default-1' },
    update: {},
    create: {
      id: 'ws-default-1',
      organizationId: org.id,
      name: 'Personal Workspace',
      slug: 'personal-workspace',
      isDefault: true
    }
  });

  // 2. User & Membership
  const user = await prisma.user.upsert({
    where: { email: 'ganesh@example.com' },
    update: {},
    create: {
      id: 'usr-1',
      name: 'Ganesh',
      email: 'ganesh@example.com'
    }
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
    update: {},
    create: {
      userId: user.id,
      organizationId: org.id,
      role: 'OWNER'
    }
  });

  console.log('✅ Canonical database seeded successfully!');
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
