import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { Prisma, PrismaClient, User } from '@prisma/client';

import { m, parseTimeToDate } from '../util/date.util';
import { convertToEmail, getRandomName } from './name';

dotenv.config();

const prisma: PrismaClient = new PrismaClient();

async function main() {
  console.log('[SEEDER] START');

  const now = m();
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
      hourlyRate: null,
      overtimeRate: null,
      overtimeMultiplier: null,
      createdAt: now.utc().toDate(),
      updatedAt: now.utc().toDate(),
      updatedBy: null,
      deletedAt: null,
      createdBy: null,
      deletedBy: null,
    },
  ];

  const hourlyRates = [50000, 100000, 150000, 200000, 250000, 300000];
  for (let i = 0; i < 100; i++) {
    const id = v4();
    const hourlyRate =
      hourlyRates[Math.floor(Math.random() * hourlyRates.length)];
    const overtimeMultiplier = 2;
    const overtimeRate = hourlyRate * overtimeMultiplier;
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
      hourlyRate: hourlyRate,
      overtimeMultiplier: new Prisma.Decimal(overtimeMultiplier),
      overtimeRate: overtimeRate,
      createdAt: now.utc().toDate(),
      updatedAt: now.utc().toDate(),
      updatedBy: null,
      deletedAt: null,
      createdBy: null,
      deletedBy: null,
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  const startHour = parseTimeToDate('09:00:00');
  const endHour = parseTimeToDate('17:00:00');

  const attendanceConfigurationId = await prisma.attendanceConfiguration.create(
    {
      data: {
        startAt: startHour.utc().toDate(),
        endAt: endHour.utc().toDate(),
        createdAt: now.utc().toDate(),
        updatedAt: now.utc().toDate(),
        updatedBy: null,
        deletedAt: null,
        createdBy: null,
        deletedBy: null,
      },
    },
  );

  const firstDate = now.clone().startOf('month');
  const lastDate = now.clone().endOf('month');

  await prisma.attendancePeriod.create({
    data: {
      startAt: firstDate.utc().toDate(),
      endAt: lastDate.utc().toDate(),
      attendanceConfigurationId: attendanceConfigurationId.id,
      createdAt: now.utc().toDate(),
      updatedAt: now.utc().toDate(),
      updatedBy: null,
      deletedAt: null,
      createdBy: null,
      deletedBy: null,
    },
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
