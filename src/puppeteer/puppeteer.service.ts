import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Dimensions } from './model';

@Injectable()
export class PuppeteerService {
  private browser: puppeteer.Browser;

  launchBrowser = async () => {
    this.browser = await puppeteer.launch({ headless: 'new' });
    return this.browser;
  };

  getNewPage = async (browser: puppeteer.Browser) => {
    return await browser.newPage();
  };

  navigatePage = async (page: puppeteer.Page, url: string) => {
    return await page.goto(url);
  };

  setPageViewport = async (page: puppeteer.Page, dimension: Dimensions) => {
    return await page.setViewport(dimension);
  };

  checkElementExists = async (page: puppeteer.Page, elementName: string) =>
    await page.$(elementName);

  getDomainName = (url: string) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.hostname.split('.')[1];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  getScreenshotPageForDownload = async (page: puppeteer.Page) => {
    try {
      const screenshotImageData = await page.screenshot({ encoding: 'base64' });
      const imageDataUrl = `data:image/png;base64,${screenshotImageData}`;
      return imageDataUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  closeBrowser = async () => await this.browser.close();
}
