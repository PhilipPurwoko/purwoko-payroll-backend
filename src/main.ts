import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './commons/response.interceptor';
import { AllExceptionsFilter } from './commons/http-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { AppLogger } from './interceptor/logger.service';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ResponseInterceptor(), // Response Standardization
    new LoggingInterceptor(app.get(AppLogger)), // Logger
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Access NestJS queue instances
  const payrollQueue = app.get<Queue>(getQueueToken('payroll'));

  // Setup Bull Board
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/queues');

  createBullBoard({
    queues: [
      new (await import('@bull-board/api/bullAdapter')).BullAdapter(
        payrollQueue,
      ),
    ],
    serverAdapter,
  });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(
    '/queues',
    basicAuth({
      users: { admin: 'password' },
      challenge: true,
    }),
    serverAdapter.getRouter(),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Purwoko Payroll API')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      requestInterceptor: (req: { headers: { [x: string]: string } }) => {
        req.headers['accept'] = 'application/json';
        return req;
      },
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}

bootstrap();
