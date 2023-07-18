import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

/**
 * App Controller of Web Scrapper API
 *
 * @export
 * @class AppController
 * @typedef {AppController}
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns the Welcome App Title
   *
   * @returns {string}
   */
  @ApiTags('App')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
