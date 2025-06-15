import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { RequestContext } from './commons/request-context.service';

describe('AppService', () => {
  let service: AppService;
  let prisma: PrismaService;

  const mockPrisma = {
    auditLog: {
      create: jest.fn(),
    },
  };

  const mockRequestContext = {
    get: jest.fn((key: string) => {
      if (key === 'requestId') return 'req-123';
      if (key === 'ip') return '127.0.0.1';
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RequestContext, useValue: mockRequestContext },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return Hello World', () => {
    expect(service.getHello()).toBe('Hello World!');
  });

  it('should call prisma.auditLog.create with correct data', async () => {
    const data = { action: 'LOGIN', userId: 'u123' };
    await service.auditLog(data);
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        ipAddress: '127.0.0.1',
        requestId: 'req-123',
        action: 'LOGIN',
        userId: 'u123',
      },
    });
  });
});
