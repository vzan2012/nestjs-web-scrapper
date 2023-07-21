import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';

@Injectable()
export class ScrappingService {
  constructor(private puppeteerService: PuppeteerService) {}

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

      const pageLinks = await page.$$eval('a', (elements) =>
        elements.map((element) => ({
          id: element.getAttribute('id'),
          class: element.getAttribute('class'),
          innerText: element.innerText,
          url: element.getAttribute('href'),
        })),
      );

      const inputTypes = await page.$$eval('input', (elements) =>
        elements.map((element) => ({
          id: element.getAttribute('id'),
          class: element.getAttribute('class'),
          type: element.getAttribute('type'),
          innerText: element.innerText,
          value: element.value,
        })),
      );
      pageDescription = (await this.puppeteerService.checkElementExists(
        page,
        'meta[name="description"]',
      ))
        ? await page.$eval(
            'meta[name="description"]',
            (element) => element.content,
          )
        : '-';

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

      const innerPageLinks = await page.$$eval('a', (elements) =>
        elements
          .filter(
            (element) =>
              element.innerText !== '' &&
              element.target !== '_blank' &&
              !element.href.includes('mailto:'),
          )
          .map((element) => ({
            target: element.target,
            href: element.href,
            innerText: element.innerText,
            contents: '-',
          })),
      );

      await this.puppeteerService.closeBrowser();

      return {
        pageTitle,
        links: {
          totalNumberOfLinks: {
            count: allPageLinks.length,
          },
          innerPageLinks: {
            count: innerPageLinks.length,
            pages: innerPageLinks,
          },
        },
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
}
