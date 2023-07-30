import { Injectable } from '@nestjs/common';
import * as Puppeteer from 'puppeteer';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';
import { InnerPage, Link } from './model';

/**
 * Scrapping Service
 *
 * @export
 * @class ScrappingService
 * @typedef {ScrappingService}
 */
@Injectable()
export class ScrappingService {
  constructor(private puppeteerService: PuppeteerService) {}

  generateId = this.puppeteerService.generateUniqueIdV4();
  /**
   * Return the Page Basic Data By Given URL
   *
   * @async
   * @param {string} url
   * @returns {Promise<{pageTitle: string;pageDescription: string;pageLinks: {elements: {id: string;class: string;innerText: string;url: string;}[];};inputTypes: {length: number;elements: {...;}[];};
}>}
   */
  scrapePageBasicData = async (url: string) => {
    try {
      const browser = await this.puppeteerService.launchBrowser();
      const page = await this.puppeteerService.getNewPage(browser);

      let pageDescription = '';

      // Navigate Page
      await this.puppeteerService.navigatePage(page, url);

      // Set the Viewport
      await this.puppeteerService.setPageViewport(page, {
        width: 1080,
        height: 1024,
      });

      const pageTitle = (await this.puppeteerService.checkElementExists(
        page,
        'title',
      ))
        ? await page.$eval('title', (element) => element.innerText)
        : '-';

      const pageLinks = await page.$$eval(
        'a',
        (elements, generateId) =>
          elements.map((element) => ({
            uuid: generateId,
            id: element.getAttribute('id'),
            class: element.getAttribute('class'),
            innerText: element.innerText,
            url: element.getAttribute('href'),
          })),
        this.generateId,
      );

      const inputTypes = await page.$$eval(
        'input',
        (elements, generateId) =>
          elements.map((element) => ({
            uuid: generateId,
            id: element.getAttribute('id'),
            class: element.getAttribute('class'),
            type: element.getAttribute('type'),
            innerText: element.innerText,
            value: element.value,
          })),
        this.generateId,
      );

      pageDescription = await this.puppeteerService.getPageMetaDescription(
        page,
      );

      await this.puppeteerService.closeBrowser();

      return {
        pageTitle,
        pageDescription,
        pageLinks: {
          length: pageLinks.length,
          elements: pageLinks,
        },
        inputTypes: {
          length: inputTypes.length,
          elements: inputTypes,
        },
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  /**
   * Returns the fileName and imagedata of the given webpage URL
   *
   * @async
   * @param {string} url
   * @returns {Promise<{fileName: string;imageDataUrl: string | Buffer;}>}
   */
  getScreenshotPageByUrl = async (url: string) => {
    try {
      const browser = await this.puppeteerService.launchBrowser();
      const page = await this.puppeteerService.getNewPage(browser);
      const domainName = this.puppeteerService.getDomainName(url);

      // Navigate Page
      await this.puppeteerService.navigatePage(page, url);

      const imageDataUrl =
        await this.puppeteerService.getScreenshotPageForDownload(page, {
          encoding: 'binary',
          fullPage: true,
        });

      await this.puppeteerService.closeBrowser();

      return { fileName: domainName, imageDataUrl };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };

  /**
   * Scrape Single Page Information
   *
   * @async
   * @param {Puppeteer.Page} page
   * @param {string} url
   * @returns {Promise<InnerPage>}
   */
  scrapeSinglePage = async (
    page: Puppeteer.Page,
    url: string,
  ): Promise<InnerPage> => {
    try {
      // Navigate Page
      await this.puppeteerService.navigatePage(page, url);

      // Set the Viewport
      await this.puppeteerService.setPageViewport(page, {
        width: 1080,
        height: 1024,
      });

      const pageTitle = (await this.puppeteerService.checkElementExists(
        page,
        'title',
      ))
        ? await page.$eval('title', (element) => element.innerText)
        : '-';

      const pageMetaDescription =
        await this.puppeteerService.getPageMetaDescription(page);

      // TODO: Need to Format Information
      // const pageBodyContents = await this.puppeteerService.getPageBody(page);

      return {
        pageTitle,
        pageMetaDescription,
        // pageBodyContents
      };
    } catch (error) {
      throw error;
    }
  };

  /**
   * Returns the Scrape Page Data by Given URL
   *
   * @async
   * @param {string} url
   * @returns {Promise<any>}
   */
  scrapePagesData = async (url: string) => {
    try {
      const browser = await this.puppeteerService.launchBrowser();
      const page = await this.puppeteerService.getNewPage(browser);

      // Navigate Page
      await this.puppeteerService.navigatePage(page, url);

      // Set the Viewport
      await this.puppeteerService.setPageViewport(page, {
        width: 1080,
        height: 1024,
      });

      const pageTitle = (await this.puppeteerService.checkElementExists(
        page,
        'title',
      ))
        ? await page.$eval('title', (element) => element.innerText)
        : '-';

      const allPageLinks = await page.$$eval('a', (elements) =>
        elements.map((element) => element),
      );

      const innerPageLinks: Link[] = await page.$$eval(
        'a',
        (elements, generateId) =>
          elements
            .filter(
              (element) =>
                element.innerText !== '' &&
                element.target !== '_blank' &&
                !element.href.includes('mailto:'),
            )
            .map((element) => {
              return {
                uuid: generateId,
                target: element.target,
                href: element.href,
                innerText: element.innerText,
              };
            }),
        this.generateId,
      );

      for (const link of innerPageLinks) {
        const innerPageContents = await this.scrapeSinglePage(page, link.href);
        link.contents = innerPageContents;
      }

      await this.puppeteerService.closeBrowser();

      return {
        pageTitle,
        links: {
          totalNumberOfLinks: {
            count: allPageLinks.length,
          },
          innerPageLinks: {
            count: innerPageLinks.length,
            pages: await Promise.all(innerPageLinks),
          },
        },
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
}
