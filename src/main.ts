import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { setupSwagger } from './swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './SHARED/guards/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

async function bootstrap() {
  //================ ...env config... ===============================
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
  const environment = process.env.NODE_ENV || 'development';
  const envFilePath = path.resolve(__dirname, '..', `.env.${environment}`);
  dotenv.config({ path: envFilePath });
  const logger = new Logger(process.env.NAME);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  const cacheManager = app.get(CACHE_MANAGER);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflector, jwtService, cacheManager));

  app.setGlobalPrefix('v1');
  setupSwagger(app);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 8066, () =>
    logger.log(
      `server is running on port ${process.env.PORT} ${process.env.NODE_ENV}`,
    ),
  );
}
bootstrap();
