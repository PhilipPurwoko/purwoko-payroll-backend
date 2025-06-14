import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { PrismaClient, User } from '@prisma/client';

dotenv.config();

const prisma: PrismaClient = new PrismaClient();

async function main() {
  const users: User[] = [
    {
      id: v4(),
      name: 'admin',
      email: 'admin@purwoko.dev',
      password: process.env.MASTER_PASSWORD || 'password',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      deletedBy: null,
    },
  ];

  const round = parseInt(process.env.SALT_ROUNDS || '10');
  for (const user of users) {
    const { password, ...rest } = user;
    const hashedPassword = bcrypt.hashSync(password, round);
    await prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
