import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  private browser: puppeteer.Browser;

  launchBrowser = async () => {
    this.browser = await puppeteer.launch({ headless: 'new' });
    return this.browser;
  };
  closeBrowser = async () => await this.browser.close();
}
