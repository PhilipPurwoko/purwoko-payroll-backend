import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { PrismaClient, User } from '@prisma/client';
import { convertToEmail, getRandomName } from './name';

dotenv.config();

const prisma: PrismaClient = new PrismaClient();

async function main() {
  console.log('[SEEDER] START');

  const round = parseInt(process.env.SALT_ROUNDS || '10');
  const masterPassword = process.env.MASTER_PASSWORD || 'password';
  const masterHashedPassword = bcrypt.hashSync(masterPassword, round);

  const users: User[] = [
    {
      id: v4(),
      name: 'admin',
      email: 'admin@purwoko.dev',
      password: masterHashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: null,
      deletedAt: null,
      createdBy: null,
      deletedBy: null,
    },
  ];

  for (let i = 0; i < 100; i++) {
    const id = v4();
    const name = getRandomName();
    const email = convertToEmail(name);
    const password = process.env.SEEDER_PASSWORD || 'password';
    const hashedPassword = bcrypt.hashSync(password, round);
    users.push({
      id: id,
      name: name,
      email: email,
      password: hashedPassword,
      role: 'employee',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: null,
      deletedAt: null,
      createdBy: null,
      deletedBy: null,
    });
  }

  await prisma.user.createMany({
    data: users,
  });
  console.log('[SEEDER] END');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
