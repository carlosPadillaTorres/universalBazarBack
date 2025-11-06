import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Welcome message' })
  @ApiResponse({ status: 200, description: 'Returns welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint with database info' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns health status, database connection info, and collections' 
  })
  async getHealth() {
    return this.appService.getHealthCheck();
  }

  @Get('healthy')
  @ApiOperation({ summary: 'Simple health check (legacy)' })
  @ApiResponse({ status: 200, description: 'Returns simple health message' })
  getHealthy(): string {
    return this.appService.getHello();
  }
}
