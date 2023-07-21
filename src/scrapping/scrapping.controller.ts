import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScrappingService } from './scrapping.service';
import { PuppeteerService } from 'src/puppeteer/puppeteer.service';

@ApiTags('Scrapping')
@Controller('scrapping')
export class ScrappingController {
  constructor(
    private puppeteerService: PuppeteerService,
    private scrappingService: ScrappingService,
  ) {}

  @ApiOperation({ summary: 'Get Scrapping Data By Url' })
  @ApiResponse({
    status: 200,
    description: 'Retrives Scrapping Data',
  })
  @Get(':url')
  getScrapeData(@Param('url') url: string) {
    return this.scrappingService.scrapePageBasicData(url);
  }

  @ApiOperation({ summary: 'Downloads the Page Screenshot' })
  @ApiResponse({
    status: 200,
    description: 'Downloads the Page Screenshot',
  })
  @Get('/screenshot/:url')
  async getScreenshotPage(@Res() res, @Param('url') url: string) {
    try {
      const { fileName: imageFileName, imageDataUrl } =
        await this.scrappingService.getScreenshotPageByUrl(url);

      res.set({
        'Content-Disposition': `attachment;filename="${imageFileName}.png"`,
        'Content-Type': 'image/png',
      });

      res.send(imageDataUrl);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get Scrapping All Pages Data By Url' })
  @ApiResponse({
    status: 200,
    description:
      'Retrives Scrapping Data of all pages from the site - first level links',
  })
  @Get('/pages/:url')
  getScrapePagesData(@Param('url') url: string) {
    return this.scrappingService.scrapePagesData(url);
  }
}
