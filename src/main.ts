import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Water Tariff Management API')
    .setDescription(
      'API for managing water tariff billing system with slab-based pricing, user management, and approval workflows',
    )
    .setVersion('1.0')
    .addTag('admins', 'Admin user management and authentication')
    .addTag('users', 'Customer user management')
    .addTag('roles', 'Role management')
    .addTag('city-corporations', 'City corporation management')
    .addTag('zones', 'Zone management')
    .addTag('wards', 'Ward management')
    .addTag('tariff-plans', 'Tariff plan and slab-based pricing')
    .addTag('tariff-rules', 'Legacy tariff rules')
    .addTag('approval-status', 'Approval status lookup')
    .addTag('approval-requests', 'Approval request management')
    .addTag('audit-logs', 'Audit log tracking')
    .addTag('notifications', 'Notification management')
    .addTag('consumption', 'Water consumption tracking and approval')
    .addTag('water-bills', 'Water bill management and payment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `API Documentation available at: http://localhost:${process.env.PORT ?? 3000}/api-docs`,
  );
}
bootstrap();
