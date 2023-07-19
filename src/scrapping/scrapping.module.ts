import { Module } from '@nestjs/common';
import { ScrappingService } from './scrapping.service';
import { ScrappingController } from './scrapping.controller';
import { PuppeteerModule } from 'src/puppeteer/puppeteer.module';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';

@Module({
  imports: [PuppeteerModule],
  providers: [ScrappingService, PuppeteerService],
  controllers: [ScrappingController],
})
export class ScrappingModule {}
