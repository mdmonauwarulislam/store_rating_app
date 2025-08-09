// prisma/seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@gmail.com',
        address: 'Hyderbad',
        password: '$2b$10$91tPNyShQoClvy5bJwk3yekUwJMIPSMvY1zco1.4HUO5JlGTdS6zS',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin created');
  } else {
    console.log('⚠️ Admin already exists');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
