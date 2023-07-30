import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { Dimensions } from './model';

/**
 * Puppeteer Service
 *
 * @export
 * @class PuppeteerService
 * @typedef {PuppeteerService}
 */
@Injectable()
export class PuppeteerService {
  private browser: puppeteer.Browser;

  /**
   * Launch Browser
   *
   * @async
   * @returns {Promise<puppeteer.Browser>}
   */
  launchBrowser = async () => {
    this.browser = await puppeteer.launch({ headless: 'new' });
    return this.browser;
  };

  /**
   * Get New Page
   *
   * @async
   * @param {puppeteer.Browser} browser
   * @returns {Promise<puppeteer.Page>}
   */
  getNewPage = async (browser: puppeteer.Browser) => {
    return await browser.newPage();
  };

  /**
   * Navigate Page
   *
   * @async
   * @param {puppeteer.Page} page
   * @param {string} url
   * @returns {Promise<puppeteer.HTTPResponse>}
   */
  navigatePage = async (page: puppeteer.Page, url: string) => {
    return await page.goto(url);
  };

  /**
   * Set the page viewport
   *
   * @async
   * @param {puppeteer.Page} page
   * @param {Dimensions} dimension
   * @returns {Promise<void>}
   */
  setPageViewport = async (page: puppeteer.Page, dimension: Dimensions) => {
    return await page.setViewport(dimension);
  };

  /**
   * Check HTML Element exists or not
   *
   * @async
   * @param {puppeteer.Page} page
   * @param {string} elementName
   * @returns {Promise<puppeteer.ElementHandle<Element>>}
   */
  checkElementExists = async (page: puppeteer.Page, elementName: string) =>
    await page.$(elementName);

  /**
   * Returns the domain name
   *
   * @param {string} url
   * @returns {*}
   */
  getDomainName = (url: string) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.hostname.split('.')[1];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  /**
   * Page Screenshot For Download
   *
   * @async
   * @param {puppeteer.Page} page
   * @param {?puppeteer.ScreenshotOptions} [options]
   * @returns {Promise<string | Buffer>}
   */
  getScreenshotPageForDownload = async (
    page: puppeteer.Page,
    options?: puppeteer.ScreenshotOptions,
  ) => {
    try {
      const screenshotImageData: Buffer | string = await page.screenshot(
        options,
      );
      return screenshotImageData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Generate Unique Id of Version 3 - Refer UUID npm package library
   *
   * @returns {string}
   */
  generateUniqueIdV4 = () => uuidv4();

  /**
   * Get Page Meta Description
   *
   * @async
   * @param {puppeteer.Page} page
   * @returns {Promise<string>}
   */
  getPageMetaDescription = async (page: puppeteer.Page): Promise<string> => {
    return (await this.checkElementExists(page, 'meta[name="description"]'))
      ? await page.$eval(
          'meta[name="description"]',
          (element) => element.content,
        )
      : '-';
  };

  /**
   * Get Page Body
   *
   * @async
   * @param {puppeteer.Page} page
   * @returns {unknown}
   */
  getPageBody = async (page: puppeteer.Page) => {
    return page.$eval('body', (element) => element.innerHTML);
  };

  /**
   * Close the Browser
   *
   * @async
   * @returns {Promise<void>}
   */
  closeBrowser = async () => await this.browser.close();
}
