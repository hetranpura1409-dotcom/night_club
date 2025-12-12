import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): object {
        return {
            message: 'Nightclub API is running!',
            version: '0.1.0',
            status: 'healthy',
        };
    }

    @Get('health')
    healthCheck(): object {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
}
