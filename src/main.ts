import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 9000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log', 'warn', 'verbose'],
  });

  await app.listen(PORT);
}
bootstrap();
