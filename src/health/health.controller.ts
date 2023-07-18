import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

/**
 * Health Controller
 *
 * @export
 * @class HealthController
 * @typedef {HealthController}
 */
@ApiTags('Site Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  /**
   * To check the site is able to ping (communicate) popular search engines
   *
   * @returns {*}
   */
  @Get()
  @HealthCheck()
  @ApiTags('/')
  @ApiOperation({ summary: 'Get Site Health' })
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck('google', 'https://www.google.com', {
          timeout: 600,
        }),
      () =>
        this.http.pingCheck('bing', 'https://www.bing.com', {
          timeout: 600,
        }),
    ]);
  }
}
