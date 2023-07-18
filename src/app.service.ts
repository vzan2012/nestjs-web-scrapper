import { Injectable } from '@nestjs/common';

/**
 * App Service for the App Controller
 *
 * @export
 * @class AppService
 * @typedef {AppService}
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Web Scrapper API';
  }
}
