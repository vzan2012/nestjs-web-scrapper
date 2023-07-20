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

      const pageTitle = await page.$eval(
        'title',
        (element) => element.innerText,
      );

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
        await this.puppeteerService.getScreenshotPageForDownload(page);

      console.log(imageDataUrl);

      await this.puppeteerService.closeBrowser();

      return { fileName: domainName, imageDataUrl };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  };
}
