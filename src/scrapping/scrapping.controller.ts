import { Controller, Get, Param } from '@nestjs/common';
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
  getScrapData(@Param('url') url: string) {
    return this.scrappingService.scrapePageBasicData(url);
  }
}
