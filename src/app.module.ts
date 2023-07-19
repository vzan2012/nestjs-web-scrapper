import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { ScrappingModule } from './scrapping/scrapping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    PuppeteerModule,
    ScrappingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
