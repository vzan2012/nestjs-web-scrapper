import { Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';

/**
 * Puppeteer Service
 *
 * @export
 * @class PuppeteerModule
 * @typedef {PuppeteerModule}
 */
@Module({
  providers: [PuppeteerService],
})
export class PuppeteerModule {}
