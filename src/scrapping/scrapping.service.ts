import { Injectable } from '@nestjs/common';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';

@Injectable()
export class ScrappingService {
  constructor(private puppeteerService: PuppeteerService) {}

  checkElementExists = (page, elementName: string): boolean => {
    return page.$(elementName);
  };

  scrapePageBasicData = async (url: string) => {
    const browser = await this.puppeteerService.launchBrowser();
    const page = await browser.newPage();

    let pageDescription = '';
    // Navigate Page
    await page.goto(url);

    await page.setViewport({ width: 1080, height: 1024 });

    const pageTitle = await page.$eval('title', (element) => element.innerText);
    // pageDescription = this.checkElementExists(page, 'meta[name="description"]')
    //   ? await page.$eval(
    //       'meta[name="description"]',
    //       (element) => element.content,
    //     )
    //   : '-';

    return { pageTitle, pageDescription };

    // await this.puppeteerService.closeBrowser();
  };
}
