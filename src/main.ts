import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './commons/response.interceptor';
import { AllExceptionsFilter } from './commons/http-exception.filter';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

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
